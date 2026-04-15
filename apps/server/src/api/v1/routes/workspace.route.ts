import { Router } from "express"
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaceDocument,
  listTeamWorkspaces,
  updateWorkspaceTitle,
} from "../controllers/workspace.controller"
import { isAuthorize } from "../middelwares/auth.middelware"
import { tryCatch } from "@/utils/try-catch"

const workspaceRouter: Router = Router()
workspaceRouter.use(isAuthorize)

workspaceRouter.get("/:workspaceId/document", tryCatch(getWorkspaceDocument))
workspaceRouter.get("/team/:teamId", tryCatch(listTeamWorkspaces))
workspaceRouter.get("/:workspaceId", tryCatch(getWorkspaceById))
workspaceRouter.post("/", tryCatch(createWorkspace))
workspaceRouter.delete("/:workspaceId", tryCatch(deleteWorkspace))
workspaceRouter.patch("/:workspaceId", tryCatch(updateWorkspaceTitle))

export default workspaceRouter
