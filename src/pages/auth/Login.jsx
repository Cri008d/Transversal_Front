import React, { useState } from 'react';
// ... (Imports omitidos)
import userService from "../../service/usuarioService";

export default function Login() {
    const [credentials, setCredentials] = useState({ correo: '', contrasena: '' }); // Cambiado a 'contrasena'
    // ... (Estados y navigate omitidos)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Simular la búsqueda del usuario (Asumimos GET /api/v1/usuarios?correo=...)
            const response = await userService.getByEmail(credentials.correo);
            const userData = response.data;
            
            // 2. Si hay datos, SIMULAMOS que el login fue exitoso.
            //    La validación de la contrasena DEBE estar en el backend.
            if (userData) { 
                login(userData); // Almacena el usuario en el contexto
                generarMensaje('¡Identificación exitosa!', 'success');
                navigate('/'); 
            } else {
                 throw new Error('Usuario no encontrado');
            }

        } catch (err) {
            generarMensaje('Correo incorrecto o usuario no registrado.', 'danger');
        } finally {
            setLoading(false);
        }
    };

    // ... (JSX de renderizado)
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
             <Card style={{ width: '24rem' }} className="shadow-lg">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Iniciar Sesión (Simulado)</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control type="email" name="correo" value={credentials.correo} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" name="contrasena" value={credentials.contrasena} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={loading}>Entrar</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}