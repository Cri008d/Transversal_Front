import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext'; 
import { CartProvider } from '../../context/CartContext'; 

/**
 * Wrapper combinado para envolver componentes en tests.
 * Provee: Router, AuthContext y CartContext.
 * Esto simula el entorno real de la aplicación.
 */
export const AllContextsWrapper = ({ children }) => {
    return (
        // El orden de los Providers puede importar si uno usa datos del otro
        <Router> 
            <AuthProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </AuthProvider>
        </Router>
    );
};