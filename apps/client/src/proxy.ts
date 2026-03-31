import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import axiosClient from "@/config/axios-client"

export async function proxy(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || ""

  try {
    const res = await axiosClient.get("/auth/session", {
      headers: {
        Cookie: cookieHeader,
      },
      withCredentials: true,
    })

    if (res.data.session) {
      return NextResponse.next()
    }

    const { origin } = new URL(request.url)
    console.log(origin)
    return NextResponse.redirect(`${origin}/login`)
  } catch {
    const { origin } = new URL(request.url)
    return NextResponse.redirect(`${origin}/login`)
  }
}
export const config = {
  matcher: ["/dashboard/:path*"],
}
