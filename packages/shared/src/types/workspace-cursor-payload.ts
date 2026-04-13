export type WorkspaceCursorSurface = "editor" | "canvas"

export type WorkspaceCursorUpdatePayload = {
  workspaceId: string
  surface: WorkspaceCursorSurface | null
  x: number | null
  y: number | null
}

export type WorkspaceRemoteCursorPayload = WorkspaceCursorUpdatePayload & {
  userId: string
  userName: string
  ts: number
  socketId: string
}
