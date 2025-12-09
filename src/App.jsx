import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import NavBar from './components/organisms/NavBar';
import Footer from './components/organisms/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import UserHome from './pages/UserHome'; 
import ProductDetails from './pages/ProductDetails'; 
import Cart from './pages/Cart'; 
import Blog from './pages/Blog'; 
import HomeAdmin from './pages/admin/HomeAdmin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <main className="flex-grow-1">
              <Routes>
                 {/*rutas Prublicas*/}
                 <Route path="/" element={<Home />} />
                 <Route path="/register" element={<Register />} />
                 <Route parh="/login" element={<Login />} />

                 {/*Ruta de catalogo*/}
                 <Route path="/products" element={<UserHome />} />
                 <Route path="/products/:id" element={<ProductDetails />} />

                 {/* rutas de flujo de compra */}
                 <Route path="/cart" element={<Cart />} />
                 <Route path="/checkout" element={<h1 className="p-10 text-center">Pagina checkout pendiente</h1>} />
                 
                 {/*Rutas de infotrmacion */}
                 <Route path="/blog" element={<Blog />} />
                 <Route path="/contacto" element={<h1 className="p-10 text-center">Pagina de contacto pendiente</h1>} />

                 {/*Rutas administrativas */}
                 <Route path="/admin/dashboard" element={<HomeAdmin />} />
                 <Route path="/admin/productos" element={<h1 className="p-10 text-center">Pagina de gestion de productos pendiente</h1>} />
                  {/*404 debe ir al final, no cambiar */}
                 <Route path="*" element={<h1 classname="text-center p-10">Página no encontrada</h1>} />

              </Routes>
            </main>
            <Footer />

          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;