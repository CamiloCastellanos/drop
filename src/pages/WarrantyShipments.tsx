import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck as TruckLoading, Search, Filter, Package, Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '../components/Calendar';

interface Shipment {
  id: string;
  warranty: string;
  destination: string;
  status: string;
  date: string;
  carrier: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const statuses = [
  'PENDIENTE CONFIRMACION',
  'PENDIENTE',
  'GUIA_GENERADA',
  'GUIA_ANULADA',
  'CANCELADO',
  'RECHAZADO',
  'ENTREGADO'
];

const carriers = [
  'URBANO',
  'EVACOURIER',
  'FENIX'
];

const departments = [
  'AMAZONAS',
  'ANCASH',
  'APURIMAC',
  'AREQUIPA',
  'AYACUCHO',
  'CAJAMARCA',
  'CALLAO'
];

function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);
  const [startDate, setStartDate] = React.useState('29/1/2025');
  const [endDate, setEndDate] = React.useState('4/2/2025');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [selectedCarrier, setSelectedCarrier] = React.useState('');
  const [selectedDepartment, setSelectedDepartment] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState('');
  const [dateType, setDateType] = React.useState('FECHA DE CREADO');
  const [searchType, setSearchType] = React.useState('GUIA');
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

        <div className="grid grid-cols-2 gap-6">
          {/* Status and Carrier */}
          <div>
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
          <div>
            <select
              value={selectedCarrier}
              onChange={(e) => setSelectedCarrier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Transportadora</option>
              {carriers.map((carrier) => (
                <option key={carrier} value={carrier}>
                  {carrier}
                </option>
              ))}
            </select>
          </div>

          {/* Date Type Radio Buttons */}
          <div className="col-span-2">
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dateType"
                  value="FECHA DE CREADO"
                  checked={dateType === 'FECHA DE CREADO'}
                  onChange={(e) => setDateType(e.target.value)}
                  className="mr-2"
                />
                FECHA DE CREADO
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dateType"
                  value="FECHA DE CAMBIO DE ESTATUS"
                  checked={dateType === 'FECHA DE CAMBIO DE ESTATUS'}
                  onChange={(e) => setDateType(e.target.value)}
                  className="mr-2"
                />
                FECHA DE CAMBIO DE ESTATUS
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dateType"
                  value="FECHA DE DESPACHADO"
                  checked={dateType === 'FECHA DE DESPACHADO'}
                  onChange={(e) => setDateType(e.target.value)}
                  className="mr-2"
                />
                FECHA DE DESPACHADO
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div className="relative">
            <input
              type="text"
              value={startDate}
              readOnly
              placeholder="29/1/2025"
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
              placeholder="4/2/2025"
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

          {/* Department and City */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Departamento</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Ciudad</option>
              {/* Add city options based on selected department */}
            </select>
          </div>

          {/* Search Type Radio Buttons */}
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-4">
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
                  value="WARRANTY ID"
                  checked={searchType === 'WARRANTY ID'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mr-2"
                />
                WARRANTY ID
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="searchType"
                  value="ORIGINAL ORDER ID"
                  checked={searchType === 'ORIGINAL ORDER ID'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mr-2"
                />
                ORIGINAL ORDER ID
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
            </div>
          </div>

          {/* Search Input */}
          <div className="col-span-2">
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
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export function WarrantyShipments() {
  const { t } = useTranslation();
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [shipments] = React.useState<Shipment[]>([]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Mis Ordenes de Despacho</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar órdenes de despacho..."
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transportista</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No hay resultados
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-primary hover:text-orange-900">
                        <Package size={18} />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{shipment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-primary-light p-2 rounded-lg mr-3">
                          <TruckLoading size={20} className="text-primary" />
                        </div>
                        <span className="font-medium">{shipment.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        shipment.status === 'Entregado' ? 'bg-green-100 text-green-800' : 
                        shipment.status === 'En Tránsito' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{shipment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{shipment.carrier}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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