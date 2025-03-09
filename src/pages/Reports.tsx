import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, HelpCircle, Package } from 'lucide-react';
import { Calendar } from '../components/Calendar';

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

export function Reports() {
  const { t } = useTranslation();
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [dateRange, setDateRange] = React.useState('03/02/2025 - 04/02/2025');
  const [products] = React.useState<TopProduct[]>([]);

  const quickDateRanges = [
    { label: 'Hoy', value: 'today' },
    { label: 'Últimos 7 días', value: '7days' },
    { label: 'Últimos 30 días', value: '30days' },
    { label: 'Últimos 90 días', value: '90days' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Informe de productos</h1>
        <div className="relative">
          <input
            type="text"
            value={dateRange}
            readOnly
            className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            onClick={() => setShowCalendar(true)}
          />
          <CalendarIcon
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            size={20}
            onClick={() => setShowCalendar(true)}
          />
          {showCalendar && (
            <div className="absolute right-0 mt-2 z-10">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <Calendar
                  onClose={() => setShowCalendar(false)}
                  onSelect={(date) => {
                    setDateRange(date);
                    setShowCalendar(false);
                  }}
                  selectedDate={dateRange}
                />
                <div className="border-t border-gray-200 mt-4 pt-4">
                  {quickDateRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setDateRange(range.label);
                        setShowCalendar(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-semibold">Top 5 productos más vendidos</h2>
          <HelpCircle size={16} className="text-gray-400" />
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Package size={48} className="mb-4 text-gray-400" />
            <p>No se encontraron datos para este intervalo de fechas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="aspect-square rounded-lg bg-gray-100 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Ventas: <span className="font-medium text-gray-900">{product.sales}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Ingresos: <span className="font-medium text-gray-900">PEN {product.revenue.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}