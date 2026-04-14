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

  async joinTeam(userId: string, teamId: string) {
    const teamResult = await query(`SELECT id FROM teams WHERE id = $1`, [
      teamId,
    ])
    if (teamResult.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_404_NOT_FOUND",
        message: "Team not found",
      })
    }

    const membership = await query(
      `SELECT id FROM team_members WHERE team_id = $1 AND user_id = $2`,
      [teamId, userId]
    )

    if (membership.rows.length > 0) {
      return { success: true, message: "Already joined this team" }
    }

    await query(`INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)`, [
      teamId,
      userId,
    ])

    return { success: true, message: "Joined team successfully" }
  }

  async searchTeams(queryText: string) {
    const wildcard = `%${queryText.trim().toLowerCase()}%`
    const result = await query(
      `SELECT id, name, owner_id, created_at FROM teams WHERE LOWER(name) LIKE $1 ORDER BY created_at DESC LIMIT 50`,
      [wildcard]
    )
    return result.rows
  }

  async requestJoinTeam(userId: string, teamId: string) {
    const teamResult = await query(`SELECT id FROM teams WHERE id = $1`, [
      teamId,
    ])
    if (teamResult.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_404_NOT_FOUND",
        message: "Team not found",
      })
    }

    const membership = await query(
      `SELECT id FROM team_members WHERE team_id = $1 AND user_id = $2`,
      [teamId, userId]
    )

    if (membership.rows.length > 0) {
      return { success: true, message: "You are already a member of this team" }
    }

    const existingRequest = await query(
      `SELECT id FROM team_join_requests WHERE team_id = $1 AND user_id = $2`,
      [teamId, userId]
    )

    if (existingRequest.rows.length > 0) {
      return { success: true, message: "Request already pending" }
    }

    await query(
      `INSERT INTO team_join_requests (team_id, user_id, status) VALUES ($1, $2, 'pending')`,
      [teamId, userId]
    )

    return { success: true, message: "Join request sent" }
  }

  async listTeamJoinRequests(teamId: string, userId: string) {
    // Check if user is team owner
    const teamResult = await query(
      `SELECT id FROM teams WHERE id = $1 AND owner_id = $2`,
      [teamId, userId]
    )

    if (teamResult.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_403_FORBIDDEN",
        message: "You are not the owner of this team",
      })
    }

    const result = await query(
      `SELECT tjr.id, tjr.team_id, tjr.user_id, tjr.status, tjr.created_at,
              u.name as user_name, u.email as user_email
       FROM team_join_requests tjr
       LEFT JOIN users u ON u.id = tjr.user_id
       WHERE tjr.team_id = $1 AND tjr.status = 'pending'
       ORDER BY tjr.created_at ASC`,
      [teamId]
    )

    return result.rows
  }

  async approveJoinRequest(requestId: string, userId: string) {
    // Get the request and check if user is team owner
    const requestResult = await query(
      `SELECT tjr.team_id, tjr.user_id FROM team_join_requests tjr
       LEFT JOIN teams t ON t.id = tjr.team_id
       WHERE tjr.id = $1 AND t.owner_id = $2`,
      [requestId, userId]
    )

    if (requestResult.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_403_FORBIDDEN",
        message: "You don't have permission to approve this request",
      })
    }

    const { team_id, user_id } = requestResult.rows[0]

    // Add user to team members
    await query(`INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)`, [
      team_id,
      user_id,
    ])

    // Update request status
    await query(
      `UPDATE team_join_requests SET status = 'approved' WHERE id = $1`,
      [requestId]
    )

    return { success: true, message: "Join request approved" }
  }

  async rejectJoinRequest(requestId: string, userId: string) {
    // Check if user is team owner
    const requestResult = await query(
      `SELECT tjr.id FROM team_join_requests tjr
       LEFT JOIN teams t ON t.id = tjr.team_id
       WHERE tjr.id = $1 AND t.owner_id = $2`,
      [requestId, userId]
    )

    if (requestResult.rows.length === 0) {
      throw new ApiError({
        statusCode: "HTTP_403_FORBIDDEN",
        message: "You don't have permission to reject this request",
      })
    }

    await query(
      `UPDATE team_join_requests SET status = 'rejected' WHERE id = $1`,
      [requestId]
    )

    return { success: true, message: "Join request rejected" }
  }
}

export default new TeamService()
