import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'; // Usamos Bootstrap nativo para la estructura
import CardsDisplay from '../components/organisms/CardsDisplay';
import { useCartContext } from '../context/CartContext'; 
import productoService from '../service/productoService'; 
import { generarMensaje } from '../utils/GenerarMensaje';

function UserHome() { 
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCartContext(); 

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const response = await productoService.getAll(); 
                
                // Mapeamos asegurando que la imagen tenga un fallback si viene vacía
                const mappedProducts = response.data.map(p => ({
                    ...p, // Mantenemos todas las propiedades originales
                    id: p.idProducto, 
                    title: p.nombreProducto,
                    image: p.urlImagen && p.urlImagen !== "" ? p.urlImagen : 'https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=300&auto=format&fit=crop', 
                    price: p.precioProducto,
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
        <div className="min-vh-100">
            {/* --- HERO SECTION (BANNER) --- */}
            <div className="bg-success text-white py-5 mb-5" style={{ 
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1920&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '0 0 50px 50px' // Borde redondeado abajo
            }}>
                <Container className="text-center py-5">
                    <h1 className="display-3 fw-bold mb-3">Bienvenido a Plantita 🌱</h1>
                    <p className="lead mb-4">Descubre la naturaleza y dale vida a tu hogar con nuestra selección premium.</p>
                </Container>
            </div>

            {/* --- SECCIÓN DE PRODUCTOS --- */}
            <Container className="mb-5">
                <h2 className="text-center mb-4 text-success fw-bold">Nuestros Productos Destacados</h2>
                <p className="text-center text-muted mb-5">Encuentra la planta perfecta para ti</p>
                
                {productos.length === 0 ? (
                   <Alert variant="warning" className="text-center">No hay productos disponibles en este momento.</Alert>
                ) : (
                    <CardsDisplay items={productos} />
                )}
            </Container>
        </div>
    );
}

export default UserHome;