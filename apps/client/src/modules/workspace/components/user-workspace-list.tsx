"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@workspace/ui/components/card"
import { FaTrash, FaFileAlt } from "react-icons/fa"
import { EditableText } from "@workspace/ui/components/editable-text"
import {
  useTeamWorkspaces,
  useUpdateWorkspace,
  useDeleteWorkspace,
} from "@/modules/workspace/hooks/use-workspace"

const UserWorkspaceList = ({ teamId }: { teamId: string }) => {
  const router = useRouter()
  const { data: workspacesData } = useTeamWorkspaces(teamId)
  const updateWorkspaceMutation = useUpdateWorkspace()
  const deleteWorkspaceMutation = useDeleteWorkspace()

  const handleUpdateWorkspaceName = async (
    workspaceId: string,
    newTitle: string
  ) => {
    try {
      await updateWorkspaceMutation.mutateAsync({
        workspaceId,
        title: newTitle,
      })
    } catch (error) {
      console.error("Failed to update workspace:", error)
    }
  }

  const handleDeleteWorkspace = async (
    workspaceId: string,
    workspaceTitle: string
  ) => {
    if (
      window.confirm(`Are you sure you want to delete "${workspaceTitle}"?`)
    ) {
      try {
        await deleteWorkspaceMutation.mutateAsync(workspaceId)
      } catch (error) {
        console.error("Failed to delete workspace:", error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-handwritten-heading text-center text-3xl">
        Team Files
      </h2>
      {workspacesData?.workspaces.length === 0 ? (
        <Card className="rotate-slight">
          <CardContent className="p-8 text-center">
            <FaFileAlt className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <p className="font-handwritten text-lg text-muted-foreground">
              No files created yet. Click "Create New File" to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workspacesData?.workspaces.map((workspace: any, index: number) => (
            <Card
              key={workspace.id}
              className={`transition-transform hover:rotate-1 ${
                index % 2 === 0 ? "rotate-slight" : "rotate-slight-reverse"
              }`}
            >
              <CardContent className="p-6">
                <div className="group relative">
                  <FaFileAlt
                    className="mb-4 h-12 w-12 cursor-pointer text-primary hover:opacity-75"
                    onClick={() => router.push(`/workspace/${workspace.id}`)}
                  />
                  <button
                    onClick={() =>
                      handleDeleteWorkspace(workspace.id, workspace.title)
                    }
                    disabled={deleteWorkspaceMutation.isPending}
                    className="absolute -top-2 -right-2 rounded p-1 text-red-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 disabled:opacity-50"
                    title="Delete file"
                  >
                    <FaTrash className="h-3 w-3" />
                  </button>
                </div>
                <h3
                  className="font-handwritten-heading mb-2 cursor-pointer text-xl hover:opacity-75"
                  onClick={() => router.push(`/workspace/${workspace.id}`)}
                >
                  <EditableText
                    value={workspace.title}
                    onUpdate={(newTitle) =>
                      handleUpdateWorkspaceName(workspace.id, newTitle)
                    }
                    disabled={updateWorkspaceMutation.isPending}
                  />
                </h3>
                <p
                  className="font-handwritten cursor-pointer text-sm text-muted-foreground hover:opacity-75"
                  onClick={() => router.push(`/workspace/${workspace.id}`)}
                >
                  Created {new Date(workspace.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export { UserWorkspaceList }
