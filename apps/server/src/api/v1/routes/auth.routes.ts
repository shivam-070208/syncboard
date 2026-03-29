import { Router } from "express"
import { signup, login, refresh, logout } from "@v1/controllers/auth.controller"
import { tryCatch } from "@/utils/try-catch"

const authRouter: Router = Router()

authRouter.post("/signup", tryCatch(signup))
authRouter.post("/login", tryCatch(login))
authRouter.post("/refresh", tryCatch(refresh))
authRouter.post("/logout", tryCatch(logout))

export default authRouter
