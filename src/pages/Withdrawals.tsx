import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, X } from 'lucide-react';

export function Withdrawals() {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState('');
  const [selectedBank, setSelectedBank] = React.useState('');
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);

  const banks = [
    'Banco de Crédito del Perú',
    'BBVA',
    'Interbank',
    'Scotiabank',
    'Banco de la Nación'
  ];

  const withdrawalHistory = [
    // Add withdrawal history data here if needed
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Retiros de Saldo</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Withdrawal Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto a Retirar
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Bank Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banco
            </label>
            <div className="relative">
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
              >
                <option value="">Seleccionar banco</option>
                {banks.map((bank, index) => (
                  <option key={index} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <button 
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <History size={20} className="mr-2" />
            Historial de Retiros
          </button>

          <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Procesar
          </button>
        </div>
      </div>

      {/* Withdrawal History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Historial de Retiros</h2>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 font-medium text-gray-600">#</th>
                      <th className="pb-3 font-medium text-gray-600">Solicitud</th>
                      <th className="pb-3 font-medium text-gray-600">Fecha de Solicitud</th>
                      <th className="pb-3 font-medium text-gray-600">Fecha de Cierre</th>
                      <th className="pb-3 font-medium text-gray-600">Estado</th>
                      <th className="pb-3 font-medium text-gray-600">Cuenta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalHistory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-gray-500">
                          No hay registros de retiros
                        </td>
                      </tr>
                    ) : (
                      withdrawalHistory.map((withdrawal, index) => (
                        <tr key={index}>
                          {/* Add withdrawal history row data here */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}