// Mirrors users table (excluding password).
export type User = {
  id: string
  name: string
  email: string
  is_premium: boolean
  created_at: string
}
