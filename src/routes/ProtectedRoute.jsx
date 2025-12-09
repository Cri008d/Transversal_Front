import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    
    // Muestra un loader mientras se verifica la autenticación
    if (loading) {
        return <div className="p-10 text-center">Cargando autenticación...</div>;
    }

    // Si hay un usuario (está logueado), renderiza las rutas anidadas (<Outlet>)
    // Si no hay usuario, redirige al login
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;