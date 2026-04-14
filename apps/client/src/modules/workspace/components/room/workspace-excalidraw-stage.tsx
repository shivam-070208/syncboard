"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef } from "react"
import type { CanvasPersistPayload } from "@/modules/workspace/lib/normalize-document"
import { normalizeCanvasData } from "@/modules/workspace/lib/normalize-document"
import { cn } from "@workspace/ui/lib/utils"
import "@excalidraw/excalidraw/index.css"
import type {
  ExcalidrawImperativeAPI,
  AppState,
} from "@excalidraw/excalidraw/types"
import { useSocket } from "@/components/providers/socket-provider"
import { SocketEvents, WorkspaceRemoteSyncPayload } from "@workspace/shared"
import debounce from "lodash.debounce"
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types"

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div
        className={cn(
          "flex h-full items-center justify-center text-sm text-muted-foreground"
        )}
      >
        Loading board
      </div>
    ),
  }
)

type WorkspaceExcalidrawStageProps = {
  workspaceId: string
  initialData: unknown
  className?: string
  onCursorMove?: (point: { clientX: number; clientY: number }) => void
  onCursorLeave?: () => void
}

const WorkspaceExcalidrawStage = ({
  workspaceId,
  initialData,
  className,
  onCursorMove,
  onCursorLeave,
}: WorkspaceExcalidrawStageProps) => {
  const { connected, socket } = useSocket()

  const boot = normalizeCanvasData(initialData)
  const excalidrawAPI = useRef<ExcalidrawImperativeAPI>(null)
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isRemoteUpdate = useRef(false)

  const lastSentState = useRef("")

  const debouncedSend = useRef(
    debounce((payload: CanvasPersistPayload) => {
      if (!socket) return

      socket.emit(SocketEvents.SYNC, {
        workspaceId,
        source: "canvas",
        payload,
      })
    }, 140)
  ).current

  const handler = useCallback(
    (data: WorkspaceRemoteSyncPayload) => {
      if (data.socketId === socket?.id) return
      if (data.source !== "canvas") return
      if (!excalidrawAPI.current) return
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current)
        timeOutRef.current = null
      }
      isRemoteUpdate.current = true

      excalidrawAPI.current.updateScene({
        elements: data.payload?.elements as ExcalidrawElement[],
        appState: {
          ...(data.payload?.appState ?? {}),
        },
      })

      timeOutRef.current = setTimeout(() => {
        isRemoteUpdate.current = false
        timeOutRef.current = null
      }, 10)
    },
    [socket]
  )

  useEffect(() => {
    if (!connected || !socket) return

    socket.on(SocketEvents.REMOTE_SYNC, handler)

    return () => {
      socket.off(SocketEvents.REMOTE_SYNC, handler)
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current)
        timeOutRef.current = null
      }
    }
  }, [connected, socket, handler])

  const handleChange = useCallback(
    (elements: readonly ExcalidrawElement[], appState: AppState) => {
      if (isRemoteUpdate.current) return

      const payload: CanvasPersistPayload = {
        elements: [...elements],
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          gridSize: appState.gridSize,
          zenModeEnabled: appState.zenModeEnabled,
        },
      }

      const currentState = JSON.stringify(payload.elements)
      if (currentState === lastSentState.current) return

      lastSentState.current = currentState

      debouncedSend(payload)
    },
    [debouncedSend]
  )

  const handleExcalidrawReady = useCallback((api: ExcalidrawImperativeAPI) => {
    excalidrawAPI.current = api
  }, [])

  return (
    <div
      className={cn(
        "relative min-h-0 min-w-0 flex-1 overflow-hidden bg-muted/30",
        className
      )}
      onPointerMoveCapture={(event) => {
        onCursorMove?.({
          clientX: event.clientX,
          clientY: event.clientY,
        })
      }}
      onPointerLeave={onCursorLeave}
    >
      <Excalidraw
        excalidrawAPI={handleExcalidrawReady}
        key={workspaceId}
        initialData={{
          elements: boot.elements as never,
          appState: boot.appState as never,
        }}
        onChange={handleChange}
      />
    </div>
  )
}

export { WorkspaceExcalidrawStage }
