import type { ReactNode } from "react"
import { SocketProvider } from "@/components/providers/socket-provider"
import { authRequired } from "@/lib/auth-utils"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  await authRequired()
  return <SocketProvider>{children}</SocketProvider>
}
