import { Router } from "express"
import {
  createTeam,
  deleteTeam,
  getTeamById,
  updateTeamName,
} from "../controllers/team.controller"
import { isAuthorize } from "../middelwares/auth.middelware"

const teamRouter: Router = Router()
teamRouter.use(isAuthorize)

import { listUserTeams } from "../controllers/team.controller"

teamRouter.get("/", listUserTeams)
teamRouter.get("/:teamId", getTeamById)
teamRouter.post("/", createTeam)
teamRouter.delete("/:teamId", deleteTeam)
teamRouter.patch("/:teamId", updateTeamName)

export default teamRouter
