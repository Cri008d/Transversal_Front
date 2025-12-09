import React from 'react';

function Image({ src, alt, className, ...restProps }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      {...restProps}
    />
  );
}

export default Image; // Tu línea de exportación