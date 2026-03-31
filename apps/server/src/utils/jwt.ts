import jwt, { SignOptions, JwtPayload } from "jsonwebtoken"
import ApiError from "./api-error"

type Payload = {
  userId: string
}

class JwtUtil {
  private readonly accessSecret =
    process.env.JWT_ACCESS_SECRET || "access_secret"
  private readonly refreshSecret =
    process.env.JWT_REFRESH_SECRET || "refresh_secret"

  generateAccessToken(payload: Payload): string {
    const options: SignOptions = { expiresIn: "15m" }
    return jwt.sign(payload, this.accessSecret, options)
  }

  generateRefreshToken(payload: Payload): string {
    const options: SignOptions = { expiresIn: "7d" }
    return jwt.sign(payload, this.refreshSecret, options)
  }

  verifyAccessToken(token: string): Payload {
    try {
      const decoded = jwt.verify(token, this.accessSecret)
      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "userId" in decoded &&
        typeof (decoded as JwtPayload).userId === "string"
      ) {
        return { userId: (decoded as JwtPayload).userId }
      }
      throw new Error("Invalid access token payload")
    } catch (err) {
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid or expired access token",
        cause: err,
      })
    }
  }

  verifyRefreshToken(token: string): Payload {
    try {
      const decoded = jwt.verify(token, this.refreshSecret)
      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "userId" in decoded &&
        typeof (decoded as JwtPayload).userId === "string"
      ) {
        return { userId: (decoded as JwtPayload).userId }
      }
      throw new Error("Invalid refresh token payload")
    } catch {
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Invalid or expired refresh token",
      })
    }
  }
}

export default new JwtUtil()
