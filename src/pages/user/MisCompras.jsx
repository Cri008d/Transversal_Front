import React, { useEffect, useState } from "react";
import { Container, Card, Badge, Spinner, Alert, ListGroup, Row, Col } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext"; 
import ventaService from "../../service/ventaService"; // Usamos el servicio de Venta
import { generarMensaje } from "../../utils/GenerarMensaje"; 
import { format } from 'date-fns'; 

// ... (Función getStatusVariant y resto de imports omitidos por brevedad)

export default function MisCompras() {

    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth(); 

    useEffect(() => {
        if (!authLoading && user && user.idUsuario) { 
            fetchUserCompras(user.idUsuario);
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const fetchUserCompras = async (idUsuario) => {
        try {
            setLoading(true);
            // Usamos el servicio de Venta
            const res = await ventaService.getAllByUser(idUsuario); 
            
            const mappedCompras = res.data.map(compra => ({
                // Clave principal: idVenta
                idCompra: compra.idVenta,
                total: compra.totalVenta,
                fechaHora: compra.fechaHora,
                // Acceso a los objetos anidados con encadenamiento opcional
                estado: compra.estadoEstado?.estadoCompra || 'Desconocido', 
                metodoPago: compra.metodoPagoMetodoPago?.nomMetPago || 'N/A',
                direccion: compra.direccionesDirecciones?.direccion || 'N/A',
                // Lista de productos
                detalles: compra.productosVenta || [] 
            }));

            setCompras(mappedCompras);
        } catch (err) {
            generarMensaje('Error al cargar tu historial de compras.', 'danger');
            console.error("Error cargando compras:", err);
            setCompras([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Container className="my-5 text-center"><Spinner animation="border" variant="success" /></Container>;
    if (!user) return <Container className="my-5"><Alert variant="info">Debes iniciar sesión para ver tus compras.</Alert></Container>;

    // ... (El JSX de renderizado es el mismo que el corregido anterior) ...

    // Placeholder para el JSX
    return (
        <Container className="my-5">
            <h1 className="mb-4 text-3xl font-bold">📜 Mi Historial de Compras</h1>
            {/* ... Listado de compras (Ventas) */}
        </Container>
    );
}