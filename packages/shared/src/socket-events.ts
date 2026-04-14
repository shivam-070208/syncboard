export enum SocketEvents {
  CONNECTION = "connection",
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  JOIN = "workspace:join",
  LEAVE = "workspace:leave",
  SYNC = "workspace:sync",
  REMOTE_SYNC = "workspace:remote-sync",
  CURSOR_UPDATE = "workspace:cursor-update",
  REMOTE_CURSOR_UPDATE = "workspace:remote-cursor-update",
}
