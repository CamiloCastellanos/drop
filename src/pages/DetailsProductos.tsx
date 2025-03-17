// src/components/DetailsProductos.tsx

import React from 'react';
import { Home, Download, Heart, Share2 } from 'lucide-react';

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

interface DetailsProductosProps {
  product: Producto;
  onBack: () => void;
}

export function DetailsProductos({ product, onBack }: DetailsProductosProps) {
  // Estado local para la pestaña activa
  const [activeTab, setActiveTab] = React.useState<'detalles' | 'garantias' | 'recursos'>('detalles');

  // Imagen de respaldo (placeholder) si `product.imagen` está vacío
  const placeholderImg = '/img/placeholder-image.png'; // Ajusta a tu ruta
  const imagenFinal = product.imagen || placeholderImg;

  return (
    <div className="space-y-6">
      {/* Migas de pan (breadcrumb) */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:underline">
          <Home size={16} className="mr-1" />
          <span>Todos los productos</span>
        </button>
        <span>/</span>
        <span className="text-gray-500">
          Proveedor: <span className="text-gray-800 font-medium">{product.proveedor}</span>
        </span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.nombre}</span>
      </div>

      {/* Contenedor principal */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-6">
        {/* Imagen cuadrada a la izquierda */}
        <div className="md:w-1/2 flex items-center justify-center">
          <div className="aspect-square w-full max-w-sm rounded-lg overflow-hidden">
            <img
              src={imagenFinal}
              alt={product.nombre}
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        {/* Info a la derecha */}
        <div className="md:w-1/2 space-y-4">
          {/* Encabezado del producto */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                {product.nombre}
              </h2>
              <p className="text-xs text-gray-400">ID: {product.id}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded">
                {product.categoria}
              </span>
            </div>
          </div>

          {/* Tipo de producto (ejemplo) */}
          <p className="text-sm text-gray-400">Tipo de producto: Simple</p>

          {/* Precios */}
          <div className="space-y-1">
            <p className="text-gray-600">
              Precio del proveedor:{' '}
              <span className="font-medium text-gray-800">
                PEN {Number(product.precio_proveedor).toFixed(2)}
              </span>
            </p>
            <p className="text-gray-600">
              Precio sugerido:{' '}
              <span className="font-medium text-gray-800">
                PEN {Number(product.precio_sugerido).toFixed(2)}
              </span>
            </p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              Stock <span className="font-medium text-gray-800">{product.stock}</span>
            </span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
              Stock Privado: 0
            </span>
          </div>

          {/* Botones principales */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Enviar al cliente
            </button>
            <button className="px-4 py-2 bg-orange-100 text-orange-600 rounded hover:bg-orange-200">
              Solicitar muestra
            </button>
          </div>

          {/* Botones de "Descargar", "Favorito", "Compartir" */}
          <div className="flex items-center gap-2 mt-4">
            <button className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 hover:bg-gray-50">
              <Download size={20} className="text-gray-400" />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 hover:bg-gray-50">
              <Heart size={20} className="text-gray-400" />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 hover:bg-gray-50">
              <Share2 size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Info del proveedor / tienda */}
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mt-4">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-800">{product.proveedor} Perú</strong>
            </p>
            <p className="text-sm text-gray-600">Producto disponible en: Ica</p>
            <p className="text-sm text-gray-600">
              Línea comercial:{' '}
              <a href="tel:950073478" className="text-blue-500 hover:underline">
                950073478
              </a>
            </p>
          </div>

          {/* Sección de Tabs */}
          <div className="mt-4">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('detalles')}
                className={`px-4 py-2 text-sm focus:outline-none ${
                  activeTab === 'detalles'
                    ? 'text-orange-600 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Detalles
              </button>
              <button
                onClick={() => setActiveTab('garantias')}
                className={`px-4 py-2 text-sm focus:outline-none ${
                  activeTab === 'garantias'
                    ? 'text-orange-600 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Garantías
              </button>
              <button
                onClick={() => setActiveTab('recursos')}
                className={`px-4 py-2 text-sm focus:outline-none ${
                  activeTab === 'recursos'
                    ? 'text-orange-600 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Recursos adicionales
              </button>
            </div>

            {/* Contenido según la pestaña activa */}
            <div className="p-4 text-sm text-gray-600">
              {activeTab === 'detalles' && (
                <div>
                  <p>No hay descripción disponible para este producto.</p>
                </div>
              )}
              {activeTab === 'garantias' && (
                <div>
                  <p>Este producto no cuenta con garantías específicas.</p>
                </div>
              )}
              {activeTab === 'recursos' && (
                <div>
                  <p>Este producto no cuenta con recursos adicionales.</p>
                </div>
              )}
            </div>
          </div>

          {/* Botón de volver (opcional) */}
          <button
            onClick={onBack}
            className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    </div>
  );
}
