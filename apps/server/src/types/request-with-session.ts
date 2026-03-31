import { Session } from "@workspace/shared"
import { Request } from "express"

export interface RequestWithSession extends Request {
  session: Session
}
