"use client"
import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTeams } from "@/modules/team/hooks/use-team"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { TeamDashboardHeader } from "@/modules/team/components/team-dashboard-header"
import { TeamDashboardActions } from "@/modules/team/components/team-dashboard-actions"
import { UserWorkspaceList } from "@/modules/workspace/components/user-workspace-list"

const TeamDashboardPage = () => {
  const params = useParams<{ teamId: string }>()
  const router = useRouter()
  const { data: teamsData } = useTeams()

  const teamId = params.teamId
  const team = useMemo(
    () => teamsData?.teams.find((item) => item.id === teamId),
    [teamsData?.teams, teamId]
  )

  if (!team) {
    return (
      <div className="paper-bg min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <Card className="rotate-slight">
            <CardContent className="p-8 text-center">
              <h1 className="font-handwritten-heading mb-4 text-3xl">
                Team not found
              </h1>
              <p className="font-handwritten mb-6 text-lg text-muted-foreground">
                This team is not in your membership list.
              </p>
              <Button onClick={() => router.push("/dashboard/all")}>
                Go to all teams
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="paper-bg min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <TeamDashboardHeader team={team} />
        <TeamDashboardActions teamId={teamId} />
        <UserWorkspaceList teamId={teamId} />
      </div>
    </div>
  )
}

export default TeamDashboardPage
