import { headers } from "next/headers"
import { redirect } from "next/navigation"
const apiBaseUrl = `${new URL(process.env.NEXT_PUBLIC_SERVER_URL!).origin}/api/v1`

export async function unauthRequired() {
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
}
export async function authRequired() {
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
}
