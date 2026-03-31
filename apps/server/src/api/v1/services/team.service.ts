import { query } from "@/config/db"
import ApiError from "@/utils/api-error"

class TeamService {
  async createTeam(userId: string, name: string) {
    const countResult = await query(
      `SELECT COUNT(*) FROM teams WHERE owner_id = $1`,
      [userId]
    )

    const teamCount = parseInt(countResult.rows[0].count, 10)

    if (teamCount >= 5) {
      throw new ApiError({
        statusCode: "HTTP_403_FORBIDDEN",
        message: "Team limit reached",
        cause: "Free users can only create up to 5 teams.",
      })
    }

    const result = await query(
      `INSERT INTO teams (name, owner_id)
       VALUES ($1, $2)
       RETURNING id, name, owner_id`,
      [name, userId]
    )

    return result.rows[0]
  }

  async deleteTeam(userId: string, teamId: string) {
    const result = await query(
      `SELECT * FROM teams WHERE id = $1 AND owner_id = $2`,
      [teamId, userId]
    )

    if (result.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_404_NOT_FOUND",
        message: "Team not found or you're not the owner",
      })
    }

    await query(`DELETE FROM teams WHERE id = $1`, [teamId])

    return { success: true, message: "Team deleted successfully" }
  }

  async updateTeamName(userId: string, teamId: string, newName: string) {
    const result = await query(
      `SELECT * FROM teams WHERE id = $1 AND owner_id = $2`,
      [teamId, userId]
    )

    if (result.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_404_NOT_FOUND",
        message: "Team not found or you're not the owner",
      })
    }

    await query(`UPDATE teams SET name = $1 WHERE id = $2`, [newName, teamId])

    return { success: true, message: "Team name updated successfully" }
  }

  async listUserTeams(userId: string) {
    const result = await query(
      `
      SELECT DISTINCT t.id, t.name, t.owner_id, t.created_at
      FROM teams t
      LEFT JOIN team_members tm ON tm.team_id = t.id
      WHERE t.owner_id = $1 OR tm.user_id = $1
      ORDER BY t.created_at DESC
      `,
      [userId]
    )
    return result.rows
  }

  async getTeamById(teamId: string, userId: string) {
    const result = await query(
      `
      SELECT DISTINCT t.id, t.name, t.owner_id, t.created_at
      FROM teams t
      LEFT JOIN team_members tm ON tm.team_id = t.id
      WHERE t.id = $1 AND (t.owner_id = $2 OR tm.user_id = $2)
      `,
      [teamId, userId]
    )

    if (result.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_404_NOT_FOUND",
        message: "Team not found or you're not the owner",
      })
    }

    return result.rows[0]
  }
}

export default new TeamService()
