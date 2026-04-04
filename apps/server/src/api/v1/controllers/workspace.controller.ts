import { Request, Response } from "express"
import workspaceService from "@v1/services/workspace.service"
import { HTTPStatusCodes } from "@workspace/shared"
import ApiError from "@/utils/api-error"
import { RequestWithSession } from "@/types/request-with-session"

export const createWorkspace = async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id
  const { teamId, title } = req.body

  if (typeof teamId !== "string" || !teamId.trim()) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "teamId is required.",
    })
  }

  const workspace = await workspaceService.createWorkspace(
    teamId,
    userId,
    title
  )

  return res.status(HTTPStatusCodes.HTTP_201_CREATED).json({
    success: true,
    workspace,
  })
}

export const listTeamWorkspaces = async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id
  const teamId = req.params.teamId as string

  if (!teamId) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "teamId is required.",
    })
  }

  const workspaces = await workspaceService.listTeamWorkspaces(teamId, userId)

  return res.status(HTTPStatusCodes.HTTP_200_OK).json({
    success: true,
    workspaces,
  })
}

export const getWorkspaceById = async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id
  const workspaceId = req.params.workspaceId as string

  if (!workspaceId) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "workspaceId is required.",
    })
  }

  const workspace = await workspaceService.getWorkspaceById(workspaceId, userId)

  return res.status(HTTPStatusCodes.HTTP_200_OK).json({
    success: true,
    workspace,
  })
}

export const deleteWorkspace = async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id
  const workspaceId = req.params.workspaceId as string

  if (!workspaceId) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "workspaceId is required.",
    })
  }

  const result = await workspaceService.deleteWorkspace(workspaceId, userId)

  return res.status(HTTPStatusCodes.HTTP_200_OK).json(result)
}

export const updateWorkspaceTitle = async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id
  const workspaceId = req.params.workspaceId as string
  const { title } = req.body

  if (!workspaceId) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "workspaceId is required.",
    })
  }

  if (typeof title !== "string" || !title.trim()) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "title is required.",
    })
  }

  const result = await workspaceService.updateWorkspaceTitle(
    workspaceId,
    userId,
    title
  )

  return res.status(HTTPStatusCodes.HTTP_200_OK).json(result)
}
