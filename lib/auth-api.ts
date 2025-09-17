import { ref } from "process"
import api from "./api"

export const authAPI = {
  signUp: (data: any) => api.post("/v1/auth/sign-up", data),
  signIn: (data: any) => api.post("/v1/auth/sign-in", data),
  refreshToken: (data: any) => api.post("/v1/auth/refresh-token", data),
}
