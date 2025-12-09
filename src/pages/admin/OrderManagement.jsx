import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Form, Button, Badge } from 'react-bootstrap';
import ventaService from '../../service/ventaService';
import estadoService from '../../service/estadoService'; 
import { generarMensaje } from '../../utils/GenerarMensaje';
import { format } from 'date-fns';

export default function OrderManagement() {
    const [ordenes, setOrdenes] = useState([]);
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [ventaRes, estadoRes] = await Promise.all([
                ventaService.getAll(), // Cargar todas las ventas
                estadoService.getAll() // Cargar todos los estados posibles
            ]);
            setOrdenes(ventaRes.data);
            setEstados(estadoRes.data);
        } catch (error) {
            generarMensaje('Error al cargar órdenes y estados.', 'danger');
        } finally {
            setLoading(false);
        }
    };
    
    // Función auxiliar para asignar color al estado (Misma que en MisCompras)
    const getStatusVariant = (statusName) => {
        switch (statusName?.toUpperCase()) {
            case 'ENTREGADO': return 'success';
            case 'ENVIADO': return 'primary';
            case 'PROCESANDO': return 'info';
            case 'PENDIENTE': return 'warning';
            case 'CANCELADO': return 'danger';
            default: return 'secondary';
        }
    };

    // Manejar el cambio de estado de una orden
    const handleStatusChange = async (idVenta, newEstadoId) => {
        setUpdateLoading(true);
        
        // CONSTRUCCIÓN DEL PAYLOAD (CLAVE: estadoEstado anidado)
        const payload = {
            // Solo necesitamos enviar el objeto anidado de Estado
            estadoEstado: {
                idEstado: newEstadoId
            }
        };

        try {
            await ventaService.update(idVenta, payload); 
            generarMensaje(`Estado de la orden #${idVenta} actualizado.`, 'success');
            await fetchAllData(); // Recargar la tabla
        } catch (error) {
            generarMensaje('Error al actualizar el estado de la orden.', 'danger');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return <Container className="my-5 text-center"><Spinner animation="border" variant="primary" /></Container>;

    return (
        <Container className="my-5">
            <h1 className="mb-4">Gestión de Órdenes 🚚</h1>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID Venta</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado Actual</th><th>Cambiar Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenes.map(v => (
                        <tr key={v.idVenta}>
                            <td>{v.idVenta}</td>
                            <td>{format(new Date(v.fechaHora), 'dd/MM/yyyy HH:mm')}</td>
                            {/* Acceder al nombre del cliente anidado */}
                            <td>{v.usuarioUsuario?.nombre || 'Desconocido'}</td> 
                            <td>${v.totalVenta.toLocaleString('es-CL')}</td>
                            {/* Acceder al nombre del estado anidado */}
                            <td><Badge bg={getStatusVariant(v.estadoEstado?.estadoCompra)}>{v.estadoEstado?.estadoCompra || 'N/A'}</Badge></td>
                            <td>
                                <Form.Select 
                                    size="sm"
                                    // Usar el ID del estado actual anidado
                                    value={v.estadoEstado?.idEstado || ''} 
                                    onChange={(e) => handleStatusChange(v.idVenta, parseInt(e.target.value))}
                                    disabled={updateLoading}
                                >
                                    <option value="" disabled>Seleccionar</option>
                                    {estados.map(e => (
                                        <option key={e.idEstado} value={e.idEstado}>{e.estadoCompra}</option>
                                    ))}
                                </Form.Select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}