import api from "../api/axiosConfig";

const BASE_URL = "/venta";

export default {
    getAll: () => api.get(BASE_URL),
    getById: (id) => api.get(`${BASE_URL}/${id}`),
    create: (data) => api.post(BASE_URL, data),
    updateEstado: (id, data) => api.patch(`${BASE_URL}/${id}/estado`, data),
};