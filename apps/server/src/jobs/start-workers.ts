import { createWorkspacePersistWorker } from "@/jobs/workspace-persist.worker"

export function startBackgroundWorkers() {
  const persistWorker = createWorkspacePersistWorker()
  persistWorker.on("failed", (job, err) => {
    console.error("workspace-persist job failed", job?.id, err)
  })
  return { persistWorker }
}
