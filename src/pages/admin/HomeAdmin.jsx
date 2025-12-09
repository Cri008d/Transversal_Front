import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import ventaService from '../../service/ventaService';
import productoService from '../../service/productoService';

export default function HomeAdmin() {
    const [metrics, setMetrics] = useState({
        totalVentas: 0,
        productosStock: 0,
        totalIngresos: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // FALLBACK: Si no hay endpoints específicos para métricas,
                // usamos getAll() y calculamos las métricas en el frontend.
                const [allVentasRes, allProductosRes] = await Promise.all([
                    ventaService.getAll(),
                    productoService.getAll()
                ]);

                const allVentas = allVentasRes.data;
                const allProductos = allProductosRes.data;

                setMetrics({
                    totalVentas: allVentas.length,
                    // Suma la cantidad de stock de todos los productos
                    productosStock: allProductos.reduce((acc, p) => acc + p.stock, 0),
                    // Suma el totalVenta de todas las ventas
                    totalIngresos: allVentas.reduce((acc, v) => acc + v.totalVenta, 0)
                });

            } catch (error) {
                console.error("Error fetching admin metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return <Container className="my-5 text-center"><Spinner animation="border" variant="primary" /></Container>;
    }

    return (
        <Container className="my-5">
            <h1 className="mb-5">Panel de Administración 📊</h1>
            <Row>
                {/* Tarjeta de Ventas Totales */}
                <Col md={4} className="mb-4">
                    <Card bg="primary" text="white" className="shadow-lg">
                        <Card.Body>
                            <Card.Title>Ventas Totales</Card.Title>
                            <Card.Text className="h3">{metrics.totalVentas.toLocaleString('es-CL')}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Tarjeta de Ingresos Generados */}
                <Col md={4} className="mb-4">
                    <Card bg="success" text="white" className="shadow-lg">
                        <Card.Body>
                            <Card.Title>Ingresos Generados</Card.Title>
                            <Card.Text className="h3">${metrics.totalIngresos.toLocaleString('es-CL')}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Tarjeta de Stock Total */}
                <Col md={4} className="mb-4">
                    <Card bg="warning" text="dark" className="shadow-lg">
                        <Card.Body>
                            <Card.Title>Stock Total</Card.Title>
                            <Card.Text className="h3">{metrics.productosStock.toLocaleString('es-CL')}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                 <Col md={12}>
                    <Alert variant="info" className="text-center">
                        Utiliza la barra lateral para gestionar Productos, Órdenes y Usuarios.
                    </Alert>
                 </Col>
            </Row>
        </Container>
    );
}