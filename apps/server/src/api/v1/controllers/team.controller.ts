import { Request, Response } from "express"
import teamService from "@v1/services/team.service"
import { HTTPStatusCodes } from "@workspace/shared"
import ApiError from "@/utils/api-error"
import { RequestWithSession } from "@/types/request-with-session"

export const createTeam = async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id
  const { name } = req.body
  if (typeof name !== "string" || !name.trim()) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "name is required.",
    })
  }
  const team = await teamService.createTeam(userId, name)

  return res.status(HTTPStatusCodes.HTTP_201_CREATED).json({
    success: true,
    team,
  })
}

export const deleteTeam = async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id
  const teamId = req.params.teamId as string
  if (!teamId) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "teamId is required.",
    })
  }
  const result = await teamService.deleteTeam(userId, teamId)

  return res.status(HTTPStatusCodes.HTTP_200_OK).json(result)
}

export const updateTeamName = async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id
  const teamId = req.params.teamId as string
  const { name } = req.body
  if (!teamId) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "teamId is required.",
    })
  }
  if (typeof name !== "string" || !name.trim()) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "name is required.",
    })
  }
  const result = await teamService.updateTeamName(userId, teamId, name)

  return res.status(HTTPStatusCodes.HTTP_200_OK).json(result)
}

export const listUserTeams = async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id
  const teams = await teamService.listUserTeams(userId)

  return res.status(HTTPStatusCodes.HTTP_200_OK).json({
    success: true,
    teams,
  })
}

export const getTeamById = async (req: Request, res: Response) => {
  const teamId = req.params.teamId as string
  const userId = (req as RequestWithSession).session.user.id
  if (!teamId) {
    throw new ApiError({
      statusCode: "HTTP_400_BAD_REQUEST",
      message: "teamId is required.",
    })
  }

  const team = await teamService.getTeamById(teamId, userId)

  return res.status(HTTPStatusCodes.HTTP_200_OK).json({
    success: true,
    team,
  })
}
