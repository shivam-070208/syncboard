"use client"

import dynamic from "next/dynamic"
import { useCallback } from "react"
import type { CanvasPersistPayload } from "@/modules/workspace/lib/normalize-document"
import { normalizeCanvasData } from "@/modules/workspace/lib/normalize-document"
import { cn } from "@workspace/ui/lib/utils"
import "@excalidraw/excalidraw/index.css"

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div
        className={cn(
          "flex h-full items-center justify-center text-sm text-muted-foreground"
        )}
      >
        Loading board
      </div>
    ),
  }
)

type WorkspaceExcalidrawStageProps = {
  workspaceId: string
  initialData: unknown
  className?: string
}

const WorkspaceExcalidrawStage = ({
  workspaceId,
  initialData,
  className,
}: WorkspaceExcalidrawStageProps) => {
  const boot = normalizeCanvasData(initialData)

  const handleChange = useCallback(
    (elements: readonly unknown[], appState: unknown) => {
      const as = appState as Record<string, unknown>
      const payload: CanvasPersistPayload = {
        elements: [...elements],
        appState: {
          viewBackgroundColor: as.viewBackgroundColor,
          gridSize: as.gridSize,
          zenModeEnabled: as.zenModeEnabled,
        },
      }
      console.log(payload)
    },
    []
  )

  return (
    <div
      className={cn(
        "relative min-h-0 min-w-0 flex-1 overflow-hidden bg-muted/30",
        className
      )}
    >
      <Excalidraw
        key={workspaceId}
        initialData={{
          elements: boot.elements as never,
          appState: boot.appState as never,
        }}
        onChange={handleChange}
      />
    </div>
  )
}

export { WorkspaceExcalidrawStage }
