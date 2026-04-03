import { Button } from "@workspace/ui/components/button"
import React from "react"

export interface JoinTeamModalProps {
  open: boolean
  onClose: () => void
  joinSearch: string
  setJoinSearch: (val: string) => void
  refetchSearch: () => void
  isFetching: boolean
  availableTeams: { id: string; name: string }[]
  teams: { id: string }[]
  onJoinRequest: (teamId: string) => void
  isRequestingJoin: boolean
}

const JoinTeamModal: React.FC<JoinTeamModalProps> = ({
  open,
  onClose,
  joinSearch,
  setJoinSearch,
  refetchSearch,
  isFetching,
  availableTeams,
  teams,
  onJoinRequest,
  isRequestingJoin,
}) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold">Join a Team</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Search by name and request access.
        </p>
        <div className="mt-4 flex gap-2">
          <input
            value={joinSearch}
            onChange={(e) => setJoinSearch(e.target.value)}
            placeholder="Search teams..."
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
          />
          <Button
            type="button"
            onClick={refetchSearch}
            disabled={joinSearch.trim().length === 0 || isFetching}
          >
            {isFetching ? "Searching..." : "Search"}
          </Button>
        </div>
        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
          {joinSearch.trim().length === 0 ? (
            <p className="text-sm text-neutral-500">
              Enter search text and click search first.
            </p>
          ) : availableTeams.length === 0 ? (
            <p className="text-sm text-neutral-500">No teams found.</p>
          ) : (
            availableTeams.map((team) => {
              const joined = teams.some((t) => t.id === team.id)
              return (
                <div
                  key={team.id}
                  className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 dark:border-neutral-700"
                >
                  <div>
                    <p className="font-medium">{team.name}</p>
                    <p className="text-xs text-neutral-500">{team.id}</p>
                  </div>
                  <Button
                    type="button"
                    variant={joined ? "outline" : "default"}
                    onClick={() => onJoinRequest(team.id)}
                    disabled={joined || isRequestingJoin}
                  >
                    {joined ? "Joined" : "Request join"}
                  </Button>
                </div>
              )
            })
          )}
        </div>
        <div className="mt-4 text-right">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export { JoinTeamModal }
