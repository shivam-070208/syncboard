import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname, origin } = new URL(request.url)

  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/["']/g, "")
    const res = await fetch(`${serverUrl}/api/v1/auth/session`, {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    })

    let data
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await res.json()
    } else {
      data = {}
    }

    const isLoggedIn = !!data?.session

    if (pathname.startsWith("/dashboard") && !isLoggedIn) {
      const redirectParam = encodeURIComponent(pathname)
      return NextResponse.redirect(`${origin}/login?redirect=${redirectParam}`)
    }

    if ((pathname === "/login" || pathname === "/sign-up") && isLoggedIn) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }

    return NextResponse.next()
  } catch (error) {
    if (pathname.startsWith("/dashboard")) {
      const redirectParam = encodeURIComponent(pathname)
      return NextResponse.redirect(`${origin}/login?redirect=${redirectParam}`)
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/sign-up"],
}
