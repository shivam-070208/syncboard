"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  useWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
} from "@/modules/workspace/hooks/use-workspace"
import { FaArrowLeft, FaFileAlt, FaUsers, FaTrash } from "react-icons/fa"
import { EditableText } from "@workspace/ui/components/editable-text"

export default function WorkspacePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const workspaceId = params.id

  const { data: workspaceData, isLoading } = useWorkspace(workspaceId)
  const updateWorkspaceMutation = useUpdateWorkspace()
  const deleteWorkspaceMutation = useDeleteWorkspace()

  const handleUpdateTitle = async (newTitle: string) => {
    try {
      await updateWorkspaceMutation.mutateAsync({
        workspaceId,
        title: newTitle,
      })
    } catch (error) {
      console.error("Failed to update workspace:", error)
    }
  }

  const handleDeleteWorkspace = async () => {
    if (workspaceData?.workspace) {
      if (
        window.confirm(
          `Are you sure you want to delete "${workspaceData.workspace.title}"?`
        )
      ) {
        try {
          await deleteWorkspaceMutation.mutateAsync(workspaceId)
          router.push(`/dashboard/${workspaceData.workspace.team_id}`)
        } catch (error) {
          console.error("Failed to delete workspace:", error)
        }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="paper-bg min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <Card className="rotate-slight">
            <CardContent className="p-8 text-center">
              <p className="font-handwritten text-lg">Loading workspace...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!workspaceData?.workspace) {
    return (
      <div className="paper-bg min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <Card className="rotate-slight">
            <CardContent className="p-8 text-center">
              <h1 className="font-handwritten-heading mb-4 text-3xl">
                Workspace not found
              </h1>
              <p className="font-handwritten mb-6 text-lg text-muted-foreground">
                This workspace doesn't exist or you don't have access to it.
              </p>
              <Button onClick={() => router.push("/dashboard/all")}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const workspace = workspaceData.workspace

  return (
    <div className="paper-bg min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <FaArrowLeft className="h-5 w-5" />
            Back
          </Button>
        </div>

        {/* Workspace Header */}
        <Card className="rotate-slight-reverse">
          <CardHeader>
            <div className="relative">
              <CardTitle className="font-handwritten-heading flex items-center justify-center gap-4 text-center text-4xl">
                <FaFileAlt className="h-10 w-10" />
                <EditableText
                  value={workspace.title}
                  onUpdate={handleUpdateTitle}
                  disabled={updateWorkspaceMutation.isPending}
                />
              </CardTitle>
              <button
                onClick={handleDeleteWorkspace}
                disabled={deleteWorkspaceMutation.isPending}
                className="absolute -top-2 right-0 rounded p-2 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                title="Delete workspace"
              >
                <FaTrash className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-center">
              <p className="font-handwritten text-lg text-muted-foreground">
                Workspace ID: {workspace.id}
              </p>
              <p className="font-handwritten text-lg text-muted-foreground">
                Created {new Date(workspace.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Workspace Content Placeholder */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card className="rotate-slight min-h-[400px]">
              <CardContent className="p-8">
                <h2 className="font-handwritten-heading mb-6 text-2xl">
                  Workspace Content
                </h2>
                <div className="space-y-4">
                  <p className="font-handwritten text-lg text-muted-foreground">
                    This is where your workspace content would go. You can add:
                  </p>
                  <ul className="font-handwritten list-inside list-disc space-y-2 text-lg">
                    <li>Documents and files</li>
                    <li>Collaborative editing</li>
                    <li>Team discussions</li>
                    <li>Project planning</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rotate-slight-reverse">
              <CardHeader>
                <CardTitle className="font-handwritten-heading flex items-center gap-2 text-xl">
                  <FaUsers className="h-5 w-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-handwritten text-sm text-muted-foreground">
                  Team collaboration features coming soon...
                </p>
              </CardContent>
            </Card>

            <Card className="rotate-slight">
              <CardHeader>
                <CardTitle className="font-handwritten-heading text-xl">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-handwritten text-sm text-muted-foreground">
                  Activity feed will be displayed here...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
