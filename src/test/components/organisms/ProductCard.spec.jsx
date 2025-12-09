import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../../../components/organisms/ProductCard';
import { CartProvider } from '../../../context/CartContext'; 
import { BrowserRouter } from 'react-router-dom'; 

// Importación de módulos para MOCKEAR (usamos require() o import * as)
import * as reactRouterDom from 'react-router-dom'; 
const CartContextModule = require('../../../context/CartContext');

// ----------------------------------------------------
// 1. Mocks de Contexto 🛒
// ----------------------------------------------------

// Espía para addToCart
const mockAddToCart = jasmine.createSpy('addToCartSpy');

// Definición del valor mockeado para el Contexto
const mockContextValue = {
    cartItems: [],
    addToCart: mockAddToCart, 
    removeFromCart: jasmine.createSpy('removeFromCartSpy'), 
    isItemInCart: jasmine.createSpy('isItemInCartSpy'),
    total: 0, 
    clear: jasmine.createSpy('clearSpy')
};

// MOCKEAR useCartContext: Usamos and.callFake para evitar el error 'not writable'
spyOn(CartContextModule, 'useCartContext').and.callFake(() => mockContextValue);

// Producto de prueba
const mockProduct = {
    id: 1,
    name: 'Producto de Prueba',
    description: 'Descripción de prueba.',
    price: 9990,
    imageUrl: 'test-image.jpg',
};

// Función de renderizado con Providers
const renderWithProviders = (component) => {
    return render(
        <BrowserRouter> 
            <CartProvider>{component}</CartProvider>
        </BrowserRouter>
    );
};

// ----------------------------------------------------
// 2. Test Suites
// ----------------------------------------------------

describe('ProductCard Component', () => {
    
    // Configuración del spy useNavigate
    const navigate = jasmine.createSpy('navigateSpy');
    
    beforeAll(() => {
        // MOCKEAR useNavigate: Usamos and.callFake para evitar el error 'not writable'
        spyOn(reactRouterDom, 'useNavigate').and.callFake(() => navigate);
    });

    // Limpia los espías antes de cada prueba 
    beforeEach(() => {
        navigate.calls.reset();
        mockAddToCart.calls.reset();
    });

    // Test 1: Renderizado básico
    test('renderiza la información del producto correctamente', () => {
        renderWithProviders(<ProductCard product={mockProduct} />);

        expect(screen.getByRole('heading', { name: /Producto de Prueba/i })).toBeInTheDocument();
        expect(screen.getByText(/Descripción de prueba./i)).toBeInTheDocument();
        expect(screen.getByText(/\$ 9990/i)).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /Producto de Prueba/i })).toBeInTheDocument();
    });

    // Test 2: El botón de añadir al carrito llama a addToCart
    test('llama a la función addToCart al hacer clic en el botón "🛒 Añadir"', () => {
        renderWithProviders(<ProductCard product={mockProduct} />);

        const addButton = screen.getByRole('button', { name: /Añadir/i });
        fireEvent.click(addButton);

        expect(mockAddToCart).toHaveBeenCalledTimes(1); 
        expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    // Test 3: Renderizado del botón de Detalles (Texto corregido)
    test('renderiza el botón de "Detalles"', () => {
        renderWithProviders(<ProductCard product={mockProduct} />);
        
        const detailsButton = screen.getByRole('button', {name: /Detalles/i}); 
        expect(detailsButton).toBeInTheDocument();
    });
    
    // Test 4: Navegación (Argumentos corregidos)
    test('navega a la página de detalles al hacer clic en el botón', () => {
        renderWithProviders(<ProductCard product={mockProduct} />);

        const detailsButton = screen.getByRole('button', {name: /Detalles/i}); 
        fireEvent.click(detailsButton);

       
        expect(navigate).toHaveBeenCalledWith('/products/1', jasmine.anything()); 
        expect(navigate).toHaveBeenCalledTimes(1);
    });
});