import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import CardsDisplay from '../components/organisms/CardsDisplay';
import { useCartContext } from '../context/CartContext'; 
import productoService from '../service/productoService'; 

export default function Producto() { 
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCartContext(); 

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                // 1. Usamos la función correcta del servicio
                const response = await productoService.getAll(); 
                
                // 2. Mapeamos los datos para asegurar que las imágenes y precios se vean bien
                const mappedProducts = response.data.map(p => ({
                    id: p.idProducto, 
                    title: p.nombreProducto,
                    // Si no trae imagen, ponemos una por defecto
                    image: p.urlImagen && p.urlImagen !== "" ? p.urlImagen : 'https://via.placeholder.com/400x300?text=Planta', 
                    price: p.precioProducto,
                    stock: p.stock,
                    description: p.descripcionProducto
                }));
                
                setProductos(mappedProducts);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="success" /></div>;

    return (
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#fff' }}>
            <Container>
                {/* Título de la sección */}
                <h2 className="text-center mb-5 fw-bold" style={{ color: '#2c5530' }}>
                    Catálogo Completo
                    {/* Línea decorativa verde */}
                    <div style={{ width: '60px', height: '4px', background: '#3a7d44', margin: '15px auto 0' }}></div>
                </h2>
                
                {/* Muestra los productos o un aviso si está vacío */}
                {productos.length === 0 ? (
                   <Alert variant="warning" className="text-center">No hay productos disponibles en este momento.</Alert>
                ) : (
                    <CardsDisplay items={productos} />
                )}
            </Container>
        </div>
    );
}