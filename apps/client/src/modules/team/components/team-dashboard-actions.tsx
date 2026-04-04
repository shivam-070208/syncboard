"use client"

import {
  useTeamJoinRequests,
  useApproveJoinRequest,
  useRejectJoinRequest,
} from "../hooks/use-team"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@workspace/ui/components/dialog"
import { Card, CardContent } from "@workspace/ui/components/card"
import { FaPlus, FaUsers, FaCheck, FaTimes } from "react-icons/fa"
import { useState } from "react"

import { useCreateWorkspace } from "@/modules/workspace/hooks/use-workspace"

type JoinRequest = {
  id: string
  user_name: string
  user_email: string
}

const TeamDashboardActions = ({ teamId }: { teamId: string }) => {
  const [joinRequestsOpen, setJoinRequestsOpen] = useState(false)

  const { data, isLoading, refetch } = useTeamJoinRequests(teamId)

  const createWorkspaceMutation = useCreateWorkspace()
  const approveMutation = useApproveJoinRequest()
  const rejectMutation = useRejectJoinRequest()

  const requests: JoinRequest[] = data?.requests || []

  const handleCreateWorkspace = async () => {
    try {
      await createWorkspaceMutation.mutateAsync({ teamId })
    } catch (error) {
      console.error(error)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id)
      refetch()
    } catch (error) {
      console.error(error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectMutation.mutateAsync(id)
      refetch()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      <Button
        onClick={handleCreateWorkspace}
        disabled={createWorkspaceMutation.isPending}
        size="lg"
        className="flex items-center gap-3"
      >
        <FaPlus className="h-5 w-5" />
        {createWorkspaceMutation.isPending ? "Creating..." : "Create New File"}
      </Button>

      <Dialog open={joinRequestsOpen} onOpenChange={setJoinRequestsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="lg"
            className="flex items-center gap-3"
            onClick={() => setJoinRequestsOpen(true)}
            onLoad={() => console.log("Rendering")}
          >
            <FaUsers className="h-10 w-10" />
            Join Requests ({requests?.length ?? 0})
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[500px] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">Join Requests</DialogTitle>
          </DialogHeader>

          <div className="max-h-80 space-y-4 overflow-y-auto pr-2">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : !requests || requests.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No pending requests
              </p>
            ) : (
              requests.map((req) => {
                const isApproving =
                  approveMutation.isPending &&
                  approveMutation.variables === req.id

                const isRejecting =
                  rejectMutation.isPending &&
                  rejectMutation.variables === req.id

                return (
                  <Card key={req.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-semibold">{req.user_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {req.user_email}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(req.id)}
                          disabled={isApproving || isRejecting}
                          className="bg-green-500 text-white hover:bg-green-600"
                        >
                          {isApproving ? "..." : <FaCheck />}
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(req.id)}
                          disabled={isApproving || isRejecting}
                        >
                          {isRejecting ? "..." : <FaTimes />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          <DialogClose>
            <Button variant="outline" className="mt-4 w-full">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { TeamDashboardActions }
