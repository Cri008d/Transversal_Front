import React from 'react';

const CheckoutSummary = ({ items, total }) => {
    return (
        <div className="bg-white p-6 shadow-xl rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
            
            <ul className="space-y-2 border-b pb-4 mb-4">
                {items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm text-gray-600">
                        <span className="truncate pr-2">{item.nombreProducto} ({item.cantidad})</span>
                        <span>${(item.precioProducto * item.cantidad).toFixed(2)}</span>
                    </li>
                ))}
            </ul>

            <div className="flex justify-between text-lg font-semibold border-t pt-4">
                <span>Total a Pagar:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default CheckoutSummary;