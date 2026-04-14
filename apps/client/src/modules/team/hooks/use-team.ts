"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axiosClient from "@/config/axios-client"
import type { Team, TeamJoinRequestWithUser } from "@workspace/shared"

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

type ListJoinRequestsResponse = {
  success: boolean
  requests: TeamJoinRequestWithUser[]
}

type JoinRequestActionResponse = {
  success: boolean
  message: string
}

type UpdateTeamNameInput = {
  name: string
}

type DeleteTeamResponse = {
  success: boolean
  message: string
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

const listTeamJoinRequestsRequest = async (
  teamId: string
): Promise<ListJoinRequestsResponse> => {
  try {
    const res = await axiosClient.get<ListJoinRequestsResponse>(
      `/team/${teamId}/join-requests`
    )
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to fetch join requests"
      )
    }
    throw new Error("Unable to fetch join requests")
  }
}

const approveJoinRequestRequest = async (
  requestId: string
): Promise<JoinRequestActionResponse> => {
  try {
    const res = await axiosClient.patch<JoinRequestActionResponse>(
      `/team/join-request/${requestId}/approve`
    )
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to approve join request"
      )
    }
    throw new Error("Unable to approve join request")
  }
}

const rejectJoinRequestRequest = async (
  requestId: string
): Promise<JoinRequestActionResponse> => {
  try {
    const res = await axiosClient.patch<JoinRequestActionResponse>(
      `/team/join-request/${requestId}/reject`
    )
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to reject join request"
      )
    }
    throw new Error("Unable to reject join request")
  }
}

const updateTeamNameRequest = async (
  teamId: string,
  input: UpdateTeamNameInput
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosClient.patch<{ success: boolean; message: string }>(
      `/team/${teamId}`,
      input
    )
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to update team name"
      )
    }
    throw new Error("Unable to update team name")
  }
}

const deleteTeamRequest = async (
  teamId: string
): Promise<DeleteTeamResponse> => {
  try {
    const res = await axiosClient.delete<DeleteTeamResponse>(`/team/${teamId}`)
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Unable to delete team")
    }
    throw new Error("Unable to delete team")
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

export function useTeamJoinRequests(teamId: string) {
  return useQuery<ListJoinRequestsResponse, unknown>({
    queryKey: ["team", "join-requests", teamId],
    queryFn: () => listTeamJoinRequestsRequest(teamId),
    enabled: !!teamId,
    staleTime: 30_000,
  })
}

export function useApproveJoinRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: approveJoinRequestRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", "join-requests"] })
      queryClient.invalidateQueries({ queryKey: ["team", "list"] })
    },
  })
}

export function useRejectJoinRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectJoinRequestRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", "join-requests"] })
    },
  })
}

export function useUpdateTeamName() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      teamId,
      ...input
    }: { teamId: string } & UpdateTeamNameInput) =>
      updateTeamNameRequest(teamId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", "list"] })
    },
  })
}

export function useDeleteTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTeamRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", "list"] })
    },
  })
}
