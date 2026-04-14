"use client"

import { useState } from "react"
import {
  useCreateTeam,
  useRequestJoinTeam,
  useSearchTeams,
  useTeams,
} from "@/modules/team/hooks/use-team"
import { ActionHeader } from "../components/action-header"
import { UserTeamList } from "@/modules/team/components/user-team-list"
import { CreateTeamModal } from "@/modules/team/components/create-team-modal"
import { JoinTeamModal } from "@/modules/team/components/join-team-modal"

const AllTeams = () => {
  const { data: teamsData, isLoading } = useTeams()
  const { mutate: createTeam, isPending: isCreatingTeam } = useCreateTeam()
  const { mutate: requestJoinTeam, isPending: isRequestingJoin } =
    useRequestJoinTeam()

  const teams = teamsData?.teams ?? []

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [createTeamName, setCreateTeamName] = useState("")
  const [joinSearch, setJoinSearch] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    data: searchResults,
    refetch: refetchSearch,
    isFetching,
  } = useSearchTeams(joinSearch)
  const availableTeams = searchResults?.teams ?? []

  const handleCreateTeam = () => {
    const name = createTeamName.trim()
    if (!name) {
      setErrorMessage("Team name is required")
      return
    }

    setErrorMessage(null)
    createTeam(
      { name },
      {
        onSuccess: () => {
          setCreateTeamName("")
          setCreateModalOpen(false)
        },
        onError: (err) => setErrorMessage(err.message),
      }
    )
  }

  const handleJoinRequest = (teamId: string) => {
    setErrorMessage(null)
    requestJoinTeam(
      { teamId },
      {
        onSuccess: () => {
          refetchSearch()
        },
        onError: (err) => setErrorMessage(err.message),
      }
    )
  }

  return (
    <div className="mx-auto w-full space-y-6">
      <ActionHeader
        onCreateClick={() => setCreateModalOpen(true)}
        onJoinClick={() => setJoinModalOpen(true)}
        errorMessage={errorMessage}
      />

      <UserTeamList teams={teams} isLoading={isLoading} />

      <CreateTeamModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateTeam={handleCreateTeam}
        createTeamName={createTeamName}
        setCreateTeamName={setCreateTeamName}
        isCreatingTeam={isCreatingTeam}
      />

      <JoinTeamModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        joinSearch={joinSearch}
        setJoinSearch={setJoinSearch}
        refetchSearch={refetchSearch}
        isFetching={isFetching}
        availableTeams={availableTeams}
        teams={teams}
        onJoinRequest={handleJoinRequest}
        isRequestingJoin={isRequestingJoin}
      />
    </div>
  )
}

export default AllTeams
