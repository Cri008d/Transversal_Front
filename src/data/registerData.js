import React from 'react';
import { Link } from 'react-router-dom'; 

const registerData = [
    {
        type: "text",
        text: [
            {
                content: "Crear Cuenta",
                variant: "h2",
                className: "text-center mb-4",
            }
        ]
    },
    {
        type: "inputs",
        inputs: [
            {
                label: "Nombre completo",
                type: "text",
                name: "nombre",
                required: true,
                autoComplete: "name",
            },
            {
                label: "Correo Electrónico",
                type: "email",
                name: "correo",
                required: true,
                autoComplete: "email",
            },
            {
                label: "Dirección",
                type: "text",
                name: "direccion",
                required: true,
                autoComplete: "shipping-street-address",
            },
            {
                label: "Contraseña",
                type: "password",
                name: "contrasena",
                required: true,
                autoComplete: "new-password",
            },
            // Añadimos la confirmación de contraseña, esencial para un buen registro
            {
                label: "Confirmar Contraseña",
                type: "password",
                name: "confirmarContrasena", 
                required: true,
                autoComplete: "new-password",
            },
        ],
        className: ""
    },
    { 
        type: "button",
        text: "Registrarse",
        className: "btn-block", 
    },
    {
        type: "text",
        text: [
            {
                content: (
                    <Link to="/login" className="text-primary d-block mt-3">
                        Ya tengo un usuario
                    </Link>
                ),
                variant: "p",
                className: "text-center text-sm",
            },
        ],
    },
];

export default registerData;