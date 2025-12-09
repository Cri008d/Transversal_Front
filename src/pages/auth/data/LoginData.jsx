import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Forms from '../../components/templates/Forms'; 
import loginData from './data/loginData';             
import userService from '../../service/usuarioService'; 
import { useAuth } from '../../context/AuthContext';
import { generarMensaje } from '../../utils/GenerarMensaje';

export default function Login() {
    const [formData, setFormData] = useState({ 
        correo: '', 
        contrasena: '' 
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // 1. Manejo del cambio de inputs (usado por Forms.jsx)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Manejo del Submit (la lógica de conexión al backend)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // SIMULACIÓN DE LOGIN: Busca al usuario por correo
            // Asumimos que el backend tiene un endpoint de búsqueda por correo.
            const response = await userService.getByEmail(formData.correo);
            const userData = response.data; 
            
            // Si el backend es REST simple y no valida contraseñas, solo comprobamos que exista el usuario.
            if (userData) {
                // Almacenar el usuario en el contexto global
                login(userData); 
                generarMensaje('¡Inicio de sesión exitoso!', 'success');
                navigate(userData.rolRol?.nombre === 'ADMIN' ? '/admin' : '/');
            } else {
                 throw new Error('Usuario no encontrado');
            }

        } catch (err) {
            console.error("Error de login:", err);
            generarMensaje('Credenciales inválidas o error de conexión.', 'danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="w-full max-w-sm p-8 bg-gray-800 rounded-xl shadow-2xl">
                {/* Aquí se utiliza el componente genérico Forms, 
                    pasándole el JSON y las funciones de manejo.
                */}
                <Forms
                    data={loginData}
                    initialState={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                />
            </div>
        </div>
    );
}