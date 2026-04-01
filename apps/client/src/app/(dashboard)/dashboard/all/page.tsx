"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import {
  useCreateTeam,
  useJoinTeam,
  useTeams,
} from "@/modules/team/hooks/use-team"

export default function DashboardAllPage() {
  const { data: teamsData, isLoading } = useTeams()
  const { mutate: createTeam, isPending: isCreatingTeam } = useCreateTeam()
  const { mutate: joinTeam, isPending: isJoiningTeam } = useJoinTeam()

  const teams = teamsData?.teams ?? []

  const [createTeamName, setCreateTeamName] = useState("")
  const [joinTeamId, setJoinTeamId] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onCreateTeam = () => {
    const name = createTeamName.trim()
    if (!name) {
      setErrorMessage("Team name is required")
      return
    }

    setErrorMessage(null)
    createTeam(
      { name },
      {
        onSuccess: () => setCreateTeamName(""),
        onError: (err) => setErrorMessage(err.message),
      }
    )
  }

  const onJoinTeam = () => {
    const teamId = joinTeamId.trim()
    if (!teamId) {
      setErrorMessage("Team ID is required")
      return
    }

    setErrorMessage(null)
    joinTeam(
      { teamId },
      {
        onSuccess: () => setJoinTeamId(""),
        onError: (err) => setErrorMessage(err.message),
      }
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <h1 className="text-xl font-semibold">Teams</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Create a new team or join an existing one.
        </p>

        {errorMessage ? (
          <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
        ) : null}

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs text-neutral-500">Create team</label>
            <div className="flex gap-2">
              <input
                value={createTeamName}
                onChange={(event) => setCreateTeamName(event.target.value)}
                placeholder="Team name"
                className="h-9 w-full rounded-md border border-neutral-300 px-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              />
              <Button
                type="button"
                onClick={onCreateTeam}
                disabled={isCreatingTeam}
                className="cursor-pointer"
              >
                Create
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral-500">
              Join with team ID
            </label>
            <div className="flex gap-2">
              <input
                value={joinTeamId}
                onChange={(event) => setJoinTeamId(event.target.value)}
                placeholder="Paste team ID"
                className="h-9 w-full rounded-md border border-neutral-300 px-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              />
              <Button
                type="button"
                variant="outline"
                onClick={onJoinTeam}
                disabled={isJoiningTeam}
                className="cursor-pointer"
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <h2 className="text-lg font-semibold">Your teams</h2>
        {isLoading ? (
          <p className="mt-2 text-sm text-neutral-500">Loading teams...</p>
        ) : teams.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">No team yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/dashboard/${team.id}`}
                className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
              >
                <span className="font-medium">{team.name}</span>
                <span className="text-xs text-neutral-500">{team.id}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
