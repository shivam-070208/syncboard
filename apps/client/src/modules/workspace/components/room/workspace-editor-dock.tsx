"use client"
import { useCallback, useEffect, useMemo, useRef, type FocusEvent } from "react"
import type EditorJS from "@editorjs/editorjs"
import type { OutputData } from "@editorjs/editorjs"
import type { ToolConstructable } from "@editorjs/editorjs"
import { useSocket } from "@/components/providers/socket-provider"
import { normalizeEditorData } from "@/modules/workspace/lib/normalize-document"
import {
  SocketEvents,
  type WorkspaceRemoteSyncPayload,
} from "@workspace/shared"
import { cn } from "@workspace/ui/lib/utils"

type CaretPoint = {
  clientX: number
  clientY: number
}

type WorkspaceEditorDockProps = {
  workspaceId: string
  initialData: unknown
  onCaretPositionChange?: (point: CaretPoint) => void
  onCaretLeave?: () => void
}

const getSelectionCaretPoint = (selection: Selection): CaretPoint | null => {
  if (selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0).cloneRange()
  range.collapse(true)

  const rect = range.getBoundingClientRect()
  if (rect.width > 0 || rect.height > 0) {
    return {
      clientX: rect.left,
      clientY: rect.top + rect.height / 2,
    }
  }

  const clientRects = range.getClientRects()
  if (clientRects.length > 0) {
    const first = clientRects[0]
    if (!first) return null
    return {
      clientX: first.left,
      clientY: first.top + first.height / 2,
    }
  }

  const anchorElement =
    selection.anchorNode instanceof Element
      ? selection.anchorNode
      : selection.anchorNode?.parentElement

  if (!anchorElement) return null

  const anchorRect = anchorElement.getBoundingClientRect()
  return {
    clientX: anchorRect.left,
    clientY: anchorRect.top + anchorRect.height / 2,
  }
}

const WorkspaceEditorDock = ({
  workspaceId,
  initialData,
  onCaretPositionChange,
  onCaretLeave,
}: WorkspaceEditorDockProps) => {
  const { connected, socket } = useSocket()
  const rootRef = useRef<HTMLDivElement>(null)
  const holderRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorJS | null>(null)
  const socketRef = useRef(socket)
  const connectedRef = useRef(connected)
  const isRemoteUpdate = useRef(false)
  const pendingRemoteUpdate = useRef<OutputData | null>(null)
  const lastSnapshot = useRef("")

  const bootData = useMemo(
    () => normalizeEditorData(initialData),
    [initialData]
  )

  useEffect(() => {
    socketRef.current = socket
  }, [socket])

  useEffect(() => {
    connectedRef.current = connected
  }, [connected])

  const send = useCallback(
    (payload: OutputData) => {
      if (!socketRef.current || !connectedRef.current) return
      socketRef.current.emit(SocketEvents.SYNC, {
        workspaceId,
        source: "editor",
        payload: payload as unknown as Record<string, unknown>,
      })
    },
    [workspaceId]
  )

  const handleEditorChange = useCallback(async () => {
    if (isRemoteUpdate.current) return
    if (!editorRef.current) return
    try {
      const output = await editorRef.current.save()
      const snapshot = JSON.stringify(output.blocks ?? [])
      if (snapshot === lastSnapshot.current) return
      lastSnapshot.current = snapshot
      send(output)
    } catch {
      return
    }
  }, [send])

  useEffect(() => {
    let cancelled = false

    const initEditor = async () => {
      if (!holderRef.current) return

      const [{ default: Editor }, { default: Paragraph }] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/paragraph"),
      ])

      if (cancelled || !holderRef.current) return

      lastSnapshot.current = JSON.stringify(bootData.blocks ?? [])

      const editor = new Editor({
        holder: holderRef.current,
        data: bootData,
        placeholder: "Write your notes...",
        tools: {
          paragraph: {
            class: Paragraph as ToolConstructable,
            config: {
              placeholder: "Type here",
            },
            inlineToolbar: true,
          },
        },
        async onChange() {
          await handleEditorChange()
        },
      })

      editorRef.current = editor as EditorJS

      try {
        await editor.isReady
        if (pendingRemoteUpdate.current) {
          const queuedData = pendingRemoteUpdate.current
          pendingRemoteUpdate.current = null
          isRemoteUpdate.current = true
          lastSnapshot.current = JSON.stringify(queuedData.blocks ?? [])
          try {
            await editor.render(queuedData)
          } finally {
            isRemoteUpdate.current = false
          }
        }
      } catch {
        return
      }
    }

    void initEditor()

    return () => {
      cancelled = true
      onCaretLeave?.()
      const editor = editorRef.current
      editorRef.current = null
      if (!editor) return
      void editor.isReady.then(() => editor.destroy()).catch(() => undefined)
    }
  }, [bootData, handleEditorChange, onCaretLeave])

  useEffect(() => {
    if (!connected || !socket) return

    const handler = async (data: WorkspaceRemoteSyncPayload) => {
      if (data.socketId === socket.id) return
      if (data.source !== "editor") return

      const next = normalizeEditorData(data.payload)
      const nextSnapshot = JSON.stringify(next.blocks ?? [])
      if (nextSnapshot === lastSnapshot.current) return

      lastSnapshot.current = nextSnapshot

      if (!editorRef.current) {
        pendingRemoteUpdate.current = next
        return
      }

      try {
        isRemoteUpdate.current = true
        await editorRef.current.render(next)
      } finally {
        isRemoteUpdate.current = false
      }
    }

    socket.on(SocketEvents.REMOTE_SYNC, handler)
    return () => {
      socket.off(SocketEvents.REMOTE_SYNC, handler)
    }
  }, [connected, socket])

  const publishCaret = useCallback(() => {
    if (!onCaretPositionChange) return
    if (!rootRef.current) return
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      onCaretLeave?.()
      return
    }
    if (
      !selection.anchorNode ||
      !rootRef.current.contains(selection.anchorNode)
    ) {
      onCaretLeave?.()
      return
    }
    const point = getSelectionCaretPoint(selection)
    if (!point) return
    onCaretPositionChange(point)
  }, [onCaretLeave, onCaretPositionChange])

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const nextFocused = event.relatedTarget as Node | null
      if (nextFocused && event.currentTarget.contains(nextFocused)) return
      onCaretLeave?.()
    },
    [onCaretLeave]
  )

  useEffect(() => {
    const handleSelectionChange = () => {
      publishCaret()
    }

    const handleWindowBlur = () => {
      onCaretLeave?.()
    }

    const handleVisibility = () => {
      if (document.hidden) onCaretLeave?.()
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    window.addEventListener("blur", handleWindowBlur)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
      window.removeEventListener("blur", handleWindowBlur)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [onCaretLeave, publishCaret])

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden border-border bg-card"
      )}
      onMouseUp={publishCaret}
      onKeyUp={publishCaret}
      onBlurCapture={handleBlur}
    >
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div
          ref={holderRef}
          className="prose prose-sm dark:prose-invert max-w-none"
        />
      </div>
    </div>
  )
}

export { WorkspaceEditorDock }
