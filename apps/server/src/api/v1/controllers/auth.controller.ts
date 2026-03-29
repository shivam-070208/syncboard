import { Request, Response } from "express"
import authService from "@v1/services/auth.service"
import { HTTPStatusCodes, AuthToken } from "@workspace/shared"
import { cookieOptions } from "@/config/cookie-options"
import ApiError from "@/utils/api-error"

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  const { accessToken, refreshToken, user } = await authService.signup(
    name,
    email,
    password
  )

  res
    .cookie(AuthToken.REFRESH_TOKEN, refreshToken, cookieOptions)
    .cookie(AuthToken.ACCESS_TOKEN, accessToken, cookieOptions)

  return res.status(HTTPStatusCodes.HTTP_201_CREATED).json({
    success: true,
    user,
  })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const { accessToken, refreshToken, user } = await authService.login(
    email,
    password
  )

  res
    .cookie(AuthToken.REFRESH_TOKEN, refreshToken, cookieOptions)
    .cookie(AuthToken.ACCESS_TOKEN, accessToken, cookieOptions)

  return res.status(HTTPStatusCodes.HTTP_200_OK).json({
    success: true,
    accessToken,
    user,
  })
}

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[AuthToken.REFRESH_TOKEN]

  if (!refreshToken)
    throw new ApiError({
      statusCode: "HTTP_401_UNAUTHORIZED",
      message: "Refresh token missing or expired",
    })

  const { accessToken } = await authService.refreshToken(refreshToken)

  res.cookie(AuthToken.ACCESS_TOKEN, accessToken, cookieOptions)

  return res.status(HTTPStatusCodes.HTTP_200_OK).json({
    success: true,
    accessToken,
  })
}

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.[AuthToken.ACCESS_TOKEN]

  await authService.logout(token)

  res.clearCookie(AuthToken.ACCESS_TOKEN).clearCookie(AuthToken.REFRESH_TOKEN)

  return res.status(HTTPStatusCodes.HTTP_200_OK).json({
    success: true,
    message: "Logged out successfully",
  })
}
