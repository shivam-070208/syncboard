import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import axiosClient from "@/config/axios-client"

export async function proxy(request: NextRequest) {
  const pathname = new URL(request.url).pathname

  try {
    const res = await axiosClient.get("/auth/session", {
      headers: headers,
      withCredentials: true,
    })

    const isLoggedIn = !!res.data.session

    if (pathname.startsWith("/dashboard")) {
      if (isLoggedIn) {
        return NextResponse.next()
      } else {
        const { origin } = new URL(request.url)
        const redirectParam = encodeURIComponent(pathname)
        return NextResponse.redirect(
          `${origin}/login?redirect=${redirectParam}`
        )
      }
    }

    if (pathname === "/login" || pathname === "/sign-up") {
      if (isLoggedIn) {
        const { origin } = new URL(request.url)
        return NextResponse.redirect(`${origin}/dashboard`)
      } else {
        return NextResponse.next()
      }
    }

    return NextResponse.next()
  } catch {
    const { origin } = new URL(request.url)
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(`${origin}/login`)
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/sign-up"],
}
