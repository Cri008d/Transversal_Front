import React from 'react';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import ProdDetalles from '../../pages/ProdDetalles';
import { CartProvider } from '../../components/organisms/CartContext';

const MockRouter = ({ children, initialEntries, path }) => {
  const router = createMemoryRouter(
    [{ path: path, element: children }],
    { initialEntries: initialEntries }
  );
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
};

describe('ProdDetalles Page', () => {
  it('renderiza los detalles de un producto existente', () => {
    render(
      <MockRouter initialEntries={['/products/1']} path="/products/:id">
        <ProdDetalles />
      </MockRouter>
    );

    // Verifica los datos REALES del producto con id: 1
    expect(screen.getByRole('heading', { name: 'Lechuga' })).toBeTruthy();
    expect(screen.getByText('Lechuga Costina')).toBeTruthy(); //  descripción
    expect(screen.getByText(/1000/)).toBeTruthy();
  });

  it('muestra un mensaje de "Producto no encontrado" para un id inválido', () => {
    render(
      <MockRouter initialEntries={['/products/999']} path="/products/:id">
        <ProdDetalles />
      </MockRouter>
    );
    expect(screen.getByText('Producto no encontrado')).toBeTruthy();
  });
});