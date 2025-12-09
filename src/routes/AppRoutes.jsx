import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; 
import AdminRoute from './AdminRoute';     

// =============== PÁGINAS PÚBLICAS / CLIENTE ===============
import Home from '../pages/Home'; 
import Producto from '../pages/Producto'; 
import ProdDetalles from '../pages/ProdDetalles';
import Blog from '../pages/Blog';
import Contacto from '../pages/Contacto';
import Login from '../pages/auth/Login';       // <--- Recuerda que estas también las corregimos
import Register from '../pages/auth/Register'; // <--- Recuerda que estas también las corregimos
import Cart from "../pages/Cart";
import UserHome from '../pages/UserHome';      // <--- ÚNICA importación de UserHome

// =============== PÁGINAS DE USUARIO PROTEGIDAS ===============
import PerfilUsuario from '../pages/user/PerfilUsuario';
import MisCompras from '../pages/user/MisCompras';
import MisDirecciones from '../pages/user/MisDirecciones';
import Checkout from '../pages/user/Checkout'; 
// (Asegúrate de NO tener otra línea importando UserHome aquí abajo)

// =============== PÁGINAS DE ADMINISTRACIÓN ===============
import HomeAdmin from '../pages/admin/HomeAdmin';
import ProductManagement from '../pages/admin/ProductManagement';
import OrderManagement from '../pages/admin/OrderManagement';     
import UserManagement from '../pages/admin/UserManagement';    


function AppRoutes() {
    return (
        <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/" element={<UserHome />} /> {/* Usamos UserHome como la principal con catálogo */}
            <Route path="/quienes-somos" element={<Home />} />
            <Route path="/productos" element={<Producto />} /> 
            <Route path="/productos/:id" element={<ProdDetalles />} /> 
            <Route path="/blog" element={<Blog />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            

            {/* RUTAS PROTEGIDAS PARA CUALQUIER USUARIO LOGEADO */}
            <Route element={<ProtectedRoute />}>
                <Route path="/perfil" element={<PerfilUsuario />} />
                <Route path="/mis-compras" element={<MisCompras />} />
                <Route path="/mis-direcciones" element={<MisDirecciones />} />
                <Route path="/checkout" element={<Checkout />} />
            </Route>

            
            {/* RUTAS PROTEGIDAS PARA ADMINISTRADORES (ROL 'ADMIN') */}
            <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<HomeAdmin />} /> 
                <Route path="productos" element={<ProductManagement />} />
                <Route path="pedidos" element={<OrderManagement />} />
                <Route path="usuarios" element={<UserManagement />} />
            </Route>
            
            {/* 404 - Página no encontrada */}
            <Route path="*" element={<h1>404 | Página no encontrada</h1>} />

        </Routes>
    );
}

export default AppRoutes;