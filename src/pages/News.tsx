import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, History, Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '../components/Calendar';

interface News {
  id: string;
  date: string;
  data: string;
}

export function News() {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = React.useState(false);
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDepartment, setSelectedDepartment] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState('');
  const [selectedStore, setSelectedStore] = React.useState('');
  const [selectedCarrier, setSelectedCarrier] = React.useState('URBANO');
  const [searchType, setSearchType] = React.useState('GUIA');
  const [news] = React.useState<News[]>([]);

  const carriers = ['URBANO', 'EVACOURIER', 'FENIX'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Novedades</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center"
            >
              Acciones
              <ChevronDown size={20} className="ml-2" />
            </button>

            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <History size={20} className="mr-2" />
              Ir al Historial de Novedades
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

        {showFilters && (
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Departamento</option>
                <option value="AMAZONAS">AMAZONAS</option>
                <option value="ANCASH">ANCASH</option>
                <option value="APURIMAC">APURIMAC</option>
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Ciudad</option>
              </select>

              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tienda</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="GUIA"
                    checked={searchType === 'GUIA'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="mr-2"
                  />
                  GUIA
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="ORDEN ID"
                    checked={searchType === 'ORDEN ID'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="mr-2"
                  />
                  ORDEN ID
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="CELULAR"
                    checked={searchType === 'CELULAR'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="mr-2"
                  />
                  CELULAR
                </label>
              </div>

              <textarea
                placeholder="Puede obtener varios resultados, separándolos por coma"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={startDate}
                  readOnly
                  placeholder="Desde"
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

              <div className="relative">
                <input
                  type="text"
                  value={endDate}
                  readOnly
                  placeholder="Hasta"
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

              <select
                value={selectedCarrier}
                onChange={(e) => setSelectedCarrier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {carriers.map((carrier) => (
                  <option key={carrier} value={carrier}>
                    {carrier}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Novedad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No hay resultados
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.data}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800">Ver detalles</button>
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