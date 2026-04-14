"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axiosClient from "@/config/axios-client"
import type { Workspace } from "@workspace/shared"

type ListWorkspacesResponse = {
  success: boolean
  workspaces: Workspace[]
}

type CreateWorkspaceInput = {
  teamId: string
  title?: string
}

type CreateWorkspaceResponse = {
  success: boolean
  workspace: Workspace
}

type UpdateWorkspaceInput = {
  title: string
}

type UpdateWorkspaceResponse = {
  success: boolean
  message: string
}

const listTeamWorkspacesRequest = async (
  teamId: string
): Promise<ListWorkspacesResponse> => {
  try {
    const res = await axiosClient.get<ListWorkspacesResponse>(
      `/workspace/team/${teamId}`
    )
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to fetch workspaces"
      )
    }
    throw new Error("Unable to fetch workspaces")
  }
}

const createWorkspaceRequest = async (
  input: CreateWorkspaceInput
): Promise<CreateWorkspaceResponse> => {
  try {
    const res = await axiosClient.post<CreateWorkspaceResponse>(
      "/workspace",
      input
    )
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to create workspace"
      )
    }
    throw new Error("Unable to create workspace")
  }
}

const getWorkspaceRequest = async (
  workspaceId: string
): Promise<{ success: boolean; workspace: Workspace }> => {
  try {
    const res = await axiosClient.get<{
      success: boolean
      workspace: Workspace
    }>(`/workspace/${workspaceId}`)
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to fetch workspace"
      )
    }
    throw new Error("Unable to fetch workspace")
  }
}

const updateWorkspaceRequest = async (
  workspaceId: string,
  input: UpdateWorkspaceInput
): Promise<UpdateWorkspaceResponse> => {
  try {
    const res = await axiosClient.patch<UpdateWorkspaceResponse>(
      `/workspace/${workspaceId}`,
      input
    )
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to update workspace"
      )
    }
    throw new Error("Unable to update workspace")
  }
}

const deleteWorkspaceRequest = async (
  workspaceId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosClient.delete<{ success: boolean; message: string }>(
      `/workspace/${workspaceId}`
    )
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to delete workspace"
      )
    }
    throw new Error("Unable to delete workspace")
  }
}

export function useTeamWorkspaces(teamId: string) {
  return useQuery<ListWorkspacesResponse, unknown>({
    queryKey: ["workspace", "team", teamId],
    queryFn: () => listTeamWorkspacesRequest(teamId),
    enabled: !!teamId,
    staleTime: 30_000,
  })
}

export function useWorkspace(workspaceId: string) {
  return useQuery<{ success: boolean; workspace: Workspace }, unknown>({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceRequest(workspaceId),
    enabled: !!workspaceId,
    staleTime: 30_000,
  })
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createWorkspaceRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", "team", data.workspace.team_id],
      })
    },
  })
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workspaceId,
      ...input
    }: { workspaceId: string } & UpdateWorkspaceInput) =>
      updateWorkspaceRequest(workspaceId, input),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] })
    },
  })
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteWorkspaceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace"] })
    },
  })
}
