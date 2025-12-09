import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import productoService from '../../service/productoService'; 
import categoriaService from '../../service/categoriaService'; 
import { generarMensaje } from '../../utils/GenerarMensaje';

const initialProductState = {
    idProducto: null,
    nombreProducto: '',
    descripcionProducto: '',
    precioProducto: 0,
    stock: 0,
    urlImagen: '',
    categoriaId: '', 
};

export default function ProductManagement() {

    // 1. ESTADOS
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(initialProductState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // 2. EFECTOS Y CARGA INICIAL
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                productoService.getAll(),
                categoriaService.getAll() 
            ]);
            setProductos(prodRes.data);
            setCategorias(catRes.data);
        } catch (error) {
            generarMensaje('Error al cargar datos de productos y categorías.', 'danger');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
 
    // 3. HANDLERS BÁSICOS
    // Handler para cerrar el modal y resetear el estado
    const handleClose = () => {
        setShowModal(false);
        setCurrentProduct(initialProductState);
    };

    // Handler para abrir el modal (mapea la categoría anidada a un ID simple)
    const handleShow = (product = initialProductState) => {
        if (product.idProducto) {
            setCurrentProduct({
                ...product,
                // Mapear el objeto anidado a un ID simple para el select
                categoriaId: product.categoriaCategoria?.idCategoria || '',
            });
        } else {
            setCurrentProduct(initialProductState);
        }
        setShowModal(true);
    };

    // Handler genérico para cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({ ...prev, [name]: value }));
    };
   
    // 4. CRUD: GUARDAR (CREAR/EDITAR)
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // CONSTRUCCIÓN DEL PAYLOAD (CLAVE: categoriaCategoria anidada)
        const payload = {
            idProducto: currentProduct.idProducto,
            nombreProducto: currentProduct.nombreProducto,
            descripcionProducto: currentProduct.descripcionProducto,
            // Convertir a número float/int para asegurar el tipo de dato del backend
            precioProducto: parseFloat(currentProduct.precioProducto),
            stock: parseInt(currentProduct.stock),
            urlImagen: currentProduct.urlImagen,
            // OBJETO ANIDADO: CategoriaCategoria
            categoriaCategoria: {
                idCategoria: currentProduct.categoriaId
            }
        };

        try {
            if (currentProduct.idProducto) {
                
                await productoService.update(currentProduct.idProducto, payload);
                generarMensaje('Producto actualizado con éxito.', 'success');
            } else {
                await productoService.create(payload);
                generarMensaje('Producto creado con éxito.', 'success');
            }
            handleClose(); 
            await fetchAllData(); 
        } catch (error) {
            generarMensaje('Error al guardar el producto. Verifica los datos.', 'danger');
            console.error("Error al guardar producto:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    // 5. CRUD: ELIMINAR
    const handleDelete = async (id) => {
        if (!window.confirm("¿Está seguro de que desea eliminar este producto? Esta acción es irreversible.")) {
            return;
        }

        try {
            await productoService.remove(id); 
            generarMensaje('Producto eliminado con éxito.', 'success');
            await fetchAllData(); // Recargar datos
        } catch (error) {
            generarMensaje('Error al eliminar el producto.', 'danger');
            console.error("Error al eliminar producto:", error);
        }
    };


    if (loading) return <Container className="my-5 text-center"><Spinner animation="border" variant="primary" /></Container>;

    // 6. RENDERIZADO (JSX)
    return (
        <Container className="my-5">
            <h1 className="mb-4">Gestión de Productos 📦</h1>
            <Button onClick={() => handleShow()} variant="success" className="mb-3">Añadir Nuevo Producto</Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(p => (
                        <tr key={p.idProducto}>
                            <td>{p.idProducto}</td>
                            <td>{p.nombreProducto}</td>
                            <td>${p.precioProducto.toLocaleString('es-CL')}</td>
                            <td>
                                <Alert 
                                    variant={p.stock <= 5 ? 'danger' : p.stock <= 10 ? 'warning' : 'success'} 
                                    className="p-1 mb-0 text-center"
                                >
                                    {p.stock}
                                </Alert>
                            </td>
                            <td>{p.categoriaCategoria?.nomCategoria || 'N/A'}</td> 
                            <td>
                                <Button size="sm" variant="warning" onClick={() => handleShow(p)} className="me-2">Editar</Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(p.idProducto)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton><Modal.Title>{currentProduct.idProducto ? 'Editar Producto' : 'Crear Producto'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave}>
                        {/* 1. Nombre */}
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" name="nombreProducto" value={currentProduct.nombreProducto} onChange={handleChange} required />
                        </Form.Group>
                        {/* 2. Descripción */}
                         <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} name="descripcionProducto" value={currentProduct.descripcionProducto} onChange={handleChange} required />
                        </Form.Group>
                        {/* 3. Precio y Stock (en la misma fila) */}
                        <Form.Group className="mb-3 d-flex gap-3">
                            <div className="w-50">
                                <Form.Label>Precio ($)</Form.Label>
                                <Form.Control type="number" name="precioProducto" value={currentProduct.precioProducto} onChange={handleChange} required min="1" />
                            </div>
                             <div className="w-50">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type="number" name="stock" value={currentProduct.stock} onChange={handleChange} required min="0" />
                            </div>
                        </Form.Group>
                        {/* 4. Categoría (Select) */}
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select name="categoriaId" value={currentProduct.categoriaId} onChange={handleChange} required>
                                <option value="">Selecciona una Categoría</option>
                                {categorias.map(c => (
                                    <option key={c.idCategoria} value={c.idCategoria}>
                                        {c.nomCategoria}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        {/* 5. URL Imagen */}
                         <Form.Group className="mb-3">
                            <Form.Label>URL Imagen (Temporal)</Form.Label>
                            <Form.Control type="text" name="urlImagen" value={currentProduct.urlImagen} onChange={handleChange} placeholder="Ej: https://via.placeholder.com/300" />
                        </Form.Group>
                        
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner size="sm" className="me-2" /> : 'Guardar Cambios'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}