import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const AdminRoute = () => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="p-10 text-center">Cargando permisos...</div>;
    }

    // 1. Verificar si hay usuario y si el rol es 'ADMIN'
    const isAdmin = user && user.rol === 'ADMIN';

    // Si es administrador, permite el acceso a las rutas anidadas (<Outlet>)
    if (isAdmin) {
        return <Outlet />;
    }

    // 2. Si no es admin o no está logueado,
    // Si está logueado pero no es admin, lo mandamos al home del cliente ('/')
    // Si no está logueado, lo mandamos a login
    return user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
};

export default AdminRoute;