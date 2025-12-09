import React from 'react';

const loginData = [
    {
        type: "text",
        text: [
            {
                content: "Iniciar Sesión",
                variant: "h2",
                className: "text-center mb-4",
            }
        ]
    },
    {
        type: "inputs",
        inputs: [
            {
                label: "Correo Electrónico",
                type: "email",
                name: "correo",
                required: true,
                autoComplete: "email",
            },
            {
                label: "Contraseña",
                type: "password",
                name: "contrasena", 
                required: true,
                autoComplete: "current-password",
            },
        ],
        className: "" // Usamos las clases del Forms.jsx
    },
    {           
        type: "button",
        text: "Ingresar",
        className: "btn-block", 
    },
    {
        type: "text",
        text: [
            {
                content: (
                    <Link href="/register" className="text-primary d-block mt-3">
                        Crear usuario
                    </Link>
                ),
                variant: "p",
                className: "text-center text-sm",
            },
        ],
    },
];

export default loginData;