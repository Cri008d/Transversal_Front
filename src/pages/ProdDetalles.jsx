import { Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useCart } from "../components/organisms/CartContext.jsx";
import products from '../data/producto.js';
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import '../styles/ProdDetalles.css';
import Button from '../components/atoms/Button.jsx'; 
import React from 'react';


function ProdDetalles() {
 const { id } = useParams();
 const product = products.find((p) => p.id === parseInt(id));
 const { addToCart } = useCart();

 if (!product) {
   return (
     <Container className="my-5">
       <h1>Producto no encontrado</h1>
     </Container>
   );
 }


 return (
   <Container className="my-5">
     <Card>
       <Image src={product.image} alt={product.name} className="product-detail-img" />
       
       <Card.Body>
         <Text variant="h2">{product.name}</Text>
         <Text variant="p">{product.description}</Text>
         <Text variant="h4">${product.price}</Text> 
       </Card.Body>
       <Button variant="success" onClick={() => addToCart(product)}>
          Agregar al carrito
        </Button>
     </Card>
   </Container>
    
);
}


export default ProdDetalles;
