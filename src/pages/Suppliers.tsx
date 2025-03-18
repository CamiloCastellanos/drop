// src/pages/Suppliers.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Home } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  categories: string;  // Cadena con categorías separadas por comas
  imagen?: string;     // Se almacena el nombre o la ruta de la imagen (logo)
  user_uuid?: string;
  productCount?: number;
}

export function Suppliers() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Obtener las tiendas desde el backend
    axios.get('https://dropi.co.alexcode.org/api/stores')
      .then(async (response) => {
        const rawStores: Store[] = response.data;
        // Enriquecer cada tienda con la cantidad de productos
        const enrichedStores = await Promise.all(
          rawStores.map(async (st) => {
            if (!st.user_uuid) {
              return { ...st, productCount: 0 };
            }
            try {
              const resProducts = await axios.get(`https://dropi.co.alexcode.org/api/productos?user_uuid=${st.user_uuid}`);
              const productCount = Array.isArray(resProducts.data)
                ? resProducts.data.length
                : 0;
              return { ...st, productCount };
            } catch (err) {
              console.error('Error obteniendo productos para tienda', st.id, err);
              return { ...st, productCount: 0 };
            }
          })
        );
        setStores(enrichedStores);
        setFilteredStores(enrichedStores);
      })
      .catch(error => {
        console.error('Error al obtener las tiendas:', error);
      });
  }, []);

  // Filtrar tiendas en función de la búsqueda
  useEffect(() => {
    const filtered = stores.filter(store =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [searchQuery, stores]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Home size={16} />
        <span>/</span>
        <span>Todas las tiendas</span>
      </div>

      {/* Input de búsqueda */}
      <div className="relative w-full md:w-96">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar tienda..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Grid de tiendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => {
            // Convertir la cadena de categorías a arreglo de tags
            const tags = store.categories
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag !== '');

            // Mostrar solo las tres primeras etiquetas y contar el resto
            const visibleTags = tags.slice(0, 3);
            const extraTagCount = tags.length - visibleTags.length;

            return (
              <div
                key={store.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  {/* Mostrar el logo de la tienda utilizando el campo 'imagen' */}
                  {store.imagen ? (
                    <img
                      src={store.imagen}
                      alt={store.name}
                      className="w-16 h-16 object-cover rounded-full mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center text-gray-500">
                      Logo
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">{store.name}</h3>
                    {/* Mostrar cantidad de productos */}
                    <p className="text-sm text-gray-500">
                      {store.productCount} productos
                    </p>
                  </div>
                </div>

                {/* Mostrar categorías como tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {visibleTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {extraTagCount > 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      +{extraTagCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No hay tiendas disponibles.</p>
        )}
      </div>
    </div>
  );
}
