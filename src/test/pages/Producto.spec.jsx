import React from 'react';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import Producto from '../../pages/Producto';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const mockProducts = [
  { id: 1, name: 'Lechuga', price: 1500, description: 'Lechuga fresca', image: 'img/lechuga.jpg' },
  { id: 2, name: 'Tomate', price: 2000, description: 'Tomate maduro', image: 'img/tomate.jpg' },
];


const mockAuthContextValue = {
  user: null,
  loading:false,
  login: jasmine.createSpy('login'),
  logout: jasmine.createSpy('logout'),
}; 

const mockCartContextValue = {
  // Simula la función que ProductCard está tratando de leer
  addToCart: jasmine.createSpy('addToCart'),
  cartItems: [],
  isItemInCart: jasmine.createSpy('isItemInCart').and.returnValue(false),
  removeFromCart: jasmine.createSpy('removeFromCart'),
  total: 0,
  clear: jasmine.createSpy('clear'),
};

// 2. Componente de ayuda para envolver Producto con el Contexto y el Router
const TestWrapper = ({ children }) => {
  const router = createMemoryRouter(
    [{ path: '/productos', element: children }],
    { initialEntries: ['/productos'] }
  );
  return (
    <AuthContext.Provider value={mockAuthContextValue}>
      <CartContext.Provider value={mockCartContextValue}>
        <RouterProvider router={router} />
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

// --- FIN DE NUEVAS DEFINICIONES ---

describe('Producto Page', () => {
  it('renderiza el título principal de la página (Solucionado el error de título)', async () => {
    render(
      <TestWrapper>
        <Producto />
      </TestWrapper>
    );
    // Verificar que el título principal de la página existe
    // Tu código de verificación de título es correcto:
    const title = await screen.getByRole('heading', { name: /Productos/i }); 
    expect(title).toBeInTheDocument();
  });

  it('renderiza una tarjeta para cada producto (Solucionado el error de ProductCard)', async () => {
    render(
      <TestWrapper>
        <Producto />
      </TestWrapper>
    );
    // Una vez que el componente ProductCard ya no arroje error, estos tests deberían pasar.
    // Verifica que los nombres de los productos reales se muestren
    expect(await screen.findByText('Lechuga')).toBeInTheDocument();
    expect(await screen.findByText('Tomate')).toBeInTheDocument();
  });
});