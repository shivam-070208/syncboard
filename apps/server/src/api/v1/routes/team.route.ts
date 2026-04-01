import { Router } from "express"
import {
  createTeam,
  deleteTeam,
  getTeamById,
  joinTeam,
  listUserTeams,
  updateTeamName,
} from "../controllers/team.controller"
import { isAuthorize } from "../middelwares/auth.middelware"
import { tryCatch } from "@/utils/try-catch"

const teamRouter: Router = Router()
teamRouter.use(isAuthorize)

teamRouter.get("/", tryCatch(listUserTeams))
teamRouter.get("/:teamId", tryCatch(getTeamById))
teamRouter.post("/", tryCatch(createTeam))
teamRouter.post("/join", tryCatch(joinTeam))
teamRouter.delete("/:teamId", tryCatch(deleteTeam))
teamRouter.patch("/:teamId", tryCatch(updateTeamName))

export default teamRouter
