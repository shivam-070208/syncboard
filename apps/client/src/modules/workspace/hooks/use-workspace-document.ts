"use client"

import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axiosClient from "@/config/axios-client"

export type WorkspaceDocumentDto = {
  workspace_id: string
  editor_data: unknown
  canvas_data: unknown
  updated_at: string
}

type DocumentResponse = {
  success: boolean
  document: WorkspaceDocumentDto
}

const fetchWorkspaceDocument = async (
  workspaceId: string
): Promise<DocumentResponse> => {
  try {
    const res = await axiosClient.get<DocumentResponse>(
      `/workspace/${workspaceId}/document`
    )
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(
        err.response?.data?.message || "Unable to load workspace document"
      )
    }
    throw new Error("Unable to load workspace document")
  }
}

export function useWorkspaceDocument(workspaceId: string, enabled: boolean) {
  return useQuery<DocumentResponse, unknown>({
    queryKey: ["workspace", workspaceId, "document"],
    queryFn: () => fetchWorkspaceDocument(workspaceId),
    enabled: !!workspaceId && enabled,
    staleTime: 15_000,
  })
}
