import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  proveedor: string;
  precio_proveedor: number;
  precio_sugerido: number;
  stock: number;
  imagen: string;
}

export function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = React.useState<Producto | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Obtener detalles del producto mediante su ID
    fetch(`https://dropi.co.alexcode.org/api/productos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener los detalles del producto');
        }
        return res.json();
      })
      .then((data: Producto) => {
        setProducto(data);
      })
      .catch((err) => console.error("Error fetching product details:", err));
  }, [id]);

  if (!producto) {
    return <div className="p-6 text-gray-600">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">{producto.nombre}</h1>
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-600 hover:text-gray-800"
          title="Volver"
        >
          <X size={24} />
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagen grande del producto */}
        <div className="md:w-1/2">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        {/* Especificaciones del producto */}
        <div className="md:w-1/2 space-y-4">
          <p>
            <strong>Categoría:</strong> {producto.categoria}
          </p>
          <p>
            <strong>Proveedor:</strong> {producto.proveedor}
          </p>
          <p>
            <strong>Precio proveedor:</strong> PEN {Number(producto.precio_proveedor).toFixed(2)}
          </p>
          <p>
            <strong>Precio sugerido:</strong> PEN {Number(producto.precio_sugerido).toFixed(2)}
          </p>
          <p>
            <strong>Stock:</strong> {producto.stock}
          </p>
          {/* Agrega aquí más especificaciones si las requieres */}
        </div>
      </div>
    </div>
  );
}
