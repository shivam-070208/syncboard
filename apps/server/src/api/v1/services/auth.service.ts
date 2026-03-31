import { query } from "@/config/db"
import ApiError from "@/utils/api-error"
import hashUtil from "@/utils/hash"
import jwtUtil from "@/utils/jwt"
import { deleteSession, getSession, setSession } from "@/utils/session"
import type { Session, User } from "@workspace/shared"

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
       RETURNING id, email, name, is_premium, created_at`,
      [name, email, hashed]
    )

    const user = result.rows[0] as User

    const accessToken = jwtUtil.generateAccessToken({
      userId: user.id,
    })

    const refreshToken = jwtUtil.generateRefreshToken({
      userId: user.id,
    })
    const session: Session = {
      user,
      refreshToken,
    }
    await setSession(user.id, session)

    return {
      accessToken,
      refreshToken,
      user: {
        ...user,
      },
    }
  }

  async login(email: string, password: string) {
    const result = await query(`SELECT * FROM users WHERE email = $1`, [email])

    const user = result.rows[0] as (User & { password: string }) | undefined

    if (!user)
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid credentials",
      })

    const isValid = await hashUtil.comparePassword(password, user.password)

    if (!isValid)
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid credentials",
      })

    const accessToken = jwtUtil.generateAccessToken({
      userId: user.id,
    })

    const refreshToken = jwtUtil.generateRefreshToken({
      userId: user.id,
    })
    const { password: _password, ...safeUser } = user
    const session: Session = {
      user: { ...safeUser },
      refreshToken,
    }
    await setSession(user.id, session)
    return {
      accessToken,
      refreshToken,
      user: { ...safeUser },
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
    if (!userId)
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid or corrupted token",
      })
    await deleteSession(userId)
    return { success: true }
  }

  async session(token: string) {
    const decoded = jwtUtil.verifyRefreshToken(token)
    const userId =
      typeof decoded === "object" && "userId" in decoded
        ? decoded.userId
        : undefined
    if (!userId)
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid or corrupted token",
      })

    const session = await getSession(userId)
    if (!session || !session.user)
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Session expired",
      })

    return {
      success: true,
      user: { ...session.user },
      session: session,
    }
  }
}

export default new AuthService()
