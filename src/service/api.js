import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

//Interceptor para autenticacion
api.interceptors.request.use(
    config => {
        //recupera el token
        const token = localStorage.getItem('token');
        //si el token existe, lo adjuntamos al encabezado 'Authorization'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, 
    error => {
        //maneja errorres de solicitud
        return Promise.reject(error);
    }
    
    
);

export default api;