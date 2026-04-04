"use client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card"
import { FaTrash } from "react-icons/fa"
import { EditableText } from "@workspace/ui/components/editable-text"
import { useUpdateTeamName, useDeleteTeam } from "@/modules/team/hooks/use-team"
import { useState } from "react"

const TeamDashboardHeader = ({
  team,
}: {
  team: { id: string; name: string }
}) => {
  const updateTeamNameMutation = useUpdateTeamName()
  const deleteTeamMutation = useDeleteTeam()
  const [localName, setLocalName] = useState(team.name)

  const handleUpdateTeamName = async (newName: string) => {
    await updateTeamNameMutation.mutateAsync({ teamId: team.id, name: newName })
    setLocalName(newName)
  }

  const handleDeleteTeam = async () => {
    await deleteTeamMutation.mutateAsync({ teamId: team.id })
  }

  return (
    <Card className="rotate-slight-reverse">
      <CardHeader>
        <div className="relative">
          <CardTitle className="font-handwritten-heading text-center text-4xl">
            <EditableText
              value={localName}
              onUpdate={handleUpdateTeamName}
              disabled={updateTeamNameMutation.isPending}
            />
          </CardTitle>
          <button
            onClick={handleDeleteTeam}
            disabled={deleteTeamMutation.isPending}
            className="absolute -top-2 right-0 rounded p-2 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
            title="Delete team"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-handwritten text-center text-lg text-muted-foreground">
          Team ID: {team.id}
        </p>
      </CardContent>
    </Card>
  )
}

export { TeamDashboardHeader }
