import React from 'react';
/**
 * Componente DynamicTable reutilizable.
 * Muestra datos en formato de tabla, configurando columnas y contenido dinámicamente.
 * * @param {Array<Object>} data - El array de objetos a renderizar como filas.
 * @param {Array<Object>} columns - La definición de las columnas y cómo acceder a los datos.
 * Ejemplo: [{ header: 'Nombre', accessor: 'name' }, { header: 'Edad', accessor: 'age' }]
 * @param {Function} onRowClick - Función opcional para manejar el clic en una fila.
 */
function DynamicTable({ data = [], columns = [], onRowClick }) {
    
    // Si no hay datos, muestra un mensaje
    if (data.length === 0) {
        return (
            <div className="alert alert-info" role="alert">
                No hay datos para mostrar en esta tabla.
            </div>
        );
    }

    const tableClasses = "table table-striped table-bordered table-hover responsive";

    return (
        // Utilizamos la clase 'table' de Bootstrap para el estilo
        <table className={tableClasses}>
            <thead>
                <tr>
                    {/* Renderiza los encabezados usando el array 'columns' */}
                    {columns.map((column, index) => (
                        <th key={index}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {/* Itera sobre cada objeto en el array 'data' para crear las filas */}
                {data.map((item, rowIndex) => (
                    <tr 
                        key={rowIndex} 
                        // Añade interactividad si se proporciona onRowClick
                        onClick={onRowClick ? () => onRowClick(item) : undefined}
                        className={onRowClick ? 'cursor-pointer' : ''}
                    >
                        {/* Itera sobre el array 'columns' para obtener el valor de cada celda */}
                        {columns.map((column, colIndex) => {
                            // 1. Accede al valor usando el 'accessor' (nombre de la clave del objeto)
                            const cellValue = item[column.accessor];
                            
                            // 2. Si existe un 'render' personalizado en la columna, úsalo
                            // Esto es útil para botones, fechas formateadas, o enlaces.
                            if (column.render) {
                                return (
                                    <td key={colIndex}>
                                        {column.render(item)} {/* Pasa el objeto completo de la fila */}
                                    </td>
                                );
                            }

                            // 3. Renderizado por defecto del valor
                            return (
                                <td key={colIndex}>
                                    {cellValue}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DynamicTable;