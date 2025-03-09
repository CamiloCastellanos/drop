import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, FileText, Filter, Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '../components/Calendar';

interface Order {
  id: string;
  productName: string;
  orderDate: string;
  customer: string;
  status: string;
  carrier: string;
  warehouse: string;
  shippingType: string;
  label: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [showStartCalendar, setShowStartCalendar] = React.useState(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState(false);
  const [startDate, setStartDate] = React.useState('4/2/2025');
  const [endDate, setEndDate] = React.useState('10/2/2025');
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* First Column */}
          <div className="space-y-4">
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Estado</option>
              </select>
            </div>
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Transportadora</option>
              </select>
            </div>
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Departamento</option>
              </select>
            </div>
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Etiqueta</option>
              </select>
            </div>
          </div>

          {/* Second Column */}
          <div className="space-y-4">
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Validación de direcciones</option>
              </select>
            </div>
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Seller</option>
              </select>
            </div>
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Ciudad</option>
              </select>
            </div>
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Producto</option>
              </select>
            </div>
          </div>

          {/* Third Column */}
          <div className="space-y-4">
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Integration</option>
              </select>
            </div>
            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Invoiced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date Type Radio Buttons */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center space-x-6">
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
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={startDate}
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

          <div className="relative">
            <input
              type="text"
              value={endDate}
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

        {/* Checkboxes */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <input type="checkbox" id="warranty" className="mr-2" />
            <label htmlFor="warranty">Ordenes de garantía</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="indemnified" className="mr-2" />
            <label htmlFor="indemnified">Ordenes Indemnizadas</label>
          </div>
        </div>

        {/* Search Type Radio Buttons */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <label className="flex items-center">
            <input
              type="radio"
              name="searchType"
              value="ORDEN ID INTEGRACION"
              checked={searchType === 'ORDEN ID INTEGRACION'}
              onChange={(e) => setSearchType(e.target.value)}
              className="mr-2"
            />
            ORDEN ID INTEGRACION
          </label>
        </div>

        {/* Search Input */}
        <div className="mt-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Puede obtener varios resultados, separándolos por coma"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
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

export function Orders() {
  const { t } = useTranslation();
  const [showActionsDropdown, setShowActionsDropdown] = React.useState(false);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedOrders, setSelectedOrders] = React.useState<string[]>([]);
  const [orders] = React.useState<Order[]>([]);

  const actionItems = [
    { icon: FileText, text: 'Carga masiva de órdenes', action: () => {} },
    { icon: FileText, text: 'Formato de órdenes Masivas', action: () => {} },
    { icon: FileText, text: 'Ciudades Con Recaudo', action: () => {} },
    { icon: FileText, text: 'Órdenes (Una orden por fila)', action: () => {} },
    { icon: FileText, text: 'Órdenes con Productos (Un producto por fila)', action: () => {} }
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Mis Pedidos</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 flex justify-between items-center">
          <div className="relative">
            <button
              onClick={() => setShowActionsDropdown(!showActionsDropdown)}
              className="px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center"
            >
              Acciones
              <ChevronDown size={20} className="ml-2" />
            </button>

            {showActionsDropdown && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 py-2">
                {actionItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setShowActionsDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                  >
                    <item.icon size={20} className="mr-2 text-gray-500" />
                    {item.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Filter size={20} className="mr-2" />
              Filtros
            </button>

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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de la orden</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus de la Orden</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transportadora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bodega</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Envío</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etiqueta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                    No hay resultados
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.carrier}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.warehouse}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.shippingType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.label}</td>
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