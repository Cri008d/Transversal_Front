import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCartContext } from '../../context/CartContext'; // Hook corregido

function NavBar() {
  const { totalItems } = useCartContext(); 
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const to = (path) => {
    navigate(path);
  };

  return (
    // Usamos bg="success" y variant="dark" igual que en Prueba 2
    <Navbar bg="success" variant="dark" expand="lg" className="navbar-custom-text" collapseOnSelect>
      <Container>
        <Navbar.Brand onClick={() => to("/")} style={{ cursor: 'pointer' }}> 
          🌱 Plantita
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => to("/")}>Inicio</Nav.Link>
            <Nav.Link onClick={() => to("/productos")}>Productos</Nav.Link>
            
            {/* Menú de Admin (Solo si corresponde) */}
            {user && user.role === 'ADMIN' && (
              <Nav.Link onClick={() => to("/admin/productos")}>Gestión</Nav.Link>
            )}
            
            <Nav.Link onClick={() => to("/blog")}>Blog</Nav.Link>
            <Nav.Link onClick={() => to("/contacto")}>Contacto</Nav.Link>
          </Nav>
          
          <Nav>
            {!user ? (
              <>
                <Nav.Link onClick={() => to("/login")}>Login</Nav.Link>
                <Nav.Link onClick={() => to("/register")}>Register</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            )}
            
            <Nav.Link onClick={() => to("/cart")}>
              🛒 Carrito ({totalItems})
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;