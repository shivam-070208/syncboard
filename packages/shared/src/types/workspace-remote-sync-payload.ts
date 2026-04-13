export type WorkspaceSyncSource = "editor" | "canvas"
export type PayloadData = Record<string, unknown>
export type WorkspaceRemoteSyncPayload = {
  userId: string
  source: WorkspaceSyncSource
  payload: PayloadData
  ts: number
  socketId: string
}
