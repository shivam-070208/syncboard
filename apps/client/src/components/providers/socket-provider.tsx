"use client"

import { getCollaborationSocketUrl } from "@/lib/socket-url"
import { useSession } from "@/modules/auth/hooks/use-auth"
import { SocketEvents } from "@workspace/shared"
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { io, Socket } from "socket.io-client"

interface ISocketContext {
  socket: React.RefObject<Socket | null>
  connected: boolean
}

const SocketContext = createContext<ISocketContext>({
  socket: { current: null },
  connected: false,
})

type UseSocketValuesResult = {
  socket: Socket | null
  connected: boolean
}

export const useSocket = (): UseSocketValuesResult => {
  const values = useContext(SocketContext)
  if (!values) {
    throw new Error("useSocketValues must be used within a SocketProvider")
  }
  return {
    socket: values.socket.current,
    connected: values.connected,
  }
}

interface SocketProviderProps {
  children: React.ReactNode
}

const SOCKET_URL = getCollaborationSocketUrl()

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const { data, isPending } = useSession()
  useEffect(() => {
    if (!SOCKET_URL || socketRef.current || isPending || !data?.session?.user) {
      return
    }

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    })

    socketRef.current = socket

    socket.on(SocketEvents.CONNECT, () => setConnected(true))
    socket.on(SocketEvents.DISCONNECT, () => setConnected(false))

    return () => {
      socket.off(SocketEvents.CONNECT)
      socket.off(SocketEvents.DISCONNECT)
      socket.disconnect()
    }
  }, [data, isPending])

  const value = useMemo(
    () => ({
      socket: socketRef,
      connected,
    }),
    [connected]
  )

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}
