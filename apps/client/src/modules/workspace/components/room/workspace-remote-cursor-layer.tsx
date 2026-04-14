"use client"

import { useEffect, useMemo, useState } from "react"
import type { RefObject } from "react"
import { FaMousePointer } from "react-icons/fa"
import type { WorkspaceRemoteCursorState } from "@/modules/workspace/hooks/use-workspace-cursor-presence"

type WorkspaceSurfaceRefMap = {
  editor: RefObject<HTMLElement | null>
  canvas: RefObject<HTMLElement | null>
}

type WorkspaceRemoteCursorLayerProps = {
  cursors: WorkspaceRemoteCursorState[]
  surfaceRefs: WorkspaceSurfaceRefMap
}

type ProjectedCursor = WorkspaceRemoteCursorState & {
  left: number
  top: number
}

const WorkspaceRemoteCursorLayer = ({
  cursors,
  surfaceRefs,
}: WorkspaceRemoteCursorLayerProps) => {
  const [layoutVersion, setLayoutVersion] = useState(0)

  useEffect(() => {
    const updateLayout = () => {
      setLayoutVersion((v) => v + 1)
    }

    window.addEventListener("resize", updateLayout)
    window.addEventListener("scroll", updateLayout, true)

    return () => {
      window.removeEventListener("resize", updateLayout)
      window.removeEventListener("scroll", updateLayout, true)
    }
  }, [])

  const projectedCursors = useMemo(() => {
    return cursors.reduce<ProjectedCursor[]>((acc, cursor) => {
      const surface = surfaceRefs[cursor.surface].current
      if (!surface) return acc

      const rect = surface.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return acc

      acc.push({
        ...cursor,
        left: rect.left + cursor.x * rect.width,
        top: rect.top + cursor.y * rect.height,
      })

      return acc
    }, [])
  }, [cursors, layoutVersion, surfaceRefs])

  if (projectedCursors.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] select-none">
      {projectedCursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute"
          style={{ left: cursor.left, top: cursor.top }}
        >
          {cursor.surface === "editor" ? (
            <div className="-translate-x-1/2 -translate-y-1/2">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-primary px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-primary-foreground shadow">
                {cursor.userName}
              </span>
              <span className="block h-5 w-[2px] rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.65)]" />
            </div>
          ) : (
            <div className="-translate-x-[2px] -translate-y-[2px]">
              <span className="absolute -top-6 left-2 rounded bg-primary px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-primary-foreground shadow">
                {cursor.userName}
              </span>
              <FaMousePointer className="h-4 w-4 text-sky-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export { WorkspaceRemoteCursorLayer }
