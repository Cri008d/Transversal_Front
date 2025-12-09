import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// CORRECCIÓN: Importar useCartContext en lugar de useCart
import { useCartContext } from '../../context/CartContext';

function NavBar() {
  // CORRECCIÓN: Usar el hook correcto
  const { totalItems } = useCartContext(); 
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const to = (path) => {
    navigate(path);
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg" className="navbar-custom-text">
      <Container>
        <Navbar.Brand onClick={() => to("/")} style={{ cursor: 'pointer' }}> 
          🌱Plantita
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => to("/")}>Inicio</Nav.Link>
            <Nav.Link onClick={() => to("/productos")}>Productos</Nav.Link>
            
            {/* ENLACE DE ADMIN (Visible solo si user existe y tiene rol ADMIN) */}
            {user && user.role === 'ADMIN' && (
              <Nav.Link onClick={() => to("/admin/productos")}>Gestión</Nav.Link>
            )}
            
            <Nav.Link onClick={() => to("/blog")}>Blog</Nav.Link>
            <Nav.Link onClick={() => to("/contacto")}>Contacto</Nav.Link>
          </Nav>
          <Nav>
            {/* Lógica de Autenticación */}
            {!user ? (
              <>
                <Nav.Link onClick={() => to("/login")} className="text-white">Login</Nav.Link>
                <Nav.Link onClick={() => to("/register")} className="text-white">Register</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={logout} className="text-white">Logout</Nav.Link>
            )}
            
            {/* Enlace al Carrito */}
            <Nav.Link onClick={() => to("/cart")} className="text-white">
              🛒 Carrito ({totalItems})
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;