import api from './axiosConfig'; 

const PRODUCTOS_ENDPOINT = '/productos'; 

//  Obtener Todos (GET)
export const obtenerTodosLosProductos = async () => {
  try {
    const response = await api.get(PRODUCTOS_ENDPOINT); 
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    throw error; 
  }
};

// Obtener por ID (GET)
export const obtenerProductoPorId = async (id) => {
  try {
    const response = await api.get(`${PRODUCTOS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error);
    throw error;
  }
};

// 5. Eliminar (DELETE)
export const eliminarProducto = async (id) => {
  try {
    await api.delete(`${PRODUCTOS_ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el producto con ID ${id}:`, error);
    throw error;
  }
};
// Guardar/Crear (POST) 
export const guardarProducto = async (producto) => {
  try {
    const response = await api.post(PRODUCTOS_ENDPOINT, producto); 
    return response.data;
  } catch (error) {
    console.error('Error al guardar el producto (JSON):', error);
    throw error;
  }
};

// Actualizar (PUT)
export const actualizarProducto = async (id, producto) => {
  try {
    const response = await api.put(`${PRODUCTOS_ENDPOINT}/${id}`, producto);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el producto (JSON) con ID ${id}:`, error);
    throw error;
  }
};

export const guardarProductoConImagen = async (productoData, archivoImagen) => {
  const formData = new FormData();
  formData.append('file', archivoImagen); 
  formData.append('producto', JSON.stringify(productoData)); 

  try {
  
    const response = await api.post(`${PRODUCTOS_ENDPOINT}/con-imagen`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data' 
        }
    }); 
    return response.data;
  } catch (error) {
    console.error('Error al guardar el producto con imagen:', error);
    throw error;
  }
};

export const actualizarProductoConImagen = async (id, productoData, archivoImagen) => {
    const formData = new FormData();
    formData.append('file', archivoImagen);
    formData.append('producto', JSON.stringify(productoData));

    try {
        const response = await api.put(`${PRODUCTOS_ENDPOINT}/${id}/con-imagen`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }
        }); 
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el producto con imagen y ID ${id}:`, error);
        throw error;
    }
};

const productoService = {
    getAll: obtenerTodosLosProductos,
    getById: obtenerProductoPorId,
    create: guardarProducto,
    update: actualizarProducto,
    delete: eliminarProducto,
    createWithImage: guardarProductoConImagen,
    updateWithImage: actualizarProductoConImagen
};

export default productoService;
