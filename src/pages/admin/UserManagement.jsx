import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import userService from "../../service/usuarioService";
import rolService from '../../service/rolService';   // Servicio para Roles
import { generarMensaje } from '../../utils/GenerarMensaje';

// Estado inicial del formulario (ajustado a las claves del backend)
const initialUserState = {
    idUsuario: null,
    nombre: '',
    correo: '',
    direccion: '', 
    contrasena: '', 
    rolId: '', // ID simple para el <Form.Select>
};

export default function UserManagement() {

    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(initialUserState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Carga Inicial de Datos (fetchAllData)
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [userRes, rolRes] = await Promise.all([
                userService.getAll(), // GET /api/v1/usuarios
                rolService.getAll()   // GET /api/v1/roles
            ]);
            setUsuarios(userRes.data);
            setRoles(rolRes.data);
        } catch (error) {
            generarMensaje('Error al cargar usuarios y roles.', 'danger');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    // 2. Manejo del Modal (Abrir/Cerrar/Editar)
    const handleClose = () => setShowModal(false);

    const handleShow = (user = initialUserState) => {
        // Al editar, mapeamos el objeto 'rolRol' anidado a un ID simple para el select.
        if (user.idUsuario) {
            setCurrentUser({
                ...user,
                // Clave exacta de la dirección del backend
                direccion: user.direccion || '', 
                // Mapear el rol anidado
                rolId: user.rolRol?.idRol || '', 
                // Siempre vaciar la contraseña para no enviarla si no se edita.
                contrasena: '' 
            });
        } else {
            setCurrentUser(initialUserState);
        }
        setShowModal(true);
    };
    
    // 3. Manejo de Cambios en el Formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser(prev => ({ ...prev, [name]: value }));
    };

    // 4. CRUD: Guardar (Crear/Editar)
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // CONSTRUCCIÓN DEL PAYLOAD FINAL (CLAVES DEL BACKEND)
        const payload = {
            idUsuario: currentUser.idUsuario,
            nombre: currentUser.nombre,
            correo: currentUser.correo,
            direccion: currentUser.direccion, // Clave 'direccion'
            // Solo incluir la contraseña si se está creando o actualizando
            ...(currentUser.contrasena && { contrasena: currentUser.contrasena }), // Clave 'contrasena'
            // OBJETO ANIDADO: Rol
            rolRol: {
                idRol: currentUser.rolId
            }
        };

        try {
            if (currentUser.idUsuario) {
                // Actualizar (PUT/PATCH /api/v1/usuarios/{id})
                await userService.update(currentUser.idUsuario, payload); 
                generarMensaje('Usuario actualizado con éxito.', 'success');
            } else {
                // Crear (POST /api/v1/usuarios)
                await userService.create(payload);
                generarMensaje('Usuario creado con éxito.', 'success');
            }
            handleClose();
            await fetchAllData(); // Recargar la tabla
        } catch (error) {
            generarMensaje('Error al guardar el usuario.', 'danger');
            console.error("Error saving user:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. CRUD: Eliminar
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                await userService.remove(id);
                generarMensaje('Usuario eliminado con éxito.', 'success');
                await fetchAllData(); // Recargar la tabla
            } catch (error) {
                generarMensaje('Error al eliminar el usuario.', 'danger');
                console.error("Error deleting user:", error);
            }
        }
    };


    if (loading) return <Container className="my-5 text-center"><Spinner animation="border" variant="primary" /></Container>;

    return (
        <Container className="my-5">
            <h1 className="mb-4">Gestión de Usuarios 🧑‍💻</h1>
            <Button onClick={() => handleShow()} variant="success" className="mb-3">
                Añadir Nuevo Usuario
            </Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Dirección</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u.idUsuario}>
                            <td>{u.idUsuario}</td>
                            <td>{u.nombre}</td>
                            <td>{u.correo}</td>
                            <td>{u.direccion || 'N/A'}</td> 
                            {/* Acceder al nombre del rol anidado */}
                            <td>{u.rolRol?.nombre || 'N/A'}</td> 
                            <td>
                                <Button size="sm" variant="warning" onClick={() => handleShow(u)} className="me-2">Editar</Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(u.idUsuario)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal de Creación/Edición */}
             <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentUser.idUsuario ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" name="nombre" value={currentUser.nombre} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control type="email" name="correo" value={currentUser.correo} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" name="direccion" value={currentUser.direccion} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña {currentUser.idUsuario ? '(Dejar vacío para no cambiar)' : '*'}</Form.Label>
                            {/* Se requiere contraseña solo en la creación */}
                            <Form.Control type="password" name="contrasena" value={currentUser.contrasena} onChange={handleChange} required={!currentUser.idUsuario} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select name="rolId" value={currentUser.rolId} onChange={handleChange} required>
                                <option value="">Selecciona un Rol</option>
                                {roles.map(r => (
                                    <option key={r.idRol} value={r.idRol}>
                                        {r.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner size="sm" className="me-2" /> : 'Guardar Cambios'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}