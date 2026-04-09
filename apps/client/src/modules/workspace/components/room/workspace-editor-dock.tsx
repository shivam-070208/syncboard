"use client"

import { cn } from "@workspace/ui/lib/utils"

const WorkspaceEditorDock = () => {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden border-border bg-card"
      )}
    >
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="prose prose-sm dark:prose-invert max-w-none" />
      </div>
    </div>
  )
}

export { WorkspaceEditorDock }
