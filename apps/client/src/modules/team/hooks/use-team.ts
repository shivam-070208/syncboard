"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axiosClient from "@/config/axios-client"
import type { Team } from "@workspace/shared"

type ListTeamsResponse = {
  success: boolean
  teams: Team[]
}

type CreateTeamInput = {
  name: string
}

type CreateTeamResponse = {
  success: boolean
  team: Team
}

type JoinTeamInput = {
  teamId: string
}

type JoinTeamResponse = {
  success: boolean
  message: string
}

type SearchTeamsInput = {
  q: string
}

const listTeamsRequest = async (): Promise<ListTeamsResponse> => {
  try {
    const res = await axiosClient.get<ListTeamsResponse>("/team")
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Unable to fetch teams")
    }
    throw new Error("Unable to fetch teams")
  }
}

const createTeamRequest = async (
  input: CreateTeamInput
): Promise<CreateTeamResponse> => {
  try {
    const res = await axiosClient.post<CreateTeamResponse>("/team", input)
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Unable to create team")
    }
    throw new Error("Unable to create team")
  }
}

const joinTeamRequest = async (
  input: JoinTeamInput
): Promise<JoinTeamResponse> => {
  try {
    const res = await axiosClient.post<JoinTeamResponse>("/team/join", input)
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Unable to join team")
    }
    throw new Error("Unable to join team")
  }
}

const searchTeamsRequest = async (
  input: SearchTeamsInput
): Promise<ListTeamsResponse> => {
  try {
    const res = await axiosClient.get<ListTeamsResponse>("/team/search", {
      params: { q: input.q },
    })
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Unable to search teams")
    }
    throw new Error("Unable to search teams")
  }
}

const requestJoinTeamRequest = async (
  input: JoinTeamInput
): Promise<JoinTeamResponse> => {
  try {
    const res = await axiosClient.post<JoinTeamResponse>(
      "/team/request-join",
      input
    )
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to request join team"
      )
    }
    throw new Error("Unable to request join team")
  }
}

export function useTeams() {
  return useQuery<ListTeamsResponse, unknown>({
    queryKey: ["team", "list"],
    queryFn: listTeamsRequest,
    staleTime: 30_000,
  })
}

export function useSearchTeams(q: string) {
  return useQuery<ListTeamsResponse, unknown>({
    queryKey: ["team", "search", q],
    queryFn: () => searchTeamsRequest({ q }),
    enabled: q.trim().length > 0,
    staleTime: 10_000,
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTeamRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", "list"] })
      queryClient.invalidateQueries({ queryKey: ["team", "search"] })
    },
  })
}

export function useJoinTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: joinTeamRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", "list"] })
    },
  })
}

export function useRequestJoinTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: requestJoinTeamRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", "search"] })
    },
  })
}
