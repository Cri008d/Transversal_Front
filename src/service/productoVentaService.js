import api from "../api/axiosConfig";

const BASE_URL = "/productoVenta";

export default {
    getAll: () => api.get(BASE_URL),
    getById: (id) => api.get(`${BASE_URL}/${id}`),
    create: (data) => api.post(BASE_URL, data),
    update: (id, data) => api.put(`${BASE_URL}/${id}`, data),
    remove: (id) => api.delete(`${BASE_URL}/${id}`),
};