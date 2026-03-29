import { query } from "@/config/db"
import ApiError from "@/utils/api-error"
import hashUtil from "@/utils/hash"
import jwtUtil from "@/utils/jwt"
import { redisClient } from "@/config/redis"
import { deleteSession, getSession, setSession } from "@/utils/session"

class AuthService {
  async signup(name: string, email: string, password: string) {
    const userExistsResult = await query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    )

    if (userExistsResult.rows.length > 0) {
      throw new ApiError({
        statusCode: "HTTP_409_CONFLICT",
        message: "Email already in use",
      })
    }

    const hashed = await hashUtil.hashPassword(password)

    const result = await query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [name, email, hashed]
    )

    const user = result.rows[0]

    const accessToken = jwtUtil.generateAccessToken({
      userId: user.id,
    })

    const refreshToken = jwtUtil.generateRefreshToken({
      userId: user.id,
    })
    const session = {
      ...user,
      refreshToken,
    }
    if (session.password) delete session.password
    await setSession(user.id, session)

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    }
  }

  async login(email: string, password: string) {
    const result = await query(`SELECT * FROM users WHERE email = $1`, [email])

    const user = result.rows[0]

    if (!user)
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid email",
      })

    const isValid = await hashUtil.comparePassword(password, user.password)

    if (!isValid)
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid password",
      })

    const accessToken = jwtUtil.generateAccessToken({
      userId: user.id,
    })

    const refreshToken = jwtUtil.generateRefreshToken({
      userId: user.id,
    })

    const session = {
      ...user,
      refreshToken,
    }
    if (session.password) delete session.password
    await setSession(user.id, session)
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    }
  }

  async refreshToken(oldRefreshToken: string) {
    const decoded = jwtUtil.verifyRefreshToken(oldRefreshToken)
    const userId =
      typeof decoded === "object" && "userId" in decoded
        ? decoded.userId
        : undefined
    if (!userId)
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid Token",
      })

    const session = await getSession(userId)
    if (!session)
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Session expired",
      })

    if (session.refreshToken !== oldRefreshToken)
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid refresh token",
      })

    const newAccessToken = jwtUtil.generateAccessToken({ userId })

    return { accessToken: newAccessToken }
  }

  async logout(token: string) {
    const decoded = jwtUtil.verifyAccessToken(token)
    const userId =
      typeof decoded === "object" && "userId" in decoded
        ? decoded.userId
        : undefined
    await deleteSession(userId)
    return { success: true }
  }
}

export default new AuthService()
