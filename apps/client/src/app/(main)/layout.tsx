import type { ReactNode } from "react"
import { SocketProvider } from "@/components/providers/socket-provider"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>
}
