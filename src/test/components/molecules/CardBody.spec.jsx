import React from 'react';
import { render, screen } from '@testing-library/react';
import CardBody from '../../../components/molecules/CardBody';

describe('CardBody Component', () => {
  it('renderiza el título, descripción y precio correctamente', () => {
    const props = {
      title: 'Producto de Prueba',
      description: 'Esta es una descripción de prueba.',
      price: 12345
    };

    render(<CardBody {...props} />);

    // Verifica que el título se renderice
    expect(screen.getByText(props.title)).toBeTruthy();
    
    // Verifica que la descripción se renderice
    expect(screen.getByText(props.description)).toBeTruthy();
    
    // Verifica que el precio se renderice (usamos una expresión regular para ignorar el símbolo '$')
    expect(screen.getByText(/12345/)).toBeTruthy();
  });

  it('renderiza correctamente sin una descripción', () => {
    const props = {
      title: 'Otro Producto',
      price: 54321
    };

    render(<CardBody {...props} />);

    // Verifica que el título y el precio se rendericen
    expect(screen.getByText(props.title)).toBeTruthy();
    expect(screen.getByText(/54321/)).toBeTruthy();

  });
});