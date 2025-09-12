// import axios from "axios"

// // const API_BASE_URL = "https://easy-way-be.thulasi-web.space"
// const API_BASE_URL = "http://localhost:8080"

// // Create axios instance with default config
// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("auth_token")
//     if (token) {
//       console.log("token", token);
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("auth_token")
//       window.location.href = "/auth/sign-in"
//     }
//     return Promise.reject(error)
//   },
// )

// // API endpoints
// export const authAPI = {
//   signUp: (data: any) => api.post("/v1/auth/sign-up", data),
//   signIn: (data: any) => api.post("/v1/auth/sign-in", data),
// }

// export const categoriesAPI = {
//   create: (data: any) => api.post("/v1/categories/create", data),
//   getById: (id: string) => api.get(`/v1/categories/get/${id}`),
//   getByFilter: (params: any) => api.get("/v1/categories/get-by-filter", { params }),
//   getAll: () => api.get("/v1/categories/get-all"),
//   update: (id: string, data: any) => api.put(`/v1/categories/update/${id}`, data),
//   changeStatus: (id: number) => api.put(`/v1/categories/change-status/${id}`),
// }

// export const subCategoriesAPI = {
//   create: (data: any) => api.post("/v1/sub-categories/create", data),
//   getById: (id: string) => api.get(`/v1/sub-categories/get/${id}`),
//   getByFilter: (params: any) => api.get("/v1/sub-categories/get-by-filter", { params }),
//   getAll: () => api.get("/v1/sub-categories/get-all"),
// }

// export const productsAPI = {
//   create: (data: any) => api.post("/v1/products/create", data),
//   getById: (id: string) => api.get(`/v1/products/get/${id}`),
//   filter: (params: any) => api.get("/v1/products/filter", { params }),
//   uploadImages: (id: string, data: FormData) => api.put(`/v1/products/${id}/images`, data),
//   deleteImages: (id: string) => api.delete(`/v1/products/${id}/images`),
// }

// export const stockAPI = {
//   getHomeProducts: () => api.get("/v1/stocks/home-products"),
//   getProductInfo: (productId: string) => api.get(`/v1/stocks/home-product-info/${productId}`),
//   filter: (params: any) => api.get("/v1/stocks/filter", { params }),
// }

// export const ordersAPI = {
//   create: (data: any) => api.post("/v1/sales-orders/create", data),
// }


import axios from "axios"

// const API_BASE_URL = "http://localhost:8080"
const API_BASE_URL = "https://easy-way-be.thulasi-web.space"

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor (auth token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor (error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token")
      window.location.href = "/auth/sign-in"
    }
    return Promise.reject(error)
  },
)
