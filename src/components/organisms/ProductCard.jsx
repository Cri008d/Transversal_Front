import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToCart } = useCartContext(); 

    const handleAddToCart = (e) => {
        e.stopPropagation(); 
        addToCart(product); 
    };

    return (
        // Usamos la nueva clase 'product-card-plantita'
        <Card className="product-card-plantita h-100" onClick={() => navigate(`/productos/${product.id}`)} style={{ cursor: 'pointer' }}>
            <div className="product-card-img-container">
                <Card.Img 
                    variant="top" 
                    src={product.image} 
                    alt={product.title} 
                    className="product-card-img"
                />
            </div>
            
            <Card.Body className="d-flex flex-column p-4">
                <Card.Title className="product-card-title mb-3">
                    {product.title}
                </Card.Title>
                
                <Card.Text className="text-muted mb-4 flex-grow-1">
                    {product.description || "Sin descripción disponible."}
                </Card.Text>
                
                <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="product-card-price">
                        ${product.price.toLocaleString('es-CL')}
                    </span>
                    {/* Usamos la nueva clase 'btn-plantita' */}
                    <Button className="btn-plantita" onClick={handleAddToCart}>
                        + Agregar
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};