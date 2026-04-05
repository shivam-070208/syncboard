import { Queue } from "bullmq"
import { createBullConnection } from "@/config/bull-redis"

export const WORKSPACE_PERSIST_QUEUE = "workspace-persist"

export type WorkspacePersistJob = {
  workspaceId: string
  userId: string
  source: "editor" | "canvas"
  payload: unknown
}

export const workspacePersistQueue = new Queue<WorkspacePersistJob>(
  WORKSPACE_PERSIST_QUEUE,
  { connection: createBullConnection() }
)
