import jwt, { SignOptions } from "jsonwebtoken"

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
    return jwt.verify(token, this.accessSecret)
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshSecret)
  }
}

export default new JwtUtil()
