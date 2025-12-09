import api from "./axiosConfig";

const BASE_URL = "/imagenes";

export default {
    upload: (data) => api.post(`${BASE_URL}/upload`, data),
    delete: (id) => api.delete(`${BASE_URL}/${id}`),
    getAll: () => api.get(BASE_URL),
};