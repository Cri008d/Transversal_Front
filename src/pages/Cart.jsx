import React from 'react';
import { useCartContext } from '../context/CartContext';
import { Container, Row, Col, Table} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Text from '../components/atoms/Text';

export default function Cart() {
  const { cart, removeFromCart, clear, total, totalItems } = useCartContext();
  const navigate = useNavigate();

  //si el carrito esta vacio, muestra un mensaje
  if (cart.length === 0) {
    return (
      <Container className="my-5 text-center">
        <Text variant='h2' className="text-gray-600 mb-4">🛒 Tu carrito está vacío</Text>
        <Button variant="success" onClick={() => navigate('/products')}>
          Ver Catálogo
        </Button>
      </Container>
    );
  }
  return (
    <Container className='my-5'>
      <Text variant='h1' className="mb-4">Mi  Carrito de Compras ({totalItems} items)</Text>

      <Row>
        <Col md={8}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price.toLocaleString('es-CL')}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toLocaleString('es-CL')}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                        X
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col md={4}>
              <div className="p-4 border rounded shadow-sm bg-light">
                <Text variant="h4" className="mb-3">Resumen</Text>
                <hr />
                <div className="d-flex justify-content-between my-2">
                  <Text variant="h5">Total:</Text>
                  <Text variant="h5" className="text-success">${total.toLocaleString('es-CL')}</Text>
                </div>
                <Button variant="primary" className="w-100 md-2" onClick={() => navigate('/checkout')}>
                  Finalizar Compra
                </Button>
                <Button variant="outline-danger" className="w-100" onClick={clear}>
                  Vaciar Carrito
                </Button>
              </div>
        </Col>
      </Row>
    </Container>
  );
};
  

