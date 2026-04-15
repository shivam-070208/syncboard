import ApiError from "./api-error"
import type { GoogleTokenResponse, GoogleUserInfo } from "@/types/google-auth"

const GOOGLE_AUTH_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID
const GOOGLE_AUTH_CLIENT_SECRET = process.env.GOOGLE_AUTH_CLIENT_SECRET
const GOOGLE_AUTH_REDIRECT_URI = process.env.GOOGLE_AUTH_REDIRECT_URI

function requireGoogleEnv(key: string, value?: string): string {
  if (!value) {
    throw new ApiError({
      statusCode: "HTTP_500_INTERNAL_SERVER_ERROR",
      message: `${key} is not configured for Google authentication`,
    })
  }
  return value
}

export function getGoogleAuthorizationUrl(state: string): string {
  const clientId = requireGoogleEnv(
    "GOOGLE_AUTH_CLIENT_ID",
    GOOGLE_AUTH_CLIENT_ID
  )
  if (!GOOGLE_AUTH_REDIRECT_URI) {
    throw new ApiError({
      statusCode: "HTTP_500_INTERNAL_SERVER_ERROR",
      message:
        "GOOGLE_AUTH_REDIRECT_URI is not configured for Google authentication",
    })
  }
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: GOOGLE_AUTH_REDIRECT_URI,
    response_type: "code",
    scope: ["openid", "email", "profile"].join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function exchangeGoogleCodeForTokens(
  code: string
): Promise<GoogleTokenResponse> {
  const clientId = requireGoogleEnv(
    "GOOGLE_AUTH_CLIENT_ID",
    GOOGLE_AUTH_CLIENT_ID
  )
  const clientSecret = requireGoogleEnv(
    "GOOGLE_AUTH_CLIENT_SECRET",
    GOOGLE_AUTH_CLIENT_SECRET
  )
  if (!GOOGLE_AUTH_REDIRECT_URI) {
    throw new ApiError({
      statusCode: "HTTP_500_INTERNAL_SERVER_ERROR",
      message:
        "GOOGLE_AUTH_REDIRECT_URI is not configured for Google authentication",
    })
  }
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: GOOGLE_AUTH_REDIRECT_URI,
  })

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new ApiError({
      statusCode: "HTTP_500_INTERNAL_SERVER_ERROR",
      message: `Failed to exchange Google authorization code: ${errorBody}`,
    })
  }

  return (await response.json()) as GoogleTokenResponse
}

export async function fetchGoogleUserInfo(
  accessToken: string
): Promise<GoogleUserInfo> {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new ApiError({
      statusCode: "HTTP_500_INTERNAL_SERVER_ERROR",
      message: `Failed to fetch Google user information: ${errorBody}`,
    })
  }

  return (await response.json()) as GoogleUserInfo
}
