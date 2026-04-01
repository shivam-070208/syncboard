"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { useTeams } from "@/modules/team/hooks/use-team"

export default function TeamDashboardPage() {
  const params = useParams<{ teamId: string }>()
  const router = useRouter()
  const { data } = useTeams()

  const teamId = params.teamId
  const team = useMemo(
    () => data?.teams.find((item) => item.id === teamId),
    [data?.teams, teamId]
  )

  if (!team) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
        <h1 className="text-lg font-semibold">Team not found</h1>
        <p className="mt-1 text-sm text-neutral-500">
          This team is not in your membership list.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 cursor-pointer"
          onClick={() => router.push("/dashboard/all")}
        >
          Go to all teams
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <h1 className="text-xl font-semibold">{team.name}</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        Team dashboard for <span className="font-medium">{team.id}</span>
      </p>
    </div>
  )
}
