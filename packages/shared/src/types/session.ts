import type { User } from "./user"

export type Session = {
  user: User
  refreshToken?: string
  [key: string]: unknown
}
