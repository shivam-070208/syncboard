import { randomBytes } from "crypto"
import { query } from "@/config/db"
import hashUtil from "@/utils/hash"
import authService from "@v1/services/auth.service"
import {
  exchangeGoogleCodeForTokens,
  fetchGoogleUserInfo,
} from "@/utils/google-auth"
import type { GoogleUserInfo } from "@/types/google-auth"
import type { User } from "@workspace/shared"

class GoogleAuthService {
  async findOrCreateUser(profile: GoogleUserInfo): Promise<User> {
    const existingResult = await query(
      `SELECT id, email, name, is_premium, created_at FROM users WHERE email = $1`,
      [profile.email]
    )

    if (existingResult.rows.length > 0) {
      return existingResult.rows[0] as User
    }

    const randomPassword = randomBytes(32).toString("hex")
    const hashedPassword = await hashUtil.hashPassword(randomPassword)
    const name = profile.name || profile.email.split("@")[0] || "Google User"

    const insertResult = await query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, is_premium, created_at`,
      [name, profile.email, hashedPassword]
    )

    return insertResult.rows[0] as User
  }

  async authenticateWithGoogle(code: string) {
    const tokenResponse = await exchangeGoogleCodeForTokens(code)
    const profile = await fetchGoogleUserInfo(tokenResponse.access_token)

    if (!profile.email) {
      throw new Error("Google profile did not return an email address")
    }

    const user = await this.findOrCreateUser(profile)
    const tokens = await authService.createSessionForUser(user)

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }
  }
}

export default new GoogleAuthService()
