import { Package, Search, Filter } from 'lucide-react';

export function Products() {
  const products = [
    { name: 'Laptop Gaming Pro', price: 'S/. 4,999.00', stock: 12, category: 'Electrónicos' },
    { name: 'Smartphone X12', price: 'S/. 2,499.00', stock: 25, category: 'Móviles' },
    { name: 'Auriculares Bluetooth', price: 'S/. 299.00', stock: 50, category: 'Accesorios' },
    { name: 'Monitor 4K 32"', price: 'S/. 1,999.00', stock: 8, category: 'Electrónicos' },
    { name: 'Teclado Mecánico', price: 'S/. 399.00', stock: 30, category: 'Accesorios' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-dark"
          />
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary">
          <Filter size={20} className="mr-2" />
          Filtros
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Lista de Productos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-primary-light p-2 rounded-lg mr-3">
                        <Package size={20} className="text-primary" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 20 ? 'bg-green-100 text-green-800' : 
                      product.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-primary hover:text-orange-900">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}