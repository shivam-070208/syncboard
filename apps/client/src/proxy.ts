import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const pathname = new URL(request.url).pathname

  try {
    const res = await axiosClient.get("/auth/session", {
      headers: headers,
      withCredentials: true,
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
