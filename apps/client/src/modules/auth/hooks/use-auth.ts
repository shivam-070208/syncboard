import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosClient from "@/config/axios-client"
import { AxiosError } from "axios"
import type { User, Session } from "@workspace/shared"

export type SignupInput = {
  name: string
  email: string
  password: string
}

export type SignupResponse = {
  success: boolean
  user: User
}

export type LoginInput = {
  email: string
  password: string
}

export type LoginResponse = {
  success: boolean
  accessToken: string
  user: User
}

export type RefreshResponse = {
  success: boolean
  accessToken: string
}

export type LogoutResponse = {
  success: boolean
  message: string
}

export type SessionResponse = {
  success: boolean
  user: User
  session: Session
}

const signupRequest = async (input: SignupInput): Promise<SignupResponse> => {
  try {
    const res = await axiosClient.post<SignupResponse>("/auth/signup", input)
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Something went wrong")
    }
    throw new Error("Something went wrong")
  }
}

const loginRequest = async (input: LoginInput): Promise<LoginResponse> => {
  try {
    const res = await axiosClient.post<LoginResponse>("/auth/login", input)
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Something went wrong")
    }
    throw new Error("Something went wrong")
  }
}

const refreshRequest = async (): Promise<RefreshResponse> => {
  try {
    const res = await axiosClient.post<RefreshResponse>("/auth/refresh")
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Something went wrong")
    }
    throw new Error("Something went wrong")
  }
}

const logoutRequest = async (): Promise<LogoutResponse> => {
  try {
    const res = await axiosClient.post<LogoutResponse>("/auth/logout")
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Something went wrong")
    }
    throw new Error("Something went wrong")
  }
}

const sessionRequest = async (): Promise<SessionResponse> => {
  try {
    const res = await axiosClient.get<SessionResponse>("/auth/session")
    return res.data
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Something went wrong")
    }
    throw new Error("Something went wrong")
  }
}

export function useSignup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: signupRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] })
    },
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] })
    },
  })
}

export function useRefresh() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: refreshRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] })
    },
  })
}

export function useSession(options?: { enabled?: boolean }) {
  return useQuery<SessionResponse, unknown>({
    queryKey: ["auth", "session"],
    queryFn: sessionRequest,
    staleTime: 60_000,
    retry: false,
    ...options,
  })
}
