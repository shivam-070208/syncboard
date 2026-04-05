"use client"

import { useRouter } from "next/navigation"
import { useSession } from "@/modules/auth/hooks/use-auth"
import { WorkspaceRoomShell } from "@/modules/workspace/components/room/workspace-room-shell"
import {
  useUpdateWorkspace,
  useWorkspace,
} from "@/modules/workspace/hooks/use-workspace"
import { useWorkspaceDocument } from "@/modules/workspace/hooks/use-workspace-document"
import { Button } from "@workspace/ui/components/button"

type WorkspaceExperienceProps = {
  workspaceId: string
}

const WorkspaceExperience = ({ workspaceId }: WorkspaceExperienceProps) => {
  const router = useRouter()
  const { data: sessionData, isLoading: sessionLoading } = useSession()
  const { data: workspaceData, isLoading: workspaceLoading } =
    useWorkspace(workspaceId)
  const userId = sessionData?.user?.id
  const docEnabled = Boolean(userId && workspaceData?.workspace)
  const { data: documentData, isLoading: documentLoading } =
    useWorkspaceDocument(workspaceId, docEnabled)
  const updateWorkspace = useUpdateWorkspace()

  if (sessionLoading || workspaceLoading) {
    return (
      <div className="paper-bg flex min-h-dvh items-center justify-center p-8">
        <p className="font-handwritten text-lg">Loading workspace...</p>
      </div>
    )
  }

  if (!sessionData?.user) {
    return (
      <div className="paper-bg flex min-h-dvh flex-col items-center justify-center gap-4 p-8">
        <p className="font-handwritten text-center text-lg">
          Sign in to open this workspace.
        </p>
        <Button onClick={() => router.push("/login")}>Go to login</Button>
      </div>
    )
  }

  if (!workspaceData?.workspace) {
    return (
      <div className="paper-bg flex min-h-dvh flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-handwritten-heading text-center text-3xl">
          Workspace not found
        </h1>
        <Button onClick={() => router.push("/dashboard/all")}>
          Go to dashboard
        </Button>
      </div>
    )
  }

  if (docEnabled && (documentLoading || !documentData?.document)) {
    return (
      <div className="paper-bg flex min-h-dvh items-center justify-center p-8">
        <p className="font-handwritten text-lg">Loading canvas...</p>
      </div>
    )
  }

  const ws = workspaceData.workspace
  const doc = documentData?.document

  if (!doc) {
    return (
      <div className="paper-bg flex min-h-[100dvh] items-center justify-center p-8">
        <p className="font-handwritten text-lg">Loading canvas...</p>
      </div>
    )
  }

  const handleTitle = async (next: string) => {
    await updateWorkspace.mutateAsync({ workspaceId, title: next })
  }

  return (
    <WorkspaceRoomShell
      workspaceId={workspaceId}
      userId={userId}
      title={ws.title}
      titleBusy={updateWorkspace.isPending}
      onTitleUpdate={handleTitle}
      onBack={() => router.back()}
      editorSeed={doc.editor_data}
      canvasSeed={doc.canvas_data}
    />
  )
}

export { WorkspaceExperience }
