"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { RefObject } from "react"
import { useSocket } from "@/components/providers/socket-provider"
import {
  SocketEvents,
  type WorkspaceCursorSurface,
  type WorkspaceRemoteCursorPayload,
} from "@workspace/shared"

const CURSOR_TTL_MS = 10_000
const CURSOR_THROTTLE_MS = 24
const CURSOR_MOVEMENT_EPSILON = 0.002

type WorkspaceSurfaceRefMap = {
  editor: RefObject<HTMLElement | null>
  canvas: RefObject<HTMLElement | null>
}

type CursorSendState = {
  surface: WorkspaceCursorSurface | null
  x: number | null
  y: number | null
  ts: number
}

type CursorPointInput = {
  surface: WorkspaceCursorSurface
  clientX: number
  clientY: number
}

export type WorkspaceRemoteCursorState = {
  userId: string
  userName: string
  surface: WorkspaceCursorSurface
  x: number
  y: number
  ts: number
}

type UseWorkspaceCursorPresenceParams = {
  workspaceId: string
  surfaceRefs: WorkspaceSurfaceRefMap
}

const clampUnit = (value: number) => Math.min(1, Math.max(0, value))

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value)

const isCursorSurface = (value: unknown): value is WorkspaceCursorSurface =>
  value === "editor" || value === "canvas"

export const useWorkspaceCursorPresence = ({
  workspaceId,
  surfaceRefs,
}: UseWorkspaceCursorPresenceParams) => {
  const { connected, socket } = useSocket()
  const [remoteCursorMap, setRemoteCursorMap] = useState<
    Record<string, WorkspaceRemoteCursorState>
  >({})
  const lastSentRef = useRef<CursorSendState | null>(null)

  const updateCursorFromClientPoint = useCallback(
    ({ surface, clientX, clientY }: CursorPointInput) => {
      if (!connected || !socket) return

      const container = surfaceRefs[surface].current
      if (!container) return

      const rect = container.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return

      const x = clampUnit((clientX - rect.left) / rect.width)
      const y = clampUnit((clientY - rect.top) / rect.height)
      const now = Date.now()
      const last = lastSentRef.current

      if (last && now - last.ts < CURSOR_THROTTLE_MS) return

      if (
        last &&
        last.surface === surface &&
        last.x !== null &&
        last.y !== null &&
        Math.abs(last.x - x) < CURSOR_MOVEMENT_EPSILON &&
        Math.abs(last.y - y) < CURSOR_MOVEMENT_EPSILON &&
        now - last.ts < 180
      ) {
        return
      }

      socket.emit(SocketEvents.CURSOR_UPDATE, {
        workspaceId,
        surface,
        x,
        y,
      })

      lastSentRef.current = { surface, x, y, ts: now }
    },
    [connected, socket, surfaceRefs, workspaceId]
  )

  const clearCursor = useCallback(() => {
    if (!connected || !socket) return

    const now = Date.now()
    const last = lastSentRef.current
    if (last?.surface === null && now - last.ts < 250) return

    socket.emit(SocketEvents.CURSOR_UPDATE, {
      workspaceId,
      surface: null,
      x: null,
      y: null,
    })

    lastSentRef.current = { surface: null, x: null, y: null, ts: now }
  }, [connected, socket, workspaceId])

  useEffect(() => {
    if (!connected || !socket) {
      setRemoteCursorMap({})
      return
    }

    const handler = (payload: WorkspaceRemoteCursorPayload) => {
      if (!payload || typeof payload !== "object") return
      if (payload.socketId === socket.id) return
      if (payload.workspaceId !== workspaceId) return
      if (typeof payload.userId !== "string" || !payload.userId) return

      if (
        payload.surface === null ||
        payload.x === null ||
        payload.y === null
      ) {
        setRemoteCursorMap((prev) => {
          if (!prev[payload.userId]) return prev
          const next = { ...prev }
          delete next[payload.userId]
          return next
        })
        return
      }

      if (
        !isCursorSurface(payload.surface) ||
        !isFiniteNumber(payload.x) ||
        !isFiniteNumber(payload.y)
      ) {
        return
      }

      const nextCursor: WorkspaceRemoteCursorState = {
        userId: payload.userId,
        userName:
          typeof payload.userName === "string" && payload.userName
            ? payload.userName
            : "Anonymous",
        surface: payload.surface,
        x: clampUnit(payload.x),
        y: clampUnit(payload.y),
        ts: isFiniteNumber(payload.ts) ? payload.ts : Date.now(),
      }

      setRemoteCursorMap((prev) => ({
        ...prev,
        [payload.userId]: nextCursor,
      }))
    }

    socket.on(SocketEvents.REMOTE_CURSOR_UPDATE, handler)
    return () => {
      socket.off(SocketEvents.REMOTE_CURSOR_UPDATE, handler)
    }
  }, [connected, socket, workspaceId])

  useEffect(() => {
    const interval = window.setInterval(() => {
      const cutoff = Date.now() - CURSOR_TTL_MS
      setRemoteCursorMap((prev) => {
        let mutated = false
        const next: Record<string, WorkspaceRemoteCursorState> = {}
        for (const [userId, cursor] of Object.entries(prev)) {
          if (cursor.ts >= cutoff) {
            next[userId] = cursor
            continue
          }
          mutated = true
        }
        return mutated ? next : prev
      })
    }, 2_000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const onBlur = () => {
      clearCursor()
    }

    const onVisibility = () => {
      if (document.hidden) clearCursor()
    }

    window.addEventListener("blur", onBlur)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      window.removeEventListener("blur", onBlur)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [clearCursor])

  useEffect(() => {
    return () => {
      clearCursor()
    }
  }, [clearCursor])

  const remoteCursors = useMemo(
    () => Object.values(remoteCursorMap),
    [remoteCursorMap]
  )

  return {
    remoteCursors,
    updateCursorFromClientPoint,
    clearCursor,
  }
}
