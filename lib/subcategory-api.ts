import api from "./api"

export const subcategoriesAPI = {
  create: (data: any) => api.post("/v1/sub-categories/create", data),
  getById: (id: number) => api.get(`/v1/sub-categories/get/${id}`),
  getByFilter: (params: any) => api.get("/v1/sub-categories/get-by-filter", { params }),
  getAll: () => api.get("/v1/sub-categories/get-all"),
  update: (id: number, data: any) => api.put(`/v1/sub-categories/update/${id}`, data),
  changeStatus: (id: number) => api.put(`/v1/sub-categories/change-status/${id}`),
}
