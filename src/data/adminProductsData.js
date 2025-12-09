const adminProductsData = [
    {
        type: "table",
        service: "productos", // Usado por ProductManagement.jsx para saber qué cargar
        title: "Lista de Productos",
        columns: [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'nombreProducto', headerName: 'Nombre', width: 250 },
            { field: 'precioProducto', headerName: 'Precio', width: 150 },
            { field: 'stock', headerName: 'Stock', width: 100 },
            { field: 'categoria', headerName: 'Categoría', width: 200 },
            { 
                field: 'actions', 
                headerName: 'Acciones', 
                width: 150,
                isAction: true, // Indica que este campo contiene botones
            },
        ],
        data: [], // Será llenado dinámicamente al cargar la página
    },
];

export default adminProductsData;