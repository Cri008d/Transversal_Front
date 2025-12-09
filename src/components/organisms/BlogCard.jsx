import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'; // Importamos para formatear la fecha
import { es } from 'date-fns/locale'; // Para usar el idioma español

export default function BlogCard({ post }) {
    
    // Fallback para URL de imagen
    const defaultImage = 'https://ejemplo.com/imagenes/default-blog.jpg'; 

    return (
        <Card className="shadow-sm h-100 d-flex flex-column">
            <Card.Img 
                variant="top" 
                src={post.imageUrl || defaultImage} 
                alt={post.title} 
                style={{ height: '200px', objectFit: 'cover' }} 
            />
            <Card.Body className="d-flex flex-column">
                {/* Categoría y Fecha */}
                <div className="d-flex justify-content-between mb-2 text-muted small">
                    <span className="text-success fw-bold">{post.category}</span>
                    <span>{format(new Date(post.date), 'dd MMMM yyyy', { locale: es })}</span>
                </div>
                
                {/* Título y Resumen */}
                <Card.Title className="text-lg fw-bold">{post.title}</Card.Title>
                <Card.Text className="flex-grow-1">
                    {post.excerpt}
                </Card.Text>
                
                {/* Enlace al Detalle */}
                <Link to={`/blog/${post.slug}`} className="mt-3">
                    <Button variant="outline-success" className="w-100">
                        Leer Más
                    </Button>
                </Link>
            </Card.Body>
            <Card.Footer className="text-muted small">
                Escrito por: {post.author}
            </Card.Footer>
        </Card>
    );
}