import { Router } from "express"
import {
  approveJoinRequest,
  createTeam,
  deleteTeam,
  getTeamById,
  joinTeam,
  listTeamJoinRequests,
  listUserTeams,
  rejectJoinRequest,
  requestJoinTeam,
  searchTeams,
  updateTeamName,
} from "../controllers/team.controller"
import { isAuthorize } from "../middelwares/auth.middelware"
import { tryCatch } from "@/utils/try-catch"

const teamRouter: Router = Router()
teamRouter.use(isAuthorize)

teamRouter.get("/", tryCatch(listUserTeams))
teamRouter.get("/search", tryCatch(searchTeams))
teamRouter.get("/:teamId", tryCatch(getTeamById))
teamRouter.get("/:teamId/join-requests", tryCatch(listTeamJoinRequests))
teamRouter.post("/", tryCatch(createTeam))
teamRouter.post("/join", tryCatch(joinTeam))
teamRouter.post("/request-join", tryCatch(requestJoinTeam))
teamRouter.patch("/:teamId", tryCatch(updateTeamName))
teamRouter.patch(
  "/join-request/:requestId/approve",
  tryCatch(approveJoinRequest)
)
teamRouter.patch("/join-request/:requestId/reject", tryCatch(rejectJoinRequest))
teamRouter.delete("/:teamId", tryCatch(deleteTeam))

export default teamRouter
