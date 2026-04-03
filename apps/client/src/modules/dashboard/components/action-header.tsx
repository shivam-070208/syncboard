import { Button } from "@workspace/ui/components/button"
import React from "react"

const ActionHeader = ({
  onCreateClick,
  onJoinClick,
  errorMessage,
}: {
  onCreateClick: () => void
  onJoinClick: () => void
  errorMessage: string | null
}) => (
  <section className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
    <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div>
          <h1 className="text-xl font-semibold">Teams</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Create a team or request access by searching available teams.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={onCreateClick}>
          Create Team
        </Button>
        <Button type="button" variant="outline" onClick={onJoinClick}>
          Request Join
        </Button>
      </div>
    </div>
    {errorMessage && (
      <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
    )}
  </section>
)

export { ActionHeader }
