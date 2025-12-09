import React, { useState, useEffect } from 'react';
import Section from '../components/templates/Section';
import Text from '../components/atoms/Text';
import { useCart } from '../components/organisms/CartContext'; 
import productoService from '../service/productoService'; // Usamos el servicio
import { generarMensaje } from '../utils/GenerarMensaje';

function UserHome() { 
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart(); 

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                // Usamos el servicio para obtener la data real
                const response = await productoService.getAll(); 
                
                // Mapeo crucial: Adaptar la data del backend al formato de las Card
                const mappedProducts = response.data.map(p => ({
                    // Claves del Backend: idProducto, nombreProducto, precioProducto
                    id: p.idProducto, 
                    title: p.nombreProducto,
                    image: p.urlImagen || 'https://via.placeholder.com/300?text=Planta', 
                    price: p.precioProducto,
                    stock: p.stock,
                    // Función para añadir al carrito, pasa el objeto completo
                    onAddToCart: () => handleAddToCart(p),
                    onViewDetails: `/productos/${p.idProducto}` 
                }));
                
                setProductos(mappedProducts);
            } catch (error) {
                generarMensaje('No se pudo cargar el catálogo de productos.', 'danger');
                console.error("Error al cargar productos:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const handleAddToCart = (producto) => {
        // La función espera el objeto producto completo para el contexto
        addToCart(producto, 1); 
        generarMensaje(`¡Añadido ${producto.nombreProducto} al carrito!`, 'success');
    };

    const qienesSomosContent = {
        type: "text",
        text: [
            { content: "🌱 Bienvenido a Plantita", variant: "h1", className: "text-5xl font-bold mb-4 text-center text-green-700" },
            { contente: "¿Quiénes Somos?", variant: "h2", className: "text-3xl font-medium mt-8 mb-3 border-b pb-2 text-gray-800" },
            {
                content: (
                    <>
                        <p className="mb-3">
                            🌱 Somos una empresa dedicada a ofrecer productos frescos y de calidad. Nuestro objetivo es acercar lo mejor de la 
                            naturaleza a tu mesa. Contamos con un equipo apasionado por la alimentación saludable y trabajamos día a día para que
                            nuestros clientes tengan la mejor experiencia.
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Plantita - Tu espacio para disfrutar y cuidar tus plantas. Encuentra productos frescos, tips y novedades en nuestro blog.
                            Síguenos y mantente conectado. © 2025 Plantita. Todos los derechos reservados.
                        </p>
                    </>
                ),
                variant:"p",
                className: "text-lg text-gray-600"
            }
        ]
    };

    const content = [
        {
            type: "text",
            text: [{ content: "Catálogo de Plantitas y Productos", variant: "h1", className: "text-3xl font-light mb-6 text-center" }]
        },
        {
            type: "cards", 
            cards: productos
        }
    ];

    if (loading) {
        return <div className="text-center p-10"><Text>Cargando catálogo...</Text></div>;
    }

    if (productos.length === 0) {
        return <div className="text-center p-10"><Text className="text-xl text-red-500">No hay productos disponibles.</Text></div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <Section content={content} className="container mx-auto p-4" />
        </div>
    );
}

export default UserHome;