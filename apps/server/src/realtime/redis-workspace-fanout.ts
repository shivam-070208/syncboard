import type { Server as SocketIOServer } from "socket.io"
import { redisClient } from "@/config/redis"

export function initWorkspaceRedisFanout(io: SocketIOServer): void {
  const sub = redisClient.duplicate()
  sub.on("error", (err: Error) => {
    console.error("Redis subscriber error", err)
  })
  sub.psubscribe("workspace:*:collab", (err) => {
    if (err) console.error("redis psubscribe workspace collab", err)
  })
  sub.on("pmessage", (_pattern, channel, message) => {
    const parts = channel.split(":")
    const workspaceId = parts[1]
    if (!workspaceId) return
    try {
      const data = JSON.parse(message) as Record<string, unknown>
      io.to(`workspace:${workspaceId}`).emit("workspace:remote-sync", data)
    } catch {
      return
    }
  })
}
