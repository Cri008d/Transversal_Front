import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-light py-4 mt-5 shadow-sm">
      <Container>
        <Row>
          {/* Sobre nosotros */}
          <Col md={4}>
            <h5>🌱 Plantita</h5>
            <p>Productos frescos y consejos para tus plantas.</p>
          </Col>

          {/* Enlaces rápidos */}
          <Col md={4}>
            <h6>Enlaces rápidos</h6>
            <ul className="list-unstyled">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </Col>

          {/* Contacto */}
          <Col md={4}>
            <h6>Contacto</h6>
            <p>Email: <a href="mailto:info@plantita.cl">info@plantita.cl</a></p>
            <p>Tel: +56 9 1234 5678</p>
          </Col>
        </Row>

        <hr />

        {/* Derechos */}
        <p className="text-center mb-0">&copy; 2025 Plantita. Todos los derechos reservados.</p>
      </Container>
    </footer>
  );
}

export default Footer;