import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import CardsDisplay from '../components/organisms/CardsDisplay';
import { useCartContext } from '../context/CartContext'; 
import productoService from '../service/productoService'; 


function UserHome() { 
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCartContext(); 

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const response = await productoService.getAll(); 
                
                const mappedProducts = response.data.map(p => ({
                    ...p,
                    id: p.idProducto, 
                    title: p.nombreProducto,
                    // Usamos una imagen de placeholder si no hay URL
                    image: p.urlImagen && p.urlImagen !== "" ? p.urlImagen : 'https://via.placeholder.com/400x300?text=Planta', 
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
        <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            {/* --- HERO BANNER --- */}
            <div style={{ 
                // Imagen de fondo oscura de plantas
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                padding: '150px 0 100px', // Espacio interno
                textAlign: 'center',
                // Bordes redondeados abajo, pero menos que el navbar para crear el efecto
                borderBottomLeftRadius: '50px',
                borderBottomRightRadius: '50px',
                marginTop: '-30px', // Hacemos que suba para quedar debajo del navbar
                paddingTop: '180px' // Compensamos el margen negativo
            }}>
                <Container>
                    <h1 className="display-3 fw-bold mb-3">Bienvenido a Plantita 🍃</h1>
                    <p className="lead fs-4">Descubre la naturaleza y dale vida a tu hogar con nuestra selección premium.</p>
                </Container>
            </div>

            {/* --- SECCIÓN DE PRODUCTOS --- */}
            <Container className="py-5">
                <h2 className="text-center mb-5 fw-bold" style={{ color: '#333' }}>Nuestros Productos Destacados</h2>
                
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