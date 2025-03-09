import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown } from 'lucide-react';

interface Cart {
  id: string;
  name: string;
  lastName: string;
  store: string;
  phone: string;
  email: string;
  department: string;
  city: string;
  date: string;
  recovered: boolean;
}

export function AbandonedCarts() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState('Todos');
  const [carts] = React.useState<Cart[]>([]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Carritos abandonados</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <button
              className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center"
            >
              {selectedFilter}
              <ChevronDown size={20} className="ml-2" />
            </button>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tienda</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recuperado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                    No hay resultados
                  </td>
                </tr>
              ) : (
                carts.map((cart) => (
                  <tr key={cart.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{cart.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cart.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cart.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cart.store}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cart.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cart.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cart.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cart.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cart.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cart.recovered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cart.recovered ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800">Ver detalles</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1 of 0</span>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded hover:bg-gray-100">&lt;</button>
            <button className="p-1 rounded hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}