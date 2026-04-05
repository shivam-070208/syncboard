import type { Server as SocketIOServer } from "socket.io"
import { AuthToken } from "@workspace/shared"
import jwt from "@/utils/jwt"
import { getSession } from "@/utils/session"
import workspaceService from "@v1/services/workspace.service"
import { redisClient } from "@/config/redis"
import { workspacePersistQueue } from "@/jobs/workspace-persist.queue"
import { parseCookie } from "cookie"
import { SocketEvents } from "@workspace/shared"
export type WorkspaceRemoteSyncPayload = {
  userId: string
  source: "editor" | "canvas"
  payload: unknown
  ts: number
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
      next()
    } catch {
      next(new Error("Unauthorized"))
    }
  })

  io.on(SocketEvents.CONNECTION, (socket) => {
    const userId = socket.data.userId as string

    socket.on(
      SocketEvents.JOIN,
      async (workspaceId: unknown, ack?: (r: unknown) => void) => {
        try {
          if (typeof workspaceId !== "string" || !workspaceId) {
            if (typeof ack === "function") ack({ ok: false })
            return
          }
          await workspaceService.getWorkspaceById(workspaceId, userId)
          await socket.join(`workspace:${workspaceId}`)
          if (typeof ack === "function") ack({ ok: true })
        } catch {
          if (typeof ack === "function") ack({ ok: false })
        }
      }
    )

    socket.on(SocketEvents.LEAVE, async (workspaceId: unknown) => {
      if (typeof workspaceId !== "string" || !workspaceId) return
      await socket.leave(`workspace:${workspaceId}`)
    })

    socket.on(
      SocketEvents.SYNC,
      async (
        msg: { workspaceId?: string; source?: string; payload?: unknown },
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

          await workspaceService.getWorkspaceById(workspaceId, userId)

          const envelope: WorkspaceRemoteSyncPayload = {
            userId,
            source,
            payload,
            ts: Date.now(),
          }

          const channel = `workspace:${workspaceId}:collab`
          await redisClient.publish(channel, JSON.stringify(envelope))

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
  })
}
