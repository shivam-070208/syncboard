import Link from "next/link"
import React from "react"

export interface UserTeamListProps {
  teams: { id: string; name: string }[]
  isLoading: boolean
}

const UserTeamList: React.FC<UserTeamListProps> = ({ teams, isLoading }) => (
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
)

export { UserTeamList }
