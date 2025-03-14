import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Home } from 'lucide-react';

interface Store {
  id: number;
  name: string;
  categories: string; // Cadena con las categorías separadas por comas
}

export function Suppliers() {
  const [stores, setStores] = useState<Store[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);

  useEffect(() => {
    axios.get('/api/stores')
      .then(response => {
        setStores(response.data);
        setFilteredStores(response.data);
      })
      .catch(error => console.error('Error al obtener las tiendas:', error));
  }, []);

  useEffect(() => {
    // Filtrar tiendas basándose en el nombre
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

      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar tienda..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => {
            // Convertir la cadena de categorías a arreglo de tags
            const tags = store.categories
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag !== '');
            return (
              <div key={store.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{store.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
