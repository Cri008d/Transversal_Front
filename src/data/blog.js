// src/data/blog.js

const posts = [
    {
        id: 1,
        title: "5 Plantas Ideales para Principiantes",
        slug: "5-plantas-principiantes", // Usado para la URL de detalle: /blog/5-plantas-principiantes
        excerpt: "Descubre las especies más resistentes y fáciles de cuidar, perfectas si recién te inicias en el mundo de las plantas de interior.",
        author: "Javiera Verde",
        date: "2025-11-20",
        imageUrl: "https://ejemplo.com/imagenes/blog/planta_principiante.jpg",
        category: "Cuidado Básico",
        content: "Contenido completo del post 1...", // Se usaría en BlogDetail.jsx
    },
    {
        id: 2,
        title: "¿Cómo Regar Correctamente tu Suculenta?",
        slug: "como-regar-suculenta",
        excerpt: "El exceso de agua es el enemigo número uno de las suculentas. Aprende la técnica de 'remojo y secado' para mantenerlas felices.",
        author: "Martín Raíz",
        date: "2025-12-01",
        imageUrl: "https://ejemplo.com/imagenes/blog/suculenta_riego.jpg",
        category: "Consejos Expertos",
        content: "Contenido completo del post 2...",
    },
    {
        id: 3,
        title: "Fertilizantes Orgánicos vs. Químicos",
        slug: "fertilizantes-organicos-quimicos",
        excerpt: "Analizamos las ventajas y desventajas de cada tipo de abono para que elijas el mejor camino para nutrir tu jardín interior.",
        author: "Javiera Verde",
        date: "2025-12-05",
        imageUrl: "https://ejemplo.com/imagenes/blog/fertilizantes.jpg",
        category: "Nutrición",
        content: "Contenido completo del post 3...",
    },
    // Puedes agregar más posts aquí
];

export default posts;