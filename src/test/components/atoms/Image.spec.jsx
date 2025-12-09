import React from 'react';
import { render, screen } from '@testing-library/react';
import Image from '../../../components/atoms/Image';

describe('Image Component', () => {
  it('renderiza la imagen con los atributos correctos', () => {
    const src = 'https://example.com/imagen.jpg';
    const altText = 'Texto alternativo de la imagen'; // Usamos un nombre de variable claro
    const className = 'mi-clase-css';

    render(<Image src={src} alt={altText} className={className} />);

    // Busca la imagen usando la variable correcta: altText
    const imageElement = screen.getByAltText(altText);

    // Verifica que la imagen exista en el documento
    expect(imageElement).toBeTruthy();

    // Verifica que los atributos 'src' y 'class' sean correctos
    expect(imageElement.getAttribute('src')).toBe(src);
    expect(imageElement).toHaveClass(className);
  });
});