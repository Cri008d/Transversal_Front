import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// CORRECCIÓN 1: Importar el nombre correcto del hook (useCartContext)
import { useCartContext } from '../../context/CartContext'; 
import { useAuth } from '../../context/AuthContext'; 
import CheckoutSummary from '../../components/organisms/CheckoutSummary'; 
import { generarMensaje } from '../../utils/GenerarMensaje';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'; 

import direccionService from '../../service/direccionService'; 
import ventaService from '../../service/ventaService'; 
import metodoPagoService from '../../service/metodoPagoService'; 
import metodoEnvioService from '../../service/metodoEnvioService'; 

const DEFAULT_ENVIO_ID = 1; 
const INITIAL_ESTADO_ID = 1; 

export default function Checkout() {
    // CORRECCIÓN 2: Usar las variables tal como se llaman en el Contexto
    // cart (en lugar de items) y clear (en lugar de clearCart)
    const { cart, total, clear } = useCartContext();
    const { user, loading: authLoading } = useAuth(); 
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [metodosPago, setMetodosPago] = useState([]); 
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPagoId, setSelectedPagoId] = useState(null); 
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (authLoading || !user || !user.idUsuario) {
            if (!authLoading) setLoading(false);
            return;
        }

        const fetchAllCheckoutData = async () => {
            try {
                const [dirRes, pagoRes] = await Promise.all([
                    direccionService.getAllByUser(user.idUsuario), 
                    metodoPagoService.getAll() 
                ]);
                
                const mappedAddresses = dirRes.data.map(addr => ({
                    id: addr.id, 
                    direccion: `${addr.direccion}, ${addr.comuna?.nomComuna || 'N/A'}`
                }));
                
                const mappedPagos = pagoRes.data.map(p => ({
                    id: p.idMetPago,
                    nombre: p.nomMetPago 
                }));

                setAddresses(mappedAddresses);
                setMetodosPago(mappedPagos);

                if (mappedAddresses.length > 0) setSelectedAddress(mappedAddresses[0]);
                if (mappedPagos.length > 0) setSelectedPagoId(mappedPagos[0].id); 

            } catch (error) {
                generarMensaje('Error al cargar datos de checkout.', 'warning');
                console.error('Error cargando datos de Checkout:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCheckoutData();
    }, [user, authLoading]);

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        // CORRECCIÓN 3: Usar 'cart' en lugar de 'items' en las validaciones
        if (!selectedAddress || !selectedPagoId || cart.length === 0) {
            generarMensaje('Faltan datos de envío, pago o el carrito está vacío.', 'warning');
            return;
        }

        setSubmitLoading(true);

        try {
            // CORRECCIÓN 4: Usar 'cart' para mapear los productos
            const productosVentaPayload = cart.map(item => ({
                cantidad: item.quantity, 
                precioProd: item.price, 
                productoProducto: { idProducto: item.id } 
            }));

            const orderPayload = {
                totalVenta: total,
                usuarioUsuario: { idUsuario: user.idUsuario }, 
                direccionesDirecciones: { id: selectedAddress.id }, 
                metodoPagoMetodoPago: { idMetPago: selectedPagoId }, 
                metodoEnvioMetodoEnvio: { idMetodoEnvio: DEFAULT_ENVIO_ID }, 
                estadoEstado: { idEstado: INITIAL_ESTADO_ID }, 
                productosVenta: productosVentaPayload, 
            };

            const res = await ventaService.create(orderPayload);
            
            generarMensaje(`¡Pedido #${res.data.idVenta} realizado con éxito!`, 'success');
            clear(); // CORRECCIÓN 5: Usar 'clear()' en lugar de 'clearCart()'
            navigate('/mis-compras');

        } catch (error) {
            generarMensaje('Error al procesar el pago. Por favor, revisa tus datos.', 'danger');
            console.error('Error en Checkout:', error.response?.data || error);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <Container className="my-5 text-center"><Spinner animation="border" variant="success" /></Container>;
    if (!user) return <Container className="my-5 text-center"><Alert variant="info">Debes iniciar sesión para proceder al pago.</Alert></Container>;
    // CORRECCIÓN 6: Usar 'cart' para verificar si está vacío
    if (cart.length === 0) return <Container className="my-5 text-center"><Alert variant="warning">Tu carrito está vacío.</Alert></Container>;

    return (
        <Container className="my-5">
            <h1 className="mb-4 text-3xl font-bold">🛒 Finalizar Compra</h1>
            
            <form onSubmit={handleConfirmOrder}>
                <Row>
                    <Col lg={8} className="space-y-4">
                        <Card className="shadow-sm">
                            <Card.Header className="bg-success text-white">1. Dirección de Envío</Card.Header>
                            <Card.Body>
                                {addresses.length === 0 ? (
                                    <Alert variant="danger">No tienes direcciones guardadas.</Alert>
                                ) : (
                                    <Form.Select 
                                        onChange={(e) => setSelectedAddress(addresses.find(a => a.id === parseInt(e.target.value)))}
                                        value={selectedAddress?.id || ''}
                                    >
                                        <option value="" disabled>Selecciona una dirección</option>
                                        {addresses.map(addr => (
                                            <option key={addr.id} value={addr.id}>{addr.direccion}</option>
                                        ))}
                                    </Form.Select>
                                )}
                            </Card.Body>
                        </Card>
                        
                        <Card className="shadow-sm">
                            <Card.Header className="bg-info text-white">2. Método de Pago</Card.Header>
                            <Card.Body>
                                {metodosPago.map(p => (
                                    <Form.Check 
                                        type="radio"
                                        name="payment"
                                        label={p.nombre}
                                        id={`pago-${p.id}`}
                                        key={p.id}
                                        value={p.id}
                                        checked={selectedPagoId === p.id}
                                        onChange={() => setSelectedPagoId(p.id)}
                                    />
                                ))}
                            </Card.Body>
                        </Card>
                        
                    </Col>
                    <Col lg={4}>
                        <div className="sticky-top" style={{ top: '20px' }}>
                            {/* CORRECCIÓN 7: Pasar 'cart' como prop 'items' */}
                            <CheckoutSummary items={cart} total={total} /> 
                            
                            <Button
                                type="submit" 
                                className="w-100 py-3 mt-4"
                                variant="primary"
                                disabled={submitLoading || !selectedAddress || !selectedPagoId || addresses.length === 0}
                            >
                                {submitLoading ? "Procesando..." : "Confirmar y Pagar"}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </form>
        </Container>
    );
}