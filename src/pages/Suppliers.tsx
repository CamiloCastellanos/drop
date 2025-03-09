import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Home } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  productCount: number;
  categories: string[];
  image: string;
}

export function Suppliers() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProvider, setSelectedProvider] = React.useState('');

  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'Romidaniela',
      productCount: 1,
      categories: ['Deportes'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80'
    },
    {
      id: '2',
      name: 'Julia Leoniza',
      productCount: 3,
      categories: ['Belleza'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80'
    },
    {
      id: '3',
      name: 'Joel Joseph',
      productCount: 1,
      categories: ['Hogar'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80'
    },
    {
      id: '4',
      name: 'Import Envios',
      productCount: 4,
      categories: ['Bebés', 'Belleza', 'Cocina', 'Hogar'],
      image: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=100&h=100&q=80'
    },
    {
      id: '5',
      name: 'Jham Carlos',
      productCount: 1,
      categories: ['Hogar', 'Juguetes'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80'
    },
    {
      id: '6',
      name: 'Zato Shop',
      productCount: 46,
      categories: ['Automóviles', 'Bebés', 'Belleza'],
      image: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=100&h=100&q=80'
    },
    {
      id: '7',
      name: 'Jhon Anthony',
      productCount: 1,
      categories: ['Belleza'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80'
    },
    {
      id: '8',
      name: 'Nibresma',
      productCount: 6,
      categories: ['Belleza', 'Hogar', 'Otro', 'Salud'],
      image: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=100&h=100&q=80'
    },
    {
      id: '9',
      name: 'Shoppedi2',
      productCount: 7,
      categories: ['Belleza', 'Hogar', 'Salud'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80'
    },
    {
      id: '10',
      name: 'Sandro',
      productCount: 2,
      categories: ['Deportes', 'Juguetes', 'Otro', 'Salud'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80'
    },
    {
      id: '11',
      name: 'Evelyn Yen',
      productCount: 2,
      categories: ['Belleza', 'Mascotas'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80'
    },
    {
      id: '12',
      name: 'Juan Cristobal',
      productCount: 1,
      categories: ['Cocina', 'Tecnología'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&q=80'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Home size={16} />
        <span>/</span>
        <span>Todos los productos</span>
        <span>/</span>
        <span className="text-gray-900">Proveedores</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-48">
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Proveedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center mb-4">
              <img
                src={supplier.image}
                alt={supplier.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                <p className="text-sm text-gray-500">{supplier.productCount} Productos</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {supplier.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}