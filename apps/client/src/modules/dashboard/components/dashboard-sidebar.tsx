"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@workspace/ui/components/sidebar"
import { FiGrid, FiLogOut, FiUsers } from "react-icons/fi"
import LogoIcon from "@/components/common/logo-icon"
import { useLogout, useSession } from "@/modules/auth/hooks/use-auth"
import { useTeams } from "@/modules/team/hooks/use-team"

const TEAM_STORAGE_KEY = "syncboard:selectedTeamId"

export default function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: sessionData } = useSession()
  const { mutate: logout } = useLogout()
  const { data: teamsData } = useTeams()
  const teams = useMemo(() => teamsData?.teams ?? [], [teamsData?.teams])

  const [storedTeamId, setStoredTeamId] = useState(() => {
    if (typeof window === "undefined") return ""
    return window.localStorage.getItem(TEAM_STORAGE_KEY) ?? ""
  })
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const selectedTeamId = useMemo(() => {
    const matchedTeamId = pathname?.match(/^\/dashboard\/([^/]+)$/)?.[1]
    if (matchedTeamId && teams.some((team) => team.id === matchedTeamId)) {
      return matchedTeamId
    }
    if (storedTeamId && teams.some((team) => team.id === storedTeamId)) {
      return storedTeamId
    }
    return ""
  }, [pathname, storedTeamId, teams])

  const selectedTeamName = useMemo(() => {
    return (
      teams.find((team) => team.id === selectedTeamId)?.name || "Select team"
    )
  }, [selectedTeamId, teams])

  const links = [
    {
      label: "All boards",
      href: "/dashboard/all",
      icon: (
        <FiGrid className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
      ),
    },
    {
      label: "Members",
      href: "#",
      icon: (
        <FiUsers className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
      ),
    },
  ]

  const onSelectTeam = (teamId: string) => {
    setStoredTeamId(teamId)
    if (!teamId) {
      router.push("/dashboard/all")
      return
    }
    window.localStorage.setItem(TEAM_STORAGE_KEY, teamId)
    router.push(`/dashboard/${teamId}`)
  }

  return (
    <>
      <Sidebar animate>
        <SidebarBody className="justify-between border-r border-neutral-200/70 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/all" className="shrink-0">
                <LogoIcon width={30} height={30} />
              </Link>
              <select
                value={selectedTeamId}
                onChange={(event) => onSelectTeam(event.target.value)}
                className="h-9 w-full rounded-md border border-neutral-300 bg-white px-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              >
                <option value="">All teams</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              {links.map((link) => (
                <SidebarLink key={link.label} link={link} />
              ))}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-left text-sm dark:border-neutral-700"
            >
              <span className="truncate">
                {sessionData?.user?.name || "Account"}
              </span>
              <span className="text-xs text-neutral-500">
                {selectedTeamName}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute bottom-12 left-0 w-full rounded-md border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <button
                  onClick={() => {
                    logout(undefined, {
                      onSuccess: () => router.push("/login"),
                    })
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <FiLogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
    </>
  )
}
