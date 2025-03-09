import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, FileSpreadsheet, Search } from 'lucide-react';
import { Calendar } from '../components/Calendar';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
  customer: string;
}

export function Invoices() {
  const { t } = useTranslation();
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);
  const [startDate, setStartDate] = React.useState('2025-02-04');
  const [endDate, setEndDate] = React.useState('2025-02-04');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchByInvoiceId, setSearchByInvoiceId] = React.useState(true);
  const [invoices] = React.useState<Invoice[]>([]);

  const formatDate = (date: string) => {
    return date.split('-').reverse().join('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Facturas</h1>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
          <FileSpreadsheet size={20} className="mr-2" />
          Export excel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatDate(startDate)}
                readOnly
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onClick={() => {
                  setShowStartCalendar(true);
                  setShowEndCalendar(false);
                }}
              />
              <CalendarIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                size={20}
                onClick={() => {
                  setShowStartCalendar(true);
                  setShowEndCalendar(false);
                }}
              />
              {showStartCalendar && (
                <div className="absolute z-10">
                  <Calendar
                    onClose={() => setShowStartCalendar(false)}
                    onSelect={(date) => {
                      setStartDate(date);
                      setShowStartCalendar(false);
                    }}
                    selectedDate={startDate}
                  />
                </div>
              )}
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatDate(endDate)}
                readOnly
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onClick={() => {
                  setShowEndCalendar(true);
                  setShowStartCalendar(false);
                }}
              />
              <CalendarIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                size={20}
                onClick={() => {
                  setShowEndCalendar(true);
                  setShowStartCalendar(false);
                }}
              />
              {showEndCalendar && (
                <div className="absolute z-10">
                  <Calendar
                    onClose={() => setShowEndCalendar(false)}
                    onSelect={(date) => {
                      setEndDate(date);
                      setShowEndCalendar(false);
                    }}
                    selectedDate={endDate}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={searchByInvoiceId}
                  onChange={() => setSearchByInvoiceId(true)}
                  className="mr-2"
                />
                ID de factura
              </label>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
            Buscar
          </button>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No hay resultados
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{invoice.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">PEN {invoice.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'Pagada' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{invoice.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800">Ver detalle</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}