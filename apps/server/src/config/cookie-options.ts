import { CookieOptions } from "express"
console.log(process.env.NODE_ENV)
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV == "production",
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
}
