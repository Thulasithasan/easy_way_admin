import api from "./api"

export const categoriesAPI = {
  create: (data: any) => api.post("/v1/categories/create", data),
  getById: (id: number) => api.get(`/v1/categories/get/${id}`),
  getByFilter: (params: any) => api.get("/v1/categories/get-by-filter", { params }),
  getAll: () => api.get("/v1/categories/get-all"),
  getActive: () => api.get("/v1/categories/get-active"),
  update: (id: number, data: any) => api.put(`/v1/categories/update/${id}`, data),
  changeStatus: (id: number) => api.put(`/v1/categories/change-status/${id}`),
}
