
import React, { createContext, useContext, useState, useEffect } from 'react';

//1. se crea el contexto
export const CartContext = createContext();

//2. se exporta el hook de uso
export const useCartContext = () => useContext(CartContext);

//3. Se define un proveedor
export const CartProvider = ({ children}) => {
    //definimos las funciones  y estados que se compartiran
    const [cart, setCart] = useState(() => {
        const localData  = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];
    });
    //para guardar el carrito en localStorage cada que cambia
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    //funcion para añadir productos al acrrito
    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                //si existe aumenta la cantidad
                return prev.map(item =>
                    item.id === product.id ? {...item, quantity: item.quantity + quantity} : item
                );
            }
            //si no existe, añade el nuevo producto
            return [...prev, {...product, quantity}];
        });
    };
    //funcion para eliminar completo un producto
    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };
    //funcion para vaciar el carrito
    const clear = () => setCart([]);
    //calculo total de items para el navbar
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    //calculo del precio total del carrito
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    //funcion para verificar si un producto esta en el carrito
    const isItemInCart = (id) => cart.some(item => item.id === id);

    const contextValue = {
        cart,
        addToCart,
        removeFromCart,
        clear,
        total,
        totalItems,
        isItemInCart
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );

};

