import axios from "axios"

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(
  /(^["']|["']$)/g,
  ""
)
const baseURL = serverUrl
  ? `${serverUrl}/api/v1`
  : "http://localhost:3001/api/v1"

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export default axiosClient
