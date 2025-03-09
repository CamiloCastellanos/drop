import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Download, ArrowRightLeft, Search, ChevronDown } from 'lucide-react';
import { Calendar } from '../components/Calendar';

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  previousAmount: number;
  description: string;
  user: string;
}

const transactionTypes = [
  'ENTRADA',
  'SALIDA'
];

const transactionCodes = [
  'SALIDA POR NUEVA ORDEN',
  'ENTRADA POR CAMBIO DE ESTATUS',
  'ENTRADA POR GANANCIA EN LA ORDEN COMO DROPSHIPPER',
  'ENTRADA POR GANANCIA EN LA ORDEN COMO PROVEEDOR',
  'DEVOLUCION DE FLETE ORDEN ENTREGADA',
  'PAGO POR COMISION DE REFERIDOS',
  'DEVOLUCION DE FLETE POR ENTREGA NO EFECTIVA'
];

export function PortfolioHistory() {
  const { t } = useTranslation();
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);
  const [startDate, setStartDate] = React.useState('2025-02-04');
  const [endDate, setEndDate] = React.useState('2025-02-04');
  const [selectedType, setSelectedType] = React.useState('');
  const [selectedCode, setSelectedCode] = React.useState('');
  const [transactionId, setTransactionId] = React.useState('');
  const [transactions] = React.useState<Transaction[]>([]);

  const formatDate = (date: string) => {
    return date.split('-').reverse().join('/');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Historial de Cartera</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Date and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Start Date */}
          <div className="relative">
            <input
              type="text"
              value={formatDate(startDate)}
              readOnly
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              onClick={() => {
                setShowStartCalendar(!showStartCalendar);
                setShowEndCalendar(false);
              }}
            />
            <CalendarIcon 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
              size={20}
              onClick={() => {
                setShowStartCalendar(!showStartCalendar);
                setShowEndCalendar(false);
              }}
            />
            {showStartCalendar && (
              <Calendar
                onClose={() => setShowStartCalendar(false)}
                onSelect={(date) => {
                  setStartDate(date);
                  setShowStartCalendar(false);
                }}
                selectedDate={startDate}
              />
            )}
          </div>

          {/* End Date */}
          <div className="relative">
            <input
              type="text"
              value={formatDate(endDate)}
              readOnly
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              onClick={() => {
                setShowEndCalendar(!showEndCalendar);
                setShowStartCalendar(false);
              }}
            />
            <CalendarIcon 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
              size={20}
              onClick={() => {
                setShowEndCalendar(!showEndCalendar);
                setShowStartCalendar(false);
              }}
            />
            {showEndCalendar && (
              <Calendar
                onClose={() => setShowEndCalendar(false)}
                onSelect={(date) => {
                  setEndDate(date);
                  setShowEndCalendar(false);
                }}
                selectedDate={endDate}
              />
            )}
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Filtrar por tipo</option>
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Code and Transaction ID Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <select
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Filtrar por código</option>
              {transactionCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="id de transacción"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            <ArrowRightLeft size={20} className="mr-2" />
            Transferencia entre wallets
          </button>
          <div className="flex-1 flex justify-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <td className="px-6 py-4 text-sm text-gray-500" colSpan={2}>Total</td>
                <td className="px-6 py-4 font-medium" colSpan={6}>PEN 0,00</td>
              </tr>
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No hay resultados
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}