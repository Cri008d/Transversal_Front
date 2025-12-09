import api from './axiosConfig';

 const DASHBOARD_ENDPOINT = '/Admin';

 export const getDashboardStats = async () => {
    try {
        const response = await api.get(`${DASHBOARD_ENDPOINT}/dashboard-stats`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard: ', error);
        return {
            totalVentas: 0,
            pedidosPendientes: 0,
            productosBajoStock: 0,
            nuevosUsuariosHoy: 0
        };

    }
 };