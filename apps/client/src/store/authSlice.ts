import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@workspace/shared"

export type AuthState = {
  user: User | null
  accessToken: string | null
  status: "idle" | "authenticated" | "unauthenticated"
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "idle",
}

export type CredentialsPayload = {
  user: User
  accessToken: string
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state: AuthState,
      action: PayloadAction<CredentialsPayload>
    ) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.status = "authenticated"
    },
    clearCredentials(state: AuthState) {
      state.user = null
      state.accessToken = null
      state.status = "unauthenticated"
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
