"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { FcGoogle } from "react-icons/fc"

const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL?.replace(/(^["']|["']$)/g, "") ||
  "http://localhost:3001"
const serverOrigin = new URL(serverUrl).origin
const authWindowFeatures =
  "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=700"

export function GoogleAuthButton() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const redirectPath = searchParams.get("redirect") || "/"
  const handleGoogleAuth = () => {
    const url = `${serverUrl}/api/v1/auth/google?redirect=${encodeURIComponent(
      redirectPath
    )}`
    const authWindow = window.open(url, "_blank", authWindowFeatures)
    if (!authWindow) return

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== serverOrigin) return

      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        queryClient.invalidateQueries({ queryKey: ["auth", "session"] })

        router.push(
          event.data.redirect == "/"
            ? "/dashboard"
            : event.data.redirect || "/dashboard"
        )
        window.removeEventListener("message", handleMessage)
        authWindow.close()
      }

      if (event.data?.type === "GOOGLE_AUTH_ERROR") {
        window.removeEventListener("message", handleMessage)
        authWindow.close()
      }
    }

    window.addEventListener("message", handleMessage)
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full py-6 font-medium"
      onClick={handleGoogleAuth}
    >
      <FcGoogle />
      <span>Continue with Google</span>
    </Button>
  )
}
