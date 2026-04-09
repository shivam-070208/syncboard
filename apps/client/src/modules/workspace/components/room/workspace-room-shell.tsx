"use client"

import { useState, useEffect } from "react"
import { WorkspaceNavbar } from "@/modules/workspace/components/room/workspace-navbar"
import { WorkspaceEditorDock } from "@/modules/workspace/components/room/workspace-editor-dock"
import { WorkspaceExcalidrawStage } from "@/modules/workspace/components/room/workspace-excalidraw-stage"
import { cn } from "@workspace/ui/lib/utils"
import { useSocket } from "@/components/providers/socket-provider"
import { SocketEvents } from "@workspace/shared"

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
  canvasSeed,
}: WorkspaceRoomShellProps) {
  const [editorOpen, setEditorOpen] = useState(true)
  const { connected, socket } = useSocket()

  useEffect(() => {
    if (!connected || !socket) return
    socket.emit(SocketEvents.JOIN, workspaceId)
    return () => {
      socket.emit(SocketEvents.LEAVE, workspaceId)
    }
  }, [connected, socket, workspaceId])
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
            className={cn(
              "fixed inset-0 top-14 z-40 flex min-h-0 w-full flex-col bg-background lg:static lg:z-auto lg:h-full lg:w-1/2 lg:max-w-xl lg:border-r"
            )}
          >
            <WorkspaceEditorDock />
          </div>
        ) : null}
        <WorkspaceExcalidrawStage
          workspaceId={workspaceId}
          initialData={canvasSeed}
          className={cn(
            editorOpen
              ? "hidden min-h-0 w-full flex-1 lg:flex"
              : "flex min-h-0 w-full flex-1"
          )}
        />
      </div>
    </div>
  )
}
