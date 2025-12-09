import api from './axiosConfig'; 
import { generarMensaje } from '../utils/GenerarMensaje'; 

const AUTH_ENDPOINT = '/auth'; 

/**
 * Llama al endpoint de login del backend.
 * @param {object} credentials - Contiene las credenciales del usuario ({ username, password }).
 * @returns {object} El objeto de usuario con token y rol.
 */
export const login = async (credentials) => {
    try {
        const response = await api.post(`${AUTH_ENDPOINT}/login`, credentials); 
        return response.data; 
    } catch (error) {
        console.error('Error de login:', error);
        generarMensaje('Credenciales inválidas. Inténtalo de nuevo.', 'danger');
        throw error;
    }
};

/**
 * Llama al endpoint de registro del backend.
 * @param {object} userData - Objeto con los datos del nuevo usuario ({ username, password, name, etc. }).
 * @returns {object} La respuesta del usuario creado.
 */
export const register = async (userData) => {
    try {
        const response = await api.post(`${AUTH_ENDPOINT}/register`, userData); 
        return response.data;
    } catch (error) {
        console.error('Error de registro:', error);
        generarMensaje('Error al crear cuenta. El email podría estar en uso.', 'danger');
        throw error;
    }
};

/**
 * Llama al endpoint de logout/revocación de token del backend.
 * Nota: El backend puede no requerir un endpoint de logout si solo usa JWT sin lista negra.
 */
export const logout = async () => {
    try {
        // Asume que el endpoint de logout es /api/v1/auth/logout y no requiere cuerpo (body).
        // El token se envía automáticamente en los headers por axiosConfig.
        await api.post(`${AUTH_ENDPOINT}/logout`);
    } catch (error) {
        // En caso de fallo, generalmente se permite continuar el logout en el frontend,
        // ya que la remoción local de tokens es lo más importante.
        console.warn('Advertencia: El logout en el backend falló, pero se continuará el proceso local.', error);
    }
};