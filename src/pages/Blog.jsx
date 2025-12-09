import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import BlogCard from "../components/organisms/BlogCard";
import blogService from "../data/blog.js"; // Nuevo servicio para el backend

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await blogService.getAll(); // GET /api/v1/blog o /posts
                setPosts(response.data);
            } catch (error) {
                console.error("Error cargando posts del blog:", error);
                // Si falla, al menos muestra un mensaje
                setPosts([]); 
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <Container className="my-5 text-center min-vh-100"><Spinner animation="border" variant="success" /></Container>;

    return (
        <Container className="my-5 min-vh-100">
            <h1 className="mb-5 text-center">Nuestro Blog 🌱</h1>
            {posts.length === 0 ? (
                <Alert variant="info" className="text-center">No hay publicaciones disponibles en este momento.</Alert>
            ) : (
                <Row>
                    {posts.map((post) => (
                        <Col md={4} key={post.id} className="mb-4">
                            {/* Asegúrate que el BlogCard pueda manejar las claves de tu backend (id, title, slug, etc.) */}
                            <BlogCard post={post} /> 
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}