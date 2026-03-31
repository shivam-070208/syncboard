import jwt, { SignOptions } from "jsonwebtoken"
import ApiError from "./api-error"

class JwtUtil {
  private readonly accessSecret =
    process.env.JWT_ACCESS_SECRET || "access_secret"
  private readonly refreshSecret =
    process.env.JWT_REFRESH_SECRET || "refresh_secret"

  generateAccessToken(payload: object): string {
    const options: SignOptions = { expiresIn: "15m" }
    return jwt.sign(payload, this.accessSecret, options)
  }

  generateRefreshToken(payload: object): string {
    const options: SignOptions = { expiresIn: "7d" }
    return jwt.sign(payload, this.refreshSecret, options)
  }

  verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, this.accessSecret)
    } catch (err) {
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid or expired access token",
        cause: err,
      })
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, this.refreshSecret)
    } catch (err) {
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid or expired refresh token",
        cause: err,
      })
    }
  }
}

export default new JwtUtil()
