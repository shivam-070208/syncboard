import { Router } from "express"
import {
  createTeam,
  deleteTeam,
  getTeamById,
  joinTeam,
  listUserTeams,
  updateTeamName,
  searchTeams,
  requestJoinTeam,
} from "../controllers/team.controller"
import { isAuthorize } from "../middelwares/auth.middelware"
import { tryCatch } from "@/utils/try-catch"

const teamRouter: Router = Router()
teamRouter.use(isAuthorize)

teamRouter.get("/", tryCatch(listUserTeams))
teamRouter.get("/search", tryCatch(searchTeams))
teamRouter.get("/:teamId", tryCatch(getTeamById))
teamRouter.post("/", tryCatch(createTeam))
teamRouter.post("/join", tryCatch(joinTeam))
teamRouter.post("/request-join", tryCatch(requestJoinTeam))
teamRouter.delete("/:teamId", tryCatch(deleteTeam))
teamRouter.patch("/:teamId", tryCatch(updateTeamName))

export default teamRouter
