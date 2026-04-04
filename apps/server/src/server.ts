import "dotenv/config"
import express from "express"
import http from "http"
import { Server as SocketIOServer } from "socket.io"
import cors from "cors"
import cookieParser from "cookie-parser"
import { authRouter, teamRouter, workspaceRouter } from "@v1/routes"
import morgan from "morgan"

const app = express()
const server = http.createServer(app)

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"]

app.use(morgan("dev"))
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/team", teamRouter)
app.use("/api/v1/workspace", workspaceRouter)
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})

io.on("connection", (socket) => {
  console.log("A user connected via WebSocket:", socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

app.get("/", (req, res) => {
  res.send("Hello from Express!")
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
