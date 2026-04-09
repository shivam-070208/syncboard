import Redis from "ioredis"

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

export function createBullConnection(): Redis {
  return new Redis(redisUrl, { maxRetriesPerRequest: null })
}
