import { Request, Response } from "express"
import { randomBytes } from "crypto"
import GoogleAuthService from "@v1/services/google-auth.service"
import { getGoogleAuthorizationUrl } from "@/utils/google-auth"
import { cookieOptions } from "@/config/cookie-options"
import { HTTPStatusCodes, AuthToken } from "@workspace/shared"
import ApiError from "@/utils/api-error"

const GOOGLE_AUTH_STATE_COOKIE = "google_oauth_state"
const GOOGLE_AUTH_REDIRECT_COOKIE = "google_oauth_redirect"
const OAUTH_COOKIE_MAX_AGE = 5 * 60 * 1000

function sanitizeRedirect(redirect: string | undefined) {
  if (!redirect || typeof redirect !== "string") return "/"
  if (!redirect.startsWith("/")) return "/"
  return redirect
}

export const googleAuth = async (req: Request, res: Response) => {
  const redirect = sanitizeRedirect(String(req.query.redirect || "/"))
  const state = randomBytes(16).toString("hex")
  const authorizationUrl = getGoogleAuthorizationUrl(state)

  res
    .cookie(GOOGLE_AUTH_STATE_COOKIE, state, {
      ...cookieOptions,
      maxAge: OAUTH_COOKIE_MAX_AGE,
      httpOnly: true,
    })
    .cookie(GOOGLE_AUTH_REDIRECT_COOKIE, redirect, {
      ...cookieOptions,
      maxAge: OAUTH_COOKIE_MAX_AGE,
      httpOnly: true,
    })

  return res.redirect(HTTPStatusCodes.HTTP_302_FOUND, authorizationUrl)
}

export const googleAuthCallback = async (req: Request, res: Response) => {
  const code = String(req.query.code || "")
  const state = String(req.query.state || "")
  const storedState = req.cookies[GOOGLE_AUTH_STATE_COOKIE]
  const redirect = sanitizeRedirect(req.cookies[GOOGLE_AUTH_REDIRECT_COOKIE])

  if (!code || !state || !storedState || state !== storedState) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "Invalid Google authentication response",
    })
  }

  const { accessToken, refreshToken } =
    await GoogleAuthService.authenticateWithGoogle(code)

  res
    .cookie(AuthToken.ACCESS_TOKEN, accessToken, cookieOptions)
    .cookie(AuthToken.REFRESH_TOKEN, refreshToken, cookieOptions)
    .clearCookie(GOOGLE_AUTH_STATE_COOKIE)
    .clearCookie(GOOGLE_AUTH_REDIRECT_COOKIE)

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Signing in...</title>
  </head>
  <body>
    <script>
      const redirect = ${JSON.stringify(redirect)};
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "GOOGLE_AUTH_SUCCESS", redirect }, "*");
        window.close();
      } else {
        window.location.href = redirect;
      }
    </script>
    <p>Signing you in...</p>
  </body>
</html>`

  res.status(HTTPStatusCodes.HTTP_200_OK).send(html)
}
