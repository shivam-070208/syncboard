import type { Server as SocketIOServer } from "socket.io"
import { AuthToken } from "@workspace/shared"
import jwt from "@/utils/jwt"
import { getSession } from "@/utils/session"
import workspaceService from "@v1/services/workspace.service"
import { redisClient } from "@/config/redis"
import { workspacePersistQueue } from "@/jobs/workspace-persist.queue"
import { parseCookie } from "cookie"
import { SocketEvents } from "@workspace/shared"
import type {
  WorkspaceRemoteSyncPayload,
  PayloadData,
  WorkspaceCursorUpdatePayload,
  WorkspaceRemoteCursorPayload,
  WorkspaceCursorSurface,
} from "@workspace/shared"

const WORKSPACE_ROOM_PREFIX = "workspace:"

const getWorkspaceRoom = (workspaceId: string): string =>
  `${WORKSPACE_ROOM_PREFIX}${workspaceId}`

const getCollabChannel = (workspaceId: string): string =>
  `workspace:${workspaceId}:collab`

const getPresenceChannel = (workspaceId: string): string =>
  `workspace:${workspaceId}:presence`

const isCursorSurface = (value: unknown): value is WorkspaceCursorSurface =>
  value === "editor" || value === "canvas"

const clampUnit = (value: number): number => Math.min(1, Math.max(0, value))

function parseCursorUpdate(raw: unknown): {
  workspaceId: string
  surface: WorkspaceCursorSurface | null
  x: number | null
  y: number | null
} | null {
  if (!raw || typeof raw !== "object") return null
  const msg = raw as WorkspaceCursorUpdatePayload
  if (typeof msg.workspaceId !== "string" || !msg.workspaceId) return null
  if (msg.surface !== null && !isCursorSurface(msg.surface)) return null

  if (msg.surface === null) {
    return {
      workspaceId: msg.workspaceId,
      surface: null,
      x: null,
      y: null,
    }
  }

  if (
    typeof msg.x !== "number" ||
    typeof msg.y !== "number" ||
    Number.isNaN(msg.x) ||
    Number.isNaN(msg.y) ||
    !Number.isFinite(msg.x) ||
    !Number.isFinite(msg.y)
  ) {
    return null
  }

  return {
    workspaceId: msg.workspaceId,
    surface: msg.surface,
    x: clampUnit(msg.x),
    y: clampUnit(msg.y),
  }
}

export function registerWorkspaceSockets(io: SocketIOServer): void {
  io.use(async (socket, next) => {
    try {
      const headerCookie = socket.handshake?.headers?.cookie ?? ""
      if (typeof headerCookie !== "string") {
        next(new Error("Unauthorized"))
        return
      }
      const cookies = parseCookie(headerCookie)
      const token = cookies?.[AuthToken.ACCESS_TOKEN]
      if (!token) {
        next(new Error("Unauthorized"))
        return
      }
      const { userId } = jwt.verifyAccessToken(token)
      const session = await getSession(userId)
      if (!session?.user?.id) {
        next(new Error("Unauthorized"))
        return
      }
      socket.data.userId = session.user.id
      socket.data.userName =
        typeof session.user.name === "string" && session.user.name
          ? session.user.name
          : "Anonymous"
      next()
    } catch {
      next(new Error("Unauthorized"))
    }
  })

  io.on(SocketEvents.CONNECTION, (socket) => {
    const userId = socket.data.userId as string
    const userName = socket.data.userName as string

    const publishCursorState = async (
      workspaceId: string,
      state: {
        surface: WorkspaceCursorSurface | null
        x: number | null
        y: number | null
      }
    ) => {
      const envelope: WorkspaceRemoteCursorPayload = {
        workspaceId,
        userId,
        userName,
        surface: state.surface,
        x: state.x,
        y: state.y,
        ts: Date.now(),
        socketId: socket.id,
      }
      await redisClient.publish(
        getPresenceChannel(workspaceId),
        JSON.stringify(envelope)
      )
    }

    socket.on(
      SocketEvents.JOIN,
      async (workspaceId: unknown, ack?: (r: unknown) => void) => {
        try {
          if (typeof workspaceId !== "string" || !workspaceId) {
            if (typeof ack === "function") ack({ ok: false })
            return
          }
          await workspaceService.getWorkspaceById(workspaceId, userId)
          await socket.join(getWorkspaceRoom(workspaceId))
          if (typeof ack === "function") ack({ ok: true })
        } catch {
          if (typeof ack === "function") ack({ ok: false })
        }
      }
    )

    socket.on(SocketEvents.LEAVE, async (workspaceId: unknown) => {
      if (typeof workspaceId !== "string" || !workspaceId) return
      try {
        await publishCursorState(workspaceId, {
          surface: null,
          x: null,
          y: null,
        })
      } finally {
        await socket.leave(getWorkspaceRoom(workspaceId))
      }
    })

    socket.on(
      SocketEvents.SYNC,
      async (
        msg: { workspaceId?: string; source?: string; payload?: PayloadData },
        ack?: (r: unknown) => void
      ) => {
        try {
          const workspaceId = msg?.workspaceId
          const source = msg?.source
          const payload = msg?.payload
          if (typeof workspaceId !== "string" || !workspaceId) {
            if (typeof ack === "function") ack({ ok: false })
            return
          }
          if (!socket.rooms.has(getWorkspaceRoom(workspaceId))) {
            if (typeof ack === "function") ack({ ok: false })
            return
          }
          if (source !== "editor" && source !== "canvas") {
            if (typeof ack === "function") ack({ ok: false })
            return
          }
          if (
            payload === undefined ||
            payload === null ||
            typeof payload !== "object"
          ) {
            if (typeof ack === "function") ack({ ok: false })
            return
          }
          const envelope: WorkspaceRemoteSyncPayload = {
            userId,
            source,
            payload,
            ts: Date.now(),
            socketId: socket.id,
          }

          await redisClient.publish(
            getCollabChannel(workspaceId),
            JSON.stringify(envelope)
          )

          await workspacePersistQueue.add(
            "persist",
            {
              workspaceId,
              userId,
              source,
              payload,
            },
            {
              removeOnComplete: 500,
              removeOnFail: 200,
            }
          )

          if (typeof ack === "function") ack({ ok: true })
        } catch {
          if (typeof ack === "function") ack({ ok: false })
        }
      }
    )

    socket.on(
      SocketEvents.CURSOR_UPDATE,
      async (msg: unknown, ack?: (r: unknown) => void) => {
        try {
          const parsed = parseCursorUpdate(msg)
          if (!parsed) {
            if (typeof ack === "function") ack({ ok: false })
            return
          }
          if (!socket.rooms.has(getWorkspaceRoom(parsed.workspaceId))) {
            if (typeof ack === "function") ack({ ok: false })
            return
          }

          await publishCursorState(parsed.workspaceId, {
            surface: parsed.surface,
            x: parsed.x,
            y: parsed.y,
          })

          if (typeof ack === "function") ack({ ok: true })
        } catch {
          if (typeof ack === "function") ack({ ok: false })
        }
      }
    )

    socket.on("disconnecting", () => {
      const workspaceIds = Array.from(socket.rooms)
        .filter(
          (roomName) =>
            roomName.startsWith(WORKSPACE_ROOM_PREFIX) && roomName !== socket.id
        )
        .map((roomName) => roomName.slice(WORKSPACE_ROOM_PREFIX.length))

      if (workspaceIds.length === 0) return

      void Promise.allSettled(
        workspaceIds.map((workspaceId) =>
          publishCursorState(workspaceId, {
            surface: null,
            x: null,
            y: null,
          })
        )
      )
    })
  })
}
