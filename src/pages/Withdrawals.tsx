import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, X } from 'lucide-react';
import Swal from 'sweetalert2';

interface Withdrawal {
  id: number;
  monto: number;
  banco: string;
  numero_solicitud: string;
  fecha_solicitud: string;   // Vendrá como string desde el servidor
  fecha_cierre: string | null;
  estado: string;
  cuenta: string;
}

export function Withdrawals() {
  const { t } = useTranslation();

  // Estados del formulario
  const [amount, setAmount] = React.useState('');
  const [selectedBank, setSelectedBank] = React.useState('');
  const [account, setAccount] = React.useState(''); // Nuevo campo para la cuenta bancaria

  // Control del modal de historial
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);

  // Lista de retiros
  const [withdrawalHistory, setWithdrawalHistory] = React.useState<Withdrawal[]>([]);

  // Bancos disponibles
  const banks = [
    'Banco de Crédito del Perú',
    'BBVA',
    'Interbank',
    'Scotiabank',
    'Banco de la Nación'
  ];

  // Función para cargar el historial de retiros (GET /api/retiros)
  const loadWithdrawals = () => {
    const userUUID = localStorage.getItem('user_uuid');
    if (!userUUID) {
      console.error('No se encontró user_uuid en localStorage');
      return;
    }
    fetch(`https://dropi.co.alexcode.org/api/retiros?user_uuid=${userUUID}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setWithdrawalHistory(data);
        } else {
          setWithdrawalHistory([]);
        }
      })
      .catch((err) => {
        console.error('Error al obtener retiros:', err);
      });
  };

  // Al hacer clic en "Procesar"
  const handleProcess = () => {
    const userUUID = localStorage.getItem('user_uuid');
    if (!userUUID) {
      Swal.fire('Error', 'No se encontró user_uuid en localStorage', 'error');
      return;
    }

    // Validar campos
    if (!amount || !selectedBank || !account) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    // Crear el payload
    const payload = {
      monto: amount,
      banco: selectedBank,
      cuenta: account,
      user_uuid: userUUID
    };

    // Llamar a POST /api/retiros
    fetch('https://dropi.co.alexcode.org/api/retiros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          Swal.fire('Error', data.error, 'error');
          return;
        }
        // Si todo OK, mostrar sweetalert de éxito
        Swal.fire({
          icon: 'success',
          title: 'Retiro Procesado',
          text: `Tu solicitud #${data.numeroSolicitud} se ha creado con éxito.`,
        });

        // Limpiar campos
        setAmount('');
        setSelectedBank('');
        setAccount('');

        // Opcional: Recargar la lista para que aparezca en el historial
        loadWithdrawals();
      })
      .catch((err) => {
        console.error('Error al crear retiro:', err);
        Swal.fire('Error', 'Ocurrió un error al procesar el retiro', 'error');
      });
  };

  // Al hacer clic en "Historial de Retiros"
  const handleShowHistory = () => {
    loadWithdrawals();
    setShowHistoryModal(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Retiros de Saldo</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Account (nuevo campo) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuenta
            </label>
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Número de cuenta"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <button 
            onClick={handleShowHistory}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <History size={20} className="mr-2" />
            Historial de Retiros
          </button>

          <button
            onClick={handleProcess}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
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
                        <tr key={withdrawal.id}>
                          <td className="py-2">{withdrawal.id}</td>
                          <td className="py-2">{withdrawal.numero_solicitud}</td>
                          <td className="py-2">{withdrawal.fecha_solicitud || '-'}</td>
                          <td className="py-2">{withdrawal.fecha_cierre || '-'}</td>
                          <td className="py-2">{withdrawal.estado}</td>
                          <td className="py-2">{withdrawal.cuenta}</td>
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
