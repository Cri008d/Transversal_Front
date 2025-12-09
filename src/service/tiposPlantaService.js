import api from "../api/axiosConfig";

const BASE_URL = "/tiposPlanta";

export default {
    getAll: () => api.get(BASE_URL),
};