import { query } from "@/config/db"
import ApiError from "@/utils/api-error"
import { v4 as uuidv4 } from "uuid"

class WorkspaceService {
  async createWorkspace(teamId: string, userId: string, title?: string) {
    const membership = await query(
      `SELECT id FROM team_members WHERE team_id = $1 AND user_id = $2 UNION SELECT id FROM teams WHERE id = $1 AND owner_id = $2`,
      [teamId, userId]
    )

    if (membership.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_403_FORBIDDEN",
        message: "You are not a member of this team",
      })
    }

    const workspaceCountResult = await query(
      `SELECT COUNT(*) FROM workspaces WHERE team_id = $1`,
      [teamId]
    )
    const workspaceCount = parseInt(workspaceCountResult.rows[0].count, 10)
    if (workspaceCount >= 5) {
      throw new ApiError({
        statusCode: "HTTP_403_FORBIDDEN",
        message: "Workspace limit reached for this team",
        cause: "A team cannot have more than 5 workspaces.",
      })
    }

    const workspaceTitle = title || `workspace-${uuidv4().slice(0, 8)}`

    const result = await query(
      `INSERT INTO workspaces (team_id, title, created_by)
       VALUES ($1, $2, $3)
       RETURNING id, team_id, title, created_by, created_at`,
      [teamId, workspaceTitle, userId]
    )
    const workspace = result.rows[0]

    await query(
      `INSERT INTO workspace_members (workspace_id, user_id) VALUES ($1, $2)`,
      [workspace.id, userId]
    )

    return workspace
  }

  async listTeamWorkspaces(teamId: string, userId: string) {
    const membership = await query(
      `SELECT id FROM team_members WHERE team_id = $1 AND user_id = $2 UNION SELECT id FROM teams WHERE id = $1 AND owner_id = $2`,
      [teamId, userId]
    )

    if (membership.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_403_FORBIDDEN",
        message: "You are not a member of this team",
      })
    }

    const result = await query(
      `SELECT w.id, w.team_id, w.title, w.created_by, w.created_at
       FROM workspaces w
       WHERE w.team_id = $1
       ORDER BY w.created_at DESC`,
      [teamId]
    )

    return result.rows
  }

  async getWorkspaceById(workspaceId: string, userId: string) {
    const result = await query(
      `SELECT w.id, w.team_id, w.title, w.created_by, w.created_at
       FROM workspaces w
       LEFT JOIN teams t ON t.id = w.team_id
       LEFT JOIN team_members tm ON tm.team_id = w.team_id AND tm.user_id = $2
       WHERE w.id = $1 AND (t.owner_id = $2 OR tm.user_id = $2)`,
      [workspaceId, userId]
    )

    if (result.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_404_NOT_FOUND",
        message: "Workspace not found or access denied",
      })
    }

    return result.rows[0]
  }

  async deleteWorkspace(workspaceId: string, userId: string) {
    const result = await query(
      `SELECT w.id FROM workspaces w
       LEFT JOIN teams t ON t.id = w.team_id
       WHERE w.id = $1 AND (w.created_by = $2 OR t.owner_id = $2)`,
      [workspaceId, userId]
    )

    if (result.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_403_FORBIDDEN",
        message: "You don't have permission to delete this workspace",
      })
    }

    await query(`DELETE FROM workspaces WHERE id = $1`, [workspaceId])

    return { success: true, message: "Workspace deleted successfully" }
  }

  async updateWorkspaceTitle(
    workspaceId: string,
    userId: string,
    title: string
  ) {
    const result = await query(
      `SELECT w.id FROM workspaces w
       LEFT JOIN teams t ON t.id = w.team_id
       WHERE w.id = $1 AND (w.created_by = $2 OR t.owner_id = $2)`,
      [workspaceId, userId]
    )

    if (result.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_403_FORBIDDEN",
        message: "You don't have permission to update this workspace",
      })
    }

    await query(`UPDATE workspaces SET title = $1 WHERE id = $2`, [
      title,
      workspaceId,
    ])

    return { success: true, message: "Workspace title updated successfully" }
  }
}

export default new WorkspaceService()
