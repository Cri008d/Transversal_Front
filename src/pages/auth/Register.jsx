import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import userService from '../../service/userService'; // Usamos el servicio de Usuarios
import { generarMensaje } from '../../utils/GenerarMensaje';

// ID por defecto del Rol Cliente
const ROL_CLIENTE_ID = 2; 

export default function Register() {
    const [formData, setFormData] = useState({ 
        nombre: '', 
        correo: '', 
        contrasena: '', // Cambiado a 'contrasena'
        direccion: '',  // Campo adicional
        confirmContrasena: '' 
    });
    // ... (Estados y handleChange omitidos)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.contrasena !== formData.confirmContrasena) {
            generarMensaje('Las contraseñas no coinciden.', 'danger');
            return;
        }

        setLoading(true);

        // CONSTRUCCIÓN DEL PAYLOAD FINAL (Claves: contrasena, rolRol{...})
        const payload = {
            nombre: formData.nombre,
            correo: formData.correo,
            direccion: formData.direccion, // Incluir la nueva clave
            contrasena: formData.contrasena, // Clave exacta del backend
            // Objeto anidado de Rol por defecto
            rolRol: { idRol: ROL_CLIENTE_ID } 
        };

        try {
            await userService.create(payload); // POST /api/v1/usuarios
            
            generarMensaje('Registro exitoso. ¡Inicia sesión ahora!', 'success');
            navigate('/login');

        } catch (err) {
            generarMensaje('Error al crear la cuenta. Intenta con otro correo.', 'danger');
        } finally {
            setLoading(false);
        }
    };
    
    // ... (JSX de renderizado)
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
             <Card style={{ width: '24rem' }} className="shadow-lg">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Crear Cuenta</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        {/* Campo de Dirección */}
                         <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                        </Form.Group>
                        {/* Campo de Contrasena */}
                         <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} required />
                        </Form.Group>
                        {/* Campo de Confirmar Contrasena */}
                         <Form.Group className="mb-3">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control type="password" name="confirmContrasena" value={formData.confirmContrasena} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="success" type="submit" className="w-100" disabled={loading}>Registrarse</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}