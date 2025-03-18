import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Download, ArrowRightLeft, Search } from 'lucide-react';

export function Wallet() {
  const { t } = useTranslation();
  const [startDate, setStartDate] = React.useState('2024-04-02');
  const [endDate, setEndDate] = React.useState('2024-04-02');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Historial de Cartera</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Start Date */}
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* End Date */}
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Type Filter */}
          <div>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark appearance-none bg-white">
              <option value="">Filtrar por tipo</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
        </div>

        {/* Code and Transaction ID Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark appearance-none bg-white">
            <option value="">Filtrar por código</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="id de transacción"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-blue-500 text-white rounded">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 space-y-2">
          <p className="text-blue-700">
            Tenga en cuenta que las órdenes SIN RECAUDO, solo tienen un movimiento de SALIDA cuando se crea la orden, y es: Costo del envío + comisión de la plataforma + Precio del producto del Proveedor.
          </p>
          <p className="text-blue-700">
            Las Órdenes SIN RECAUDO, no generan transacción de ENTRADA, ya que el dinero ya lo tiene el usuario cuando hizo la orden.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Download size={20} className="mr-2" />
            Descargar en Excel
          </button>
          <button className="flex items-center px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary">
            <ArrowRightLeft size={20} className="mr-2" />
            Transferencia entre wallets
          </button>
          <div className="flex-1 flex justify-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Previo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500" colSpan={7}>Total</td>
                <td className="px-6 py-4 font-medium">PEN 0,00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500 text-center" colSpan={8}>No hay resultados</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}