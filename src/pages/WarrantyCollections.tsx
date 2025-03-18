import { RotateCcw, Search, Filter, Calendar } from 'lucide-react';

export function WarrantyCollections() {
  const collections = [
    {
      id: 'REC-001',
      warranty: 'GAR-001',
      address: 'Av. Principal 123, Lima',
      status: 'Programado',
      date: '2024-03-16',
      timeSlot: '09:00 - 12:00'
    },
    {
      id: 'REC-002',
      warranty: 'GAR-002',
      address: 'Jr. Las Flores 456, Miraflores',
      status: 'Completado',
      date: '2024-03-15',
      timeSlot: '14:00 - 17:00'
    },
    {
      id: 'REC-003',
      warranty: 'GAR-003',
      address: 'Calle Los Pinos 789, San Isidro',
      status: 'Pendiente',
      date: '2024-03-17',
      timeSlot: '10:00 - 13:00'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar recolecciones..."
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
          <h2 className="text-lg font-semibold">Recolecciones de Garantías</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Recolección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Garantía</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collections.map((collection, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{collection.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{collection.warranty}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-primary-light p-2 rounded-lg mr-3">
                        <RotateCcw size={20} className="text-primary" />
                      </div>
                      <span className="font-medium">{collection.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{collection.timeSlot}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      collection.status === 'Completado' ? 'bg-green-100 text-green-800' : 
                      collection.status === 'Programado' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {collection.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{collection.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-primary hover:text-orange-900 mr-3">
                      <Calendar size={18} />
                    </button>
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