import React from 'react';
//import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import Blog from '../../pages/Blog';

// (El código del mock de datos permanece igual)
const mockPosts = [
  { id: 1, titulo: "Bienvenidos a nuestro blog", autor: "Equipo Tienda", fecha: "2025-10-08", contenido: "..." },
  { id: 2, titulo: "Nuevos lanzamientos de la temporada", autor: "Marketing", fecha: "2025-09-25", contenido: "..." },
];
beforeEach(() => {
  delete require.cache[require.resolve('../../data/blog.js')];
  require.cache[require.resolve('../../data/blog.js')] = { exports: { default: mockPosts } };
});
afterEach(() => {
  delete require.cache[require.resolve('../../data/blog.js')];
});

const MockRouter = ({ children }) => {
  const router = createMemoryRouter([{ path: '*', element: children }], { initialEntries: ['/blog'] });
  return <RouterProvider router={router} />;
};

describe('Blog Page', () => {
  it('renderiza el título de la página del blog', () => {
    render(<MockRouter><Blog /></MockRouter>);
    const titleElement = screen.getByRole('heading', { name: /Blog/i, level: 2});
    expect(titleElement).toBeInTheDocument();
  });

  it('renderiza el subtítulo de la página del blog', () => {
    render(<MockRouter><Blog /></MockRouter>);
    expect(screen.getByText('Últimas publicaciones y novedades')).toBeInTheDocument();
  });

  it('renderiza las tarjetas del blog usando los datos simulados', () => {
    render(<MockRouter><Blog /></MockRouter>);
    expect(screen.getByText('Bienvenidos a nuestro blog')).toBeInTheDocument();
    expect(screen.getByText('Nuevos lanzamientos de la temporada')).toBeInTheDocument();
  });

  // PRUEBA ELIMINADA - El footer ya no está en esta página
});