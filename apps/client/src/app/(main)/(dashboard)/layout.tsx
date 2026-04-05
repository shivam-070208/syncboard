import type { ReactNode } from "react"
import DashboardSidebar from "@/modules/dashboard/components/dashboard-sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-full w-full flex-col md:flex-row">
      <DashboardSidebar />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </section>
  )
}
