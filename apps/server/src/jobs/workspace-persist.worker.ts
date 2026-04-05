import { Worker } from "bullmq"
import { createBullConnection } from "@/config/bull-redis"
import workspaceDocumentService from "@v1/services/workspace-document.service"
import {
  WORKSPACE_PERSIST_QUEUE,
  type WorkspacePersistJob,
} from "@/jobs/workspace-persist.queue"

function normalizePersistPayload(job: WorkspacePersistJob): {
  editor_data?: unknown
  canvas_data?: unknown
} {
  if (job.source === "editor") {
    return { editor_data: job.payload }
  }
  return { canvas_data: job.payload }
}

export function createWorkspacePersistWorker(): Worker<WorkspacePersistJob> {
  return new Worker<WorkspacePersistJob>(
    WORKSPACE_PERSIST_QUEUE,
    async (job) => {
      const patch = normalizePersistPayload(job.data)
      await workspaceDocumentService.upsertPartial(job.data.workspaceId, patch)
    },
    { connection: createBullConnection(), concurrency: 8 }
  )
}
