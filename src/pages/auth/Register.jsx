import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import userService from '../../service/usuarioService'; 
import { generarMensaje } from '../../utils/GenerarMensaje';

const ROL_CLIENTE_ID = 2; 

export default function Register() {
    const [formData, setFormData] = useState({ 
        nombre: '', 
        correo: '', 
        contrasena: '', 
        direccion: '',
        confirmContrasena: '' 
    });
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.contrasena !== formData.confirmContrasena) {
            generarMensaje('Las contraseñas no coinciden.', 'danger');
            return;
        }

        setLoading(true);

        const payload = {
            nombre: formData.nombre,
            correo: formData.correo,
            direccion: formData.direccion,
            contrasena: formData.contrasena,
            // Objeto anidado de Rol por defecto
            rol: { id: ROL_CLIENTE_ID } 
        };

        try {
            await userService.create(payload); 
            
            generarMensaje('Registro exitoso. ¡Inicia sesión ahora!', 'success');
            navigate('/login');

        } catch (err) {
            console.error(err);
            generarMensaje('Error al crear la cuenta. Intenta con otro correo.', 'danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
             <Card style={{ width: '24rem' }} className="shadow-lg">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Crear Cuenta</Card.Title>
                    <Form onSubmit={handleSubmit}>
                         <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} required />
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control type="password" name="confirmContrasena" value={formData.confirmContrasena} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="success" type="submit" className="w-100" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Registrarse'}
                        </Button>
                        <div className="text-center mt-3">
                            <small>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></small>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
