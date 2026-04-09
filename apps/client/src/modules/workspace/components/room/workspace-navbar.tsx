"use client"

import { Button } from "@workspace/ui/components/button"
import { EditableText } from "@workspace/ui/components/editable-text"
import { cn } from "@workspace/ui/lib/utils"
import { FaArrowLeft, FaBars } from "react-icons/fa"
import { WorkspaceShareControl } from "@/modules/workspace/components/room/workspace-share-control"

type WorkspaceNavbarProps = {
  title: string
  editorOpen: boolean
  onToggleEditor: () => void
  onBack: () => void
  onTitleUpdate: (next: string) => Promise<void>
  titleBusy: boolean
}

const WorkspaceNavbar = ({
  title,
  editorOpen,
  onToggleEditor,
  onBack,
  onTitleUpdate,
  titleBusy,
}: WorkspaceNavbarProps) => {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-2 sm:px-3"
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={onToggleEditor}
        aria-pressed={editorOpen}
        aria-label={editorOpen ? "Hide editor" : "Show editor"}
      >
        <FaBars className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={onBack}
        aria-label="Go back"
      >
        <FaArrowLeft className="h-5 w-5" />
      </Button>
      <div className="min-w-0 flex-1 px-1 text-center sm:text-left">
        <EditableText
          value={title}
          onUpdate={onTitleUpdate}
          disabled={titleBusy}
          className="font-handwritten-heading inline-block max-w-full truncate text-lg sm:text-xl"
        />
      </div>
      <WorkspaceShareControl />
    </header>
  )
}

export { WorkspaceNavbar }
