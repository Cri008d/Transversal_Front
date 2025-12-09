import React from 'react';
//import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Text from '../../../components/atoms/Text';

describe('Text Component', () => {
  it('renderiza el texto dentro de una etiqueta <p> por defecto', () => {
    const content = 'Este es un párrafo de prueba.';
    render(<Text>{content}</Text>);

    const textElement = screen.getByText(content, {selector: 'p'});
    
    // Verifica que el elemento exista
    expect(textElement).toBeInTheDocument();
    //Verica explicitamente que la etiqueta sea un <p>
    expect(textElement.tagName).toBe('P');
  }); 
  it('2. renderiza la etiqueta especificada (ej. <h5>', () => {
    const content = 'Título de Blog';
    render(<Text variant='h5'>{content}</Text>);

    const textElement = screen.getByText(content, { selector: 'h5'});

    expect(textElement).toBeInTheDocument();
    expect(textElement.tagName).toBe('H5');
  });

  it('3. aplica las clases CSS al elemento', () => {
    const content = 'Texto con estilo';
    const customClass = 'clase-roja';
    render(<Text className={customClass}>{content}</Text>);
    
    const textElement = screen.getByText(content);

    expect(textElement).toHaveClass(customClass);
  });

});