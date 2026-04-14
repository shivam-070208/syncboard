import { redisClient } from "@/config/redis"
import type { Session } from "@workspace/shared"

export async function setSession(
  userId: string,
  session: Session,
  expirySeconds = 60 * 60 * 24 * 7
) {
  await redisClient.set(
    `session:${userId}`,
    JSON.stringify(session),
    "EX",
    expirySeconds
  )
}

export async function getSession(userId: string): Promise<Session | null> {
  const sessionStr = await redisClient.get(`session:${userId}`)
  if (!sessionStr) return null
  try {
    return JSON.parse(sessionStr) as Session
  } catch {
    return null
  }
}

export async function deleteSession(userId: string): Promise<void> {
  await redisClient.del(`session:${userId}`)
}
