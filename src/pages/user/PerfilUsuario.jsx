import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import usuarioService from '../../service/usuarioService'; // Usamos el servicio ya definido
import { generarMensaje } from '../../utils/GenerarMensaje'; 
import { Nav, Tab } from 'react-bootstrap'; // Importamos para la navegación de pestañas

// Estado inicial del perfil (usa las claves del backend)
const initialProfileState = {
    nombre: '',
    correo: '',
    direccion: '', // Campo 'direccion' de tu esquema Usuario
    telefono: '', // Asumiendo que existe un campo 'telefono' aunque no esté en el esquema base
};

export default function PerfilUsuario() {
    // Usamos 'user' del contexto para obtener el ID y el nombre inicial
    const { user, loading: authLoading, login } = useAuth(); 
    
    // Estado para los datos del perfil/formulario
    const [formData, setFormData] = useState(initialProfileState); 
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estados para el cambio de contraseña
    const [passwordData, setPasswordData] = useState({ 
        contrasenaActual: '', 
        nuevaContrasena: '', 
        confirmarNuevaContrasena: '' 
    });
    const [passwordError, setPasswordError] = useState('');

    // --- Carga de Datos al Inicio ---
    useEffect(() => {
        // Cargar solo si la autenticación ha terminado y el usuario está presente
        if (!authLoading && user && user.idUsuario) { 
            fetchUserProfile(user.idUsuario);
        } else if (!authLoading) {
            setLoading(false); // Detener la carga si no hay usuario (aunque ProtectedRoute debería manejar esto)
        }
    }, [user, authLoading]);

    const fetchUserProfile = async (idUsuario) => {
        try {
            const response = await usuarioService.getById(idUsuario);
            // Mapeamos la respuesta usando las claves del backend
            setFormData({
                nombre: response.data.nombre || '',
                correo: response.data.correo || '',
                direccion: response.data.direccion || '',
                telefono: response.data.telefono || '', // Asumiendo este campo
            });
        } catch (error) {
            generarMensaje('Error al cargar la información del perfil.', 'danger');
            console.error("Error al cargar perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers de Formulario ---
    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
        setPasswordError('');
    };

    // --- 1. Actualizar Datos Personales ---
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // El backend espera el ID del usuario en la URL y los datos actualizados en el body
        const payload = {
            nombre: formData.nombre,
            // El correo generalmente no se actualiza así, pero si se permite:
            // correo: formData.correo, 
            direccion: formData.direccion,
            telefono: formData.telefono,
            // Nota: No se envía 'contrasena' en esta operación
        };

        try {
            await usuarioService.update(user.idUsuario, payload);
            generarMensaje('Perfil actualizado con éxito.', 'success');
            
            // Actualizar el contexto de autenticación si es necesario
            login({ ...user, nombre: formData.nombre }); 

        } catch (error) {
            generarMensaje('Error al actualizar el perfil.', 'danger');
            console.error("Error al actualizar perfil:", error.response?.data || error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- 2. Cambiar Contraseña (Lógica simplificada) ---
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        // (La lógica de validación de contraseñas duplicada del ejemplo anterior va aquí)
        if (passwordData.nuevaContrasena !== passwordData.confirmarNuevaContrasena) {
            setPasswordError('Las contraseñas no coinciden.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Asumiendo que el endpoint de actualización de usuario maneja el cambio de contraseña
            // O que hay un endpoint específico /usuario/{id}/cambiar-contrasena
            await usuarioService.update(user.idUsuario, { 
                contrasenaActual: passwordData.contrasenaActual, 
                contrasena: passwordData.nuevaContrasena, // Usamos 'contrasena' como clave del esquema
            });

            generarMensaje('Contraseña cambiada con éxito.', 'success');
            setPasswordData({ contrasenaActual: '', nuevaContrasena: '', confirmarNuevaContrasena: '' }); 
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al cambiar la contraseña. Verifica tu contraseña actual.';
            setPasswordError(msg);
            generarMensaje(msg, 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };


    if (loading) {
        return <Container className="my-5 text-center"><Spinner animation="border" variant="success" /></Container>;
    }
    
    if (!user || !user.idUsuario) {
        return <Container className="my-5"><Alert variant="danger">No tienes permiso para ver esta página o tu sesión ha expirado.</Alert></Container>;
    }

    // --- Renderizado del Perfil ---
    return (
        <Container className="my-5">
            <h1 className="mb-4">🔑 Mi Perfil</h1>
            
            <Tab.Container defaultActiveKey="datosPersonales">
                <Nav variant="pills" className="mb-4">
                    <Nav.Item><Nav.Link eventKey="datosPersonales">Datos Personales</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="cambioContrasena">Cambiar Contraseña</Nav.Link></Nav.Item>
                </Nav>

                <Tab.Content>
                    
                    {/* Pestaña 1: Datos Personales */}
                    <Tab.Pane eventKey="datosPersonales">
                        <Card className="shadow-sm p-4">
                            <Form onSubmit={handleProfileSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre Completo</Form.Label>
                                    <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleProfileChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    {/* Usamos 'correo' del esquema, pero lo hacemos de solo lectura */}
                                    <Form.Control type="email" value={formData.correo} readOnly disabled />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dirección Principal</Form.Label>
                                    {/* Usamos 'direccion' del esquema */}
                                    <Form.Control type="text" name="direccion" value={formData.direccion} onChange={handleProfileChange} />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control type="tel" name="telefono" value={formData.telefono} onChange={handleProfileChange} />
                                </Form.Group>
                                
                                <Button variant="success" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </Form>
                        </Card>
                    </Tab.Pane>

                    {/* Pestaña 2: Cambio de Contraseña */}
                    <Tab.Pane eventKey="cambioContrasena">
                        <Card className="shadow-sm p-4">
                            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                            <Form onSubmit={handlePasswordSubmit}>
                                {/* Campos de Contraseña (como en el ejemplo anterior) */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña Actual</Form.Label>
                                    <Form.Control type="password" name="contrasenaActual" value={passwordData.contrasenaActual} onChange={handlePasswordChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nueva Contraseña</Form.Label>
                                    <Form.Control type="password" name="nuevaContrasena" value={passwordData.nuevaContrasena} onChange={handlePasswordChange} required />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                                    <Form.Control type="password" name="confirmarNuevaContrasena" value={passwordData.confirmarNuevaContrasena} onChange={handlePasswordChange} required />
                                </Form.Group>
                                
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
                                </Button>
                            </Form>
                        </Card>
                    </Tab.Pane>

                </Tab.Content>
            </Tab.Container>
        </Container>
    );
}