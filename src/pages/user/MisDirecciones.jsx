import React, { useEffect, useState } from "react";
import { Container, Card, Button, Modal, Form, Spinner, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import direccionService from '../../service/direccionService'; 
import comunaService from '../../service/comunaService'; 
import { generarMensaje } from '../../utils/GenerarMensaje'; 

const initialAddressState = {
    id: null, 
    direccion: '', 
    referencia: '', 
    comunaId: '', 
};

export default function MisDirecciones() {
    const [direcciones, setDirecciones] = useState([]);
    const [comunas, setComunas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(initialAddressState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { user, loading: authLoading } = useAuth(); 

    useEffect(() => {
        const fetchComunas = async () => {
            try {
                const response = await comunaService.getAll(); 
                setComunas(response.data); 
            } catch (error) {
                generarMensaje('Error al cargar la lista de comunas.', 'warning');
            }
        };
        fetchComunas();
    }, []);

    const fetchDirecciones = async (idUsuario) => {
        try {
            setLoading(true);
            const response = await direccionService.getAllByUser(idUsuario); 
            
            const mappedDirections = response.data.map(d => ({
                id: d.id, // ID de la dirección (clave principal)
                direccion: d.direccion, 
                referencia: d.referencia || 'Sin referencia', 
                comuna: d.comuna?.nomComuna || 'N/A', 
                comunaId: d.comuna?.idComuna,
                idUsuario: idUsuario
            }));

            setDirecciones(mappedDirections);
        } catch (error) {
            generarMensaje('Error al cargar tus direcciones.', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user && user.idUsuario) {
            fetchDirecciones(user.idUsuario);
        }
    }, [user, authLoading]);

    // ... (El resto de funciones: handleClose, handleShowCreate, handleShowEdit, handleChange, handleSave, handleDelete) ...
    // La lógica handleSave y handleDelete es la misma que la versión corregida anterior.

    // Implementación de handleSave (uso de claves correctas)
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const payload = {
            id: currentAddress.id, 
            direccion: currentAddress.direccion,
            referencia: currentAddress.referencia,
            // Clave anidada para la Comuna
            comuna: { idComuna: currentAddress.comunaId }, 
            // Clave anidada para el Usuario
            usuario: { idUsuario: user.idUsuario }
        };

        try {
            if (currentAddress.id) {
                await direccionService.update(currentAddress.id, payload);
                generarMensaje('Dirección actualizada con éxito.', 'success');
            } else {
                await direccionService.create(payload);
                generarMensaje('Dirección agregada con éxito.', 'success');
            }
            handleClose();
            await fetchDirecciones(user.idUsuario);
        } catch (error) {
            generarMensaje('Error al guardar la dirección.', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // ... (JSX de renderizado omitido por brevedad, es el mismo que el corregido anterior) ...
    
    // Placeholder para el JSX
    return (
        <Container className="my-5">
            <h2 className="text-3xl font-bold">📍 Mis Direcciones</h2>
            {/* ... JSX del listado, modal y botones */}
        </Container>
    );
}