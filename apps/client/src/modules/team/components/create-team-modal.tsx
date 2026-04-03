import { Button } from "@workspace/ui/components/button"
import React from "react"

export interface CreateTeamModalProps {
  open: boolean
  onClose: () => void
  onCreateTeam: () => void
  createTeamName: string
  setCreateTeamName: (name: string) => void
  isCreatingTeam: boolean
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  open,
  onClose,
  onCreateTeam,
  createTeamName,
  setCreateTeamName,
  isCreatingTeam,
}) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold">Create Team</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Enter a name to create a new team.
        </p>
        <div className="mt-4 space-y-2">
          <input
            value={createTeamName}
            onChange={(e) => setCreateTeamName(e.target.value)}
            placeholder="Team name"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onCreateTeam}
              disabled={isCreatingTeam}
            >
              {isCreatingTeam ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { CreateTeamModal }
