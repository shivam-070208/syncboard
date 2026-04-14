import type { Server as SocketIOServer } from "socket.io"
import { redisClient } from "@/config/redis"
import { SocketEvents } from "@workspace/shared"

export function initWorkspaceRedisFanout(io: SocketIOServer): void {
  const sub = redisClient.duplicate()
  sub.on("error", (err: Error) => {
    console.error("Redis subscriber error", err)
  })
  sub.psubscribe("workspace:*:collab", (err) => {
    if (err) console.error("redis psubscribe workspace collab", err)
  })
  sub.psubscribe("workspace:*:presence", (err) => {
    if (err) console.error("redis psubscribe workspace presence", err)
  })
  sub.on("pmessage", (_pattern, channel, message) => {
    const parts = channel.split(":")
    const workspaceId = parts[1]
    if (!workspaceId) return
    try {
      const data = JSON.parse(message) as Record<string, unknown>
      if (channel.endsWith(":collab")) {
        io.to(`workspace:${workspaceId}`).emit(SocketEvents.REMOTE_SYNC, data)
        return
      }
      if (channel.endsWith(":presence")) {
        io.to(`workspace:${workspaceId}`).emit(
          SocketEvents.REMOTE_CURSOR_UPDATE,
          data
        )
      }
    } catch {
      return
    }
  })
}
