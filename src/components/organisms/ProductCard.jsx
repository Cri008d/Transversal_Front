import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';

// Usamos export default para evitar errores de importación
export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToCart } = useCartContext(); 

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Evita que al dar click en añadir se abra el detalle
        addToCart(product); 
    };

    return (
        <Card className="custom-card h-100 shadow-sm">
            {/* Contenedor para controlar el tamaño de la imagen */}
            <div className="card-img-wrapper cursor-pointer" onClick={() => navigate(`/productos/${product.id || product.idProducto}`)}>
                <Card.Img 
                    variant="top" 
                    src={product.image || product.urlImagen} 
                    alt={product.title || product.nombreProducto} 
                />
            </div>
            
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-success">
                    {product.title || product.nombreProducto}
                </Card.Title>
                
                <Card.Text className="text-muted small flex-grow-1">
                    {product.description || product.descripcionProducto || "Sin descripción disponible."}
                </Card.Text>
                
                <div className="mt-3 d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0 fw-bold">
                        ${(product.price || product.precioProducto || 0).toLocaleString('es-CL')}
                    </span>
                    <Button 
                        className="btn-custom" 
                        size="sm" 
                        onClick={handleAddToCart}
                    >
                        + Agregar
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};