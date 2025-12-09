import React from 'react';
import { Row, Col } from 'react-bootstrap';
// CORRECCIÓN: Quitamos las llaves { } porque ahora es export default
import ProductCard from './ProductCard'; 

export default function CardsDisplay({ items = [] }) {
    if (!items || items.length === 0) {
        return <p className="text-center text-muted">No hay elementos para mostrar.</p>;
    }

    return (
        <Row className="g-4">
            {items.map((item, index) => (
                <Col key={item.idProducto || item.id || index} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard product={item} />
                </Col>
            ))}
        </Row>
    );
}