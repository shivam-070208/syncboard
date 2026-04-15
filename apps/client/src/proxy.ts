import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname, origin } = new URL(request.url)
  const { pathname, origin } = new URL(request.url)

  try {
    console.log(request.headers.get("cookie"))
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/session`,
      {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    )

    let data
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await res.json()
    } else {
      data = {}
    }
    const isLoggedIn = !!data?.session
    let data
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await res.json()
    } else {
      data = {}
    }
    const isLoggedIn = !!data?.session

    if (pathname.startsWith("/dashboard")) {
      if (!isLoggedIn) {
        if (!isLoggedIn) {
          const redirectParam = encodeURIComponent(pathname)
          return NextResponse.redirect(
            `${origin}/login?redirect=${redirectParam}`
          )
        }
        return NextResponse.next()
        return NextResponse.next()
      }

      if (pathname === "/login" || pathname === "/sign-up") {
        if (isLoggedIn) {
          return NextResponse.redirect(`${origin}/dashboard`)
        }
        return NextResponse.next()
        return NextResponse.next()
      }

      return NextResponse.next()
    }
  } catch (error) {
    console.error("Middleware error:", error)

    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(`${origin}/login`)
    }

    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/sign-up"],
}
