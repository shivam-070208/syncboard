import { redisClient } from "@/config/redis"

export async function setSession(
  userId: string,
  session: Record<string, unknown>,
  expirySeconds = 60 * 60 * 24 * 7
) {
  await redisClient.set(
    `session:${userId}`,
    JSON.stringify(session),
    "EX",
    expirySeconds
  )
}

export async function getSession(
  userId: string
): Promise<Record<string, unknown> | null> {
  const sessionStr = await redisClient.get(`session:${userId}`)
  if (!sessionStr) return null
  return JSON.parse(sessionStr)
}

export async function deleteSession(userId: string): Promise<void> {
  await redisClient.del(`session:${userId}`)
}
