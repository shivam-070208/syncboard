export type PayloadData = {
  elements: unknown
  appState: unknown
}
export type WorkspaceRemoteSyncPayload = {
  userId: string
  source: "editor" | "canvas"
  payload: PayloadData
  ts: number
  socketId: string
}
