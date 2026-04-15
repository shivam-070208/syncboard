import { headers } from "next/headers"
import { redirect } from "next/navigation"
const apiBaseUrl = `${new URL(process.env.NEXT_PUBLIC_SERVER_URL!).origin}/api/v1`

export async function unauthRequired() {
  try {
    const header = await headers()
    const res = await fetch(`${apiBaseUrl}/auth/session`, {
      headers: Object.fromEntries(header.entries()),
      credentials: "include",
    })

    let data = null
    if (res.ok) {
      try {
        data = await res.json()
      } catch {
        data = {}
      }

      if (data?.user) {
        return redirect("/dashboard")
      }
      return data
    }
    return {}
  } catch (err) {
    return {}
  }
}

export async function authRequired() {
  try {
    const header = await headers()
    const res = await fetch(`${apiBaseUrl}/auth/session`, {
      headers: Object.fromEntries(header.entries()),
      credentials: "include",
    })

    let data = null
    if (res.ok) {
      try {
        data = await res.json()
      } catch {
        data = {}
      }

      if (!data?.user) {
        return redirect("/login")
      }
      return data
    }
    return redirect("/login")
  } catch {
    // handle fetch or unexpected errors
    return redirect("/login")
  }
}
