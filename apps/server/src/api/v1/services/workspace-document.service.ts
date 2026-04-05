import { query } from "@/config/db"
import workspaceService from "@v1/services/workspace.service"

export type WorkspaceDocumentRow = {
  workspace_id: string
  editor_data: unknown
  canvas_data: unknown
  updated_at: string
}

class WorkspaceDocumentService {
  async getDocument(
    workspaceId: string,
    userId: string
  ): Promise<WorkspaceDocumentRow> {
    await workspaceService.getWorkspaceById(workspaceId, userId)

    const result = await query(
      `SELECT workspace_id, editor_data, canvas_data, updated_at
       FROM workspace_documents WHERE workspace_id = $1`,
      [workspaceId]
    )

    if (result.rows.length === 0) {
      const insert = await query(
        `INSERT INTO workspace_documents (workspace_id)
         VALUES ($1)
         RETURNING workspace_id, editor_data, canvas_data, updated_at`,
        [workspaceId]
      )
      return insert.rows[0] as WorkspaceDocumentRow
    }

    return result.rows[0] as WorkspaceDocumentRow
  }

  async upsertPartial(
    workspaceId: string,
    patch: { editor_data?: unknown; canvas_data?: unknown }
  ): Promise<void> {
    if (!patch.editor_data && !patch.canvas_data) return

    const existing = await query(
      `SELECT editor_data, canvas_data FROM workspace_documents WHERE workspace_id = $1`,
      [workspaceId]
    )

    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO workspace_documents (workspace_id, editor_data, canvas_data, updated_at)
         VALUES ($1, $2::jsonb, $3::jsonb, NOW())`,
        [
          workspaceId,
          JSON.stringify(patch.editor_data ?? {}),
          JSON.stringify(patch.canvas_data ?? {}),
        ]
      )
      return
    }

    const nextEditor =
      patch.editor_data !== undefined
        ? JSON.stringify(patch.editor_data)
        : JSON.stringify(existing.rows[0].editor_data)
    const nextCanvas =
      patch.canvas_data !== undefined
        ? JSON.stringify(patch.canvas_data)
        : JSON.stringify(existing.rows[0].canvas_data)

    await query(
      `UPDATE workspace_documents
       SET editor_data = $2::jsonb, canvas_data = $3::jsonb, updated_at = NOW()
       WHERE workspace_id = $1`,
      [workspaceId, nextEditor, nextCanvas]
    )
  }
}

export default new WorkspaceDocumentService()
