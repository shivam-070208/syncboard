"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar, SidebarBody } from "@workspace/ui/components/sidebar"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@workspace/ui/components/select"
import LogoIcon from "@/components/common/logo-icon"
import ProfileDropdown from "@/components/common/profile-dropdown"
import { useLogout, useSession } from "@/modules/auth/hooks/use-auth"
import { useTeams } from "@/modules/team/hooks/use-team"

const TEAM_STORAGE_KEY = "syncboard:selectedTeamId"

const DashboardSidebar = () => {
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

  const onSelectTeam = (teamId: string) => {
    setStoredTeamId(teamId)
    if (!teamId || teamId == "_") {
      router.push("/dashboard/all")
      return
    }
    window.localStorage.setItem(TEAM_STORAGE_KEY, teamId)
    router.push(`/dashboard/${teamId}`)
  }

  return (
    <>
      <Sidebar animate={false}>
        <SidebarBody className="h-dvh justify-between border-r border-neutral-200/70 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/all"
                className="flex items-center gap-2 text-sm font-bold text-neutral-700 dark:text-neutral-200"
              >
                <LogoIcon width={28} height={28} />
                <span>SyncBoard</span>
              </Link>
            </div>

            <div className="space-y-1">
              <Select
                value={selectedTeamId ?? ""}
                onValueChange={(v) => onSelectTeam(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Teams</SelectLabel>
                    <SelectItem key="all" value="_">
                      All Teams
                    </SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pb-2">
            <ProfileDropdown
              userName={sessionData?.user?.name || "Account"}
              onLogout={() => {
                logout(undefined, {
                  onSuccess: () => router.push("/login"),
                })
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </>
  )
}

export default DashboardSidebar
