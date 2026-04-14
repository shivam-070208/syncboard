import { RequestWithSession } from "@/types/request-with-session"
import ApiError from "@/utils/api-error"
import jwt from "@/utils/jwt"
import { getSession } from "@/utils/session"
import { tryCatch } from "@/utils/try-catch"
import { AuthToken } from "@workspace/shared"
import { NextFunction, Request, Response } from "express"

export const isAuthorize = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.[AuthToken.ACCESS_TOKEN]
    if (!accessToken) {
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Access token expired",
      })
    }

    const decoded = jwt.verifyAccessToken(accessToken)

    const session = await getSession(decoded.userId)
    if (!session || !session.user) {
      throw new ApiError({
        statusCode: "HTTP_401_UNAUTHORIZED",
        message: "Access token expired",
      })
    }

    ;(req as RequestWithSession).session = session

    next()
  }
)
