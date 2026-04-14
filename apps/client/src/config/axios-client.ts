import axios from "axios"

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(
  /(^["']|["']$)/g,
  ""
)
export const baseURL = serverUrl
  ? `${serverUrl}/api/v1`
  : "http://localhost:3001/api/v1"

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as {
      _retry?: boolean
      url?: string
      [key: string]: unknown
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/signup") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true
      try {
        await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        return axiosClient(originalRequest)
      } catch {}
    }

    return Promise.reject(error)
  }
)

export default axiosClient
