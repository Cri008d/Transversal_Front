import axios from "axios";

// Creamos la instancia de Axios
const api = axios.create({
    // URL base de tu backend
    baseURL: "http://localhost:8080/api/v1", 
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000, // Tiempo máximo de espera para la solicitud
});

// Interceptor de Solicitudes: Adjunta el token JWT a cada petición
api.interceptors.request.use(
    config => {
        // Recuperamos el token de autenticación del almacenamiento local
        const token = localStorage.getItem('token'); 

        // Si el token existe, lo adjuntamos al encabezado Authorization
        if (token) {
            // Se usa el formato 'Bearer [token]' para autenticación JWT
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    error => {
        // Manejar errores de configuración o de red
        console.error("Error en el interceptor de solicitud:", error);
        return Promise.reject(error);
    }
);

// Exportamos la instancia configurada para ser usada por todos los servicios
export default api;