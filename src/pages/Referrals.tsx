import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, ChevronDown, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface Referral {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  totalOrders: number;
  totalCommission: number;
}

interface CalendarProps {
  onClose: () => void;
  onSelect: (range: { start: string; end: string }) => void;
  initialRange: { start: string; end: string };
}

function Calendar({ onClose, onSelect, initialRange }: CalendarProps) {
  const [selectedMonth, setSelectedMonth] = React.useState(0); // 0 for first month, 1 for second month
  const [selectedRange, setSelectedRange] = React.useState(initialRange);
  const [quickSelect, setQuickSelect] = React.useState('custom');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const generateCalendarDays = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: month - 1,
        year,
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year,
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: '' });
    } else {
      const start = new Date(selectedRange.start);
      const current = new Date(date);
      if (current < start) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
      }
    }
  };

  const handleQuickSelect = (option: string) => {
    setQuickSelect(option);
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (option) {
      case 'last7':
        start = new Date(today.setDate(today.getDate() - 7));
        break;
      case 'last30':
        start = new Date(today.setDate(today.getDate() - 30));
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
    }

    setSelectedRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 w-[700px]">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              quickSelect === 'last7' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleQuickSelect('last7')}
          >
            Últimos 7 Días
          </button>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* First Month */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSelectedMonth(selectedMonth - 1)}>
                <ChevronLeft size={20} />
              </button>
              <span className="font-medium">Jan 2025</span>
              <button onClick={() => setSelectedMonth(selectedMonth + 1)}>
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map(day => (
                <div key={day} className="text-center text-sm text-gray-500 py-1">
                  {day}
                </div>
              ))}
              {generateCalendarDays(0, 2025).map((date, index) => (
                <button
                  key={index}
                  onClick={() => handleDayClick(date.day, date.month, date.year)}
                  className={`
                    p-2 text-sm rounded-lg
                    ${date.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
                    ${
                      selectedRange.start === `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  {date.day}
                </button>
              ))}
            </div>
          </div>

          {/* Second Month */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Feb 2025</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map(day => (
                <div key={day} className="text-center text-sm text-gray-500 py-1">
                  {day}
                </div>
              ))}
              {generateCalendarDays(1, 2025).map((date, index) => (
                <button
                  key={index}
                  onClick={() => handleDayClick(date.day, date.month, date.year)}
                  className={`
                    p-2 text-sm rounded-lg
                    ${date.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
                    ${
                      selectedRange.end === `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  {date.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cerrar
        </button>
        <button
          onClick={() => {
            if (selectedRange.start && selectedRange.end) {
              onSelect(selectedRange);
              onClose();
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={!selectedRange.start || !selectedRange.end}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export function Referrals() {
  const { t } = useTranslation();
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    start: '2025-01-29',
    end: '2025-02-04'
  });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState('Orden Ascendente');
  const [referrals] = React.useState<Referral[]>([]);

  const totalOrders = referrals.reduce((sum, ref) => sum + ref.totalOrders, 0);
  const totalCommissions = referrals.reduce((sum, ref) => sum + ref.totalCommission, 0);

  const formatDateRange = (range: { start: string; end: string }) => {
    return `${range.start.split('-').reverse().join('/')} - ${range.end.split('-').reverse().join('/')}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Mis Referidos</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Date Range Input */}
        <div className="relative flex-grow md:flex-grow-0 md:w-72">
          <input
            type="text"
            value={formatDateRange(dateRange)}
            readOnly
            onClick={() => setShowCalendar(true)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          {showCalendar && (
            <Calendar
              onClose={() => setShowCalendar(false)}
              onSelect={(range) => {
                setDateRange(range);
                setShowCalendar(false);
              }}
              initialRange={dateRange}
            />
          )}
        </div>

        {/* Search Input */}
        <div className="relative flex-grow md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort Order Dropdown */}
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none w-full md:w-48 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          >
            <option>Orden Ascendente</option>
            <option>Orden Descendente</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="space-x-8">
              <span className="text-gray-600">Total Ordenes Referidos: <span className="font-semibold">{totalOrders}</span></span>
              <span className="text-gray-600">Total Comisiones Referidos: <span className="font-semibold">PEN {totalCommissions.toFixed(2)}</span></span>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Download size={20} className="mr-2" />
              Descagar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total de Órdenes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No hay resultados
                    </td>
                  </tr>
                ) : (
                  referrals.map((referral) => (
                    <tr key={referral.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{referral.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{referral.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{referral.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{referral.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{referral.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{referral.totalOrders}</td>
                      <td className="px-6 py-4 whitespace-nowrap">PEN {referral.totalCommission.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800">Ver detalles</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {referrals.length > 0 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <span className="text-gray-600">Página 1 de 1</span>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}