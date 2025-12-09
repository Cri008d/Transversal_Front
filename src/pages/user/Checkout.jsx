import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 
import { useAuth } from '../../context/AuthContext'; 
import CheckoutSummary from '../../components/organisms/CheckoutSummary'; 
import { generarMensaje } from '../../utils/GenerarMensaje';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'; 

// Importación de todos los servicios necesarios
import direccionService from '../../service/direccionService'; 
import ventaService from '../../service/ventaService'; 
// Asumimos que estos servicios cargan los IDs estáticos
import metodoPagoService from '../../service/metodoPagoService'; 
import metodoEnvioService from '../../service/metodoEnvioService'; 

// IDs del backend que asumimos
const DEFAULT_ENVIO_ID = 1; // Asumir ID para 'Envío Estándar'
const INITIAL_ESTADO_ID = 1; // Asumir ID 1 para 'PENDIENTE'

export default function Checkout() {
    const { items, total, clearCart } = useCart();
    const { user, loading: authLoading } = useAuth(); 
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [metodosPago, setMetodosPago] = useState([]); // Nuevo estado para los métodos de pago reales
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPagoId, setSelectedPagoId] = useState(null); 
    const [submitLoading, setSubmitLoading] = useState(false);

    // Cargar Datos (Direcciones y Métodos de Pago/Envío)
    useEffect(() => {
        if (authLoading || !user || !user.idUsuario) {
            if (!authLoading) setLoading(false);
            return;
        }

        const fetchAllCheckoutData = async () => {
            try {
                const [dirRes, pagoRes] = await Promise.all([
                    direccionService.getAllByUser(user.idUsuario), 
                    metodoPagoService.getAll() // Cargar métodos de pago del backend
                    // Si se necesita método de envío, también se carga aquí: metodoEnvioService.getAll()
                ]);
                
                // Mapear direcciones: usar 'id' para la clave Direcciones
                const mappedAddresses = dirRes.data.map(addr => ({
                    id: addr.id, // <-- Clave ID de la entidad Direcciones
                    direccion: `${addr.direccion}, ${addr.comuna?.nomComuna || 'N/A'}`
                }));
                
                // Mapear métodos de pago: usar 'idMetPago' para la clave MetodoPago
                const mappedPagos = pagoRes.data.map(p => ({
                    id: p.idMetPago,
                    nombre: p.nomMetPago 
                }));

                setAddresses(mappedAddresses);
                setMetodosPago(mappedPagos);

                if (mappedAddresses.length > 0) setSelectedAddress(mappedAddresses[0]);
                if (mappedPagos.length > 0) setSelectedPagoId(mappedPagos[0].id); // Seleccionar el primer pago

            } catch (error) {
                generarMensaje('Error al cargar datos de checkout.', 'warning');
                console.error('Error cargando datos de Checkout:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCheckoutData();
    }, [user, authLoading]);

    // Manejar la confirmación de la orden (Venta)
    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        if (!selectedAddress || !selectedPagoId || items.length === 0) {
            generarMensaje('Faltan datos de envío, pago o el carrito está vacío.', 'warning');
            return;
        }

        setSubmitLoading(true);

        try {
            // A. Mapeo de ítems del carrito a la estructura ProductoVenta
            const productosVentaPayload = items.map(item => ({
                cantidad: item.quantity, 
                precioProd: item.price, 
                productoProducto: { idProducto: item.id } 
            }));

            // B. Construir el PAYLOAD FINAL de la VENTA (CLAVES ANIDADAS)
            const orderPayload = {
                totalVenta: total,
                usuarioUsuario: { idUsuario: user.idUsuario }, 
                direccionesDirecciones: { id: selectedAddress.id }, 
                metodoPagoMetodoPago: { idMetPago: selectedPagoId }, 
                metodoEnvioMetodoEnvio: { idMetodoEnvio: DEFAULT_ENVIO_ID }, 
                estadoEstado: { idEstado: INITIAL_ESTADO_ID }, 
                productosVenta: productosVentaPayload, 
            };

            // Llama al servicio de Venta
            const res = await ventaService.create(orderPayload);
            
            generarMensaje(`¡Pedido #${res.data.idVenta} realizado con éxito!`, 'success');
            clearCart(); 
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
    if (items.length === 0) return <Container className="my-5 text-center"><Alert variant="warning">Tu carrito está vacío.</Alert></Container>;

    // ... (El JSX de renderizado usa componentes de React Bootstrap/Tailwind CSS) ...
    return (
        <Container className="my-5">
            <h1 className="mb-4 text-3xl font-bold">🛒 Finalizar Compra</h1>
            
            <form onSubmit={handleConfirmOrder}>
                <Row>
                    <Col lg={8} className="space-y-4">
                        {/* 1. Dirección de Envío */}
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
                        
                        {/* 2. Método de Pago */}
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
                            <CheckoutSummary items={items} total={total} /> 
                            
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