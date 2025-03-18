import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Search, Filter, AlertCircle, Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '../components/Calendar';

interface Warranty {
  id: string;
  product: string;
  customer: string;
  status: string;
  date: string;
  type: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const statuses = [
  'APROBADO',
  'RECHAZADO',
  'INDEMNIZADO',
  'PENDIENTE',
  'PENDIENTE REABIERTO',
  'EN PROCESO DE INDEMNIZACION',
  'NO PROCEDE'
];

const products = [
  '273 - Zodiac Eastern Legend Cosplay Doll - voch45',
  '2702 - Zapatos para hombre -',
  '1801 - ZAPATILLAS MICKEY MOUSE LICENCIA OFICIAL',
  '661 - Zapatillas - 20',
  '660 - Zapatillas - 20',
  '562 - YURY -',
  '1640 - xxx - fff'
];

function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [selectedProduct, setSelectedProduct] = React.useState('');
  const [selectedRecollection, setSelectedRecollection] = React.useState('');
  const [searchType, setSearchType] = React.useState('ID DE LA GARANTIA');
  const [searchValue, setSearchValue] = React.useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Filtros</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Estado</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Producto</option>
              {products.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
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
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
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
            </div>
          </div>

          {/* Recollection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recollection
            </label>
            <select
              value={selectedRecollection}
              onChange={(e) => setSelectedRecollection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Recollection</option>
              {/* Add recollection options */}
            </select>
          </div>

          {/* Search Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por:
            </label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="searchType"
                  value="ID DE LA GARANTIA"
                  checked={searchType === 'ID DE LA GARANTIA'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mr-2"
                />
                ID DE LA GARANTIA
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="searchType"
                  value="ID DE LA ORDEN ORIGINAL"
                  checked={searchType === 'ID DE LA ORDEN ORIGINAL'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mr-2"
                />
                ID DE LA ORDEN ORIGINAL
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="searchType"
                  value="NUMERO GUIA NUEVA"
                  checked={searchType === 'NUMERO GUIA NUEVA'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mr-2"
                />
                NUMERO GUIA NUEVA
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="searchType"
                  value="NUMERO GUIA ORIGINAL"
                  checked={searchType === 'NUMERO GUIA ORIGINAL'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mr-2"
                />
                NUMERO GUIA ORIGINAL
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="searchType"
                  value="ID DE LA NUEVA ORDEN"
                  checked={searchType === 'ID DE LA NUEVA ORDEN'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mr-2"
                />
                ID DE LA NUEVA ORDEN
              </label>
            </div>
            <textarea
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Puede obtener varios resultados, separándolos por coma"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export function Warranties() {
  const { t } = useTranslation();
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [warranties] = React.useState<Warranty[]>([]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Garantias disponibles para gestionar</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar garantías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-dark"
          />
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center justify-center px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary"
        >
          <Filter size={20} className="mr-2" />
          Filtros
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <p className="text-red-500 text-sm">
            *las garantias pintadas de rojo son las que se han pasado del tiempo de respuesta por parte del proveedor
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {warranties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No hay resultados
                  </td>
                </tr>
              ) : (
                warranties.map((warranty) => (
                  <tr key={warranty.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{warranty.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-primary-light p-2 rounded-lg mr-3">
                          <Shield size={20} className="text-primary" />
                        </div>
                        <span className="font-medium">{warranty.product}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{warranty.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{warranty.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        warranty.status === 'Aprobada' ? 'bg-green-100 text-green-800' : 
                        warranty.status === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {warranty.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{warranty.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-primary hover:text-orange-900 mr-3">
                        <AlertCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">Mostrar</span>
            <select className="border border-gray-300 rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span className="ml-2">registros de 0</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-2 py-1 rounded hover:bg-gray-100">&lt;</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={() => {
          // Handle filter application
        }}
      />
    </div>
  );
}