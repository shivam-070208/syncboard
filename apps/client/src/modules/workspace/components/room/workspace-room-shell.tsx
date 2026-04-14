"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { WorkspaceNavbar } from "@/modules/workspace/components/room/workspace-navbar"
import { WorkspaceEditorDock } from "@/modules/workspace/components/room/workspace-editor-dock"
import { WorkspaceExcalidrawStage } from "@/modules/workspace/components/room/workspace-excalidraw-stage"
import { WorkspaceRemoteCursorLayer } from "@/modules/workspace/components/room/workspace-remote-cursor-layer"
import { cn } from "@workspace/ui/lib/utils"
import { useSocket } from "@/components/providers/socket-provider"
import { SocketEvents } from "@workspace/shared"
import { useWorkspaceCursorPresence } from "@/modules/workspace/hooks/use-workspace-cursor-presence"

type WorkspaceRoomShellProps = {
  workspaceId: string
  userId: string | undefined
  title: string
  titleBusy: boolean
  onTitleUpdate: (next: string) => Promise<void>
  onBack: () => void
  editorSeed: unknown
  canvasSeed: unknown
}

export function WorkspaceRoomShell({
  workspaceId,
  title,
  titleBusy,
  onTitleUpdate,
  onBack,
  editorSeed,
  canvasSeed,
}: WorkspaceRoomShellProps) {
  const [editorOpen, setEditorOpen] = useState(true)
  const { connected, socket } = useSocket()
  const editorSurfaceRef = useRef<HTMLDivElement>(null)
  const canvasSurfaceRef = useRef<HTMLDivElement>(null)
  const surfaceRefs = useMemo(
    () => ({
      editor: editorSurfaceRef,
      canvas: canvasSurfaceRef,
    }),
    []
  )

  const { remoteCursors, updateCursorFromClientPoint, clearCursor } =
    useWorkspaceCursorPresence({
      workspaceId,
      surfaceRefs,
    })

  useEffect(() => {
    if (!connected || !socket) return
    socket.emit(SocketEvents.JOIN, workspaceId)
    return () => {
      socket.emit(SocketEvents.LEAVE, workspaceId)
    }
  }, [connected, socket, workspaceId])

  useEffect(() => {
    if (editorOpen) return
    clearCursor()
  }, [editorOpen, clearCursor])

  const handleEditorCaretPosition = useCallback(
    (point: { clientX: number; clientY: number }) => {
      updateCursorFromClientPoint({
        surface: "editor",
        clientX: point.clientX,
        clientY: point.clientY,
      })
    },
    [updateCursorFromClientPoint]
  )

  const handleCanvasCursorPosition = useCallback(
    (point: { clientX: number; clientY: number }) => {
      updateCursorFromClientPoint({
        surface: "canvas",
        clientX: point.clientX,
        clientY: point.clientY,
      })
    },
    [updateCursorFromClientPoint]
  )

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <WorkspaceNavbar
        title={title}
        editorOpen={editorOpen}
        onToggleEditor={() => setEditorOpen((v) => !v)}
        onBack={onBack}
        onTitleUpdate={onTitleUpdate}
        titleBusy={titleBusy}
      />
      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        {editorOpen ? (
          <div
            ref={editorSurfaceRef}
            className={cn(
              "fixed inset-0 top-14 z-40 flex min-h-0 w-full flex-col bg-background lg:static lg:z-auto lg:h-full lg:w-1/2 lg:max-w-xl lg:border-r"
            )}
          >
            <WorkspaceEditorDock
              workspaceId={workspaceId}
              initialData={editorSeed}
              onCaretPositionChange={handleEditorCaretPosition}
              onCaretLeave={clearCursor}
            />
          </div>
        ) : null}
        <div
          ref={canvasSurfaceRef}
          className={cn(
            editorOpen
              ? "hidden min-h-0 w-full flex-1 overflow-hidden lg:flex"
              : "flex min-h-0 w-full flex-1 overflow-hidden"
          )}
        >
          <WorkspaceExcalidrawStage
            workspaceId={workspaceId}
            initialData={canvasSeed}
            onCursorMove={handleCanvasCursorPosition}
            onCursorLeave={clearCursor}
          />
        </div>
        <WorkspaceRemoteCursorLayer
          cursors={remoteCursors}
          surfaceRefs={surfaceRefs}
        />
      </div>
    </div>
  )
}
