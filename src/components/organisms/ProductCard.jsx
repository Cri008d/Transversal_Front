import { Card } from 'react-bootstrap';
import Image from '../atoms/Image';
import Button from '../atoms/Button';
import CardBody from '../molecules/CardBody';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useCartContext } from '../../context/CartContext';

export function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToCart } = useCartContext(); 

    const handleAddToCart = () => {
        addToCart(product); // Añade el producto al contexto del carrito
    };

    return (
        <Card style={{ width: '18rem' }} className="m-2 shadow-sm">
            <Image src={product.image} alt={product.name} className="card-img-top" />
            <Card.Body>
                <CardBody
                    title={product.name}
                    description={product.description}
                    price={product.price}
                />
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center">
                <Button variant="success" onClick={handleAddToCart} className="flex-grow-1 me-2">
                    🛒 Añadir
                </Button>
                <Button variant="outline-primary" onClick={() => navigate(`/products/${product.id}`)}>
                    Detalles
                </Button>
            </Card.Footer>
        </Card>
    );
};

