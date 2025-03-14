import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';

// Definimos la interfaz para la cuenta bancaria
interface BankAccount {
  id: number;
  country: string;
  bank: string;
  identification_type: string;
  identification_number: string;
  account_type: string;
  interbank_number: string;
}

export function BankData() {
  const { t } = useTranslation();

  // Modal de agregar cuenta
  const [showModal, setShowModal] = React.useState(false);

  // Campos del formulario
  const [selectedCountry, setSelectedCountry] = React.useState('');
  const [selectedBank, setSelectedBank] = React.useState('');
  const [identificationType, setIdentificationType] = React.useState('');
  const [identificationNumber, setIdentificationNumber] = React.useState('');
  const [accountType, setAccountType] = React.useState('');
  const [accountNumber, setAccountNumber] = React.useState('');

  // Lista de cuentas bancarias
  const [bankAccounts, setBankAccounts] = React.useState<BankAccount[]>([]);

  // Listas de opciones
  const countries = [
    { code: 'PE', name: 'PERU' },
    { code: 'CO', name: 'COLOMBIA' }
  ];

  const banks = {
    PE: ['BCP', 'BBVA', 'Interbank', 'Scotiabank'],
    CO: [
      'ACH COLOMBIA S.A.',
      'AV VILLAS',
      'BANAGRARIO',
      'BANCA DE INVERSIÓN BANCOLOMBIA',
      'BANCAMÍA S.A.',
      'BANCO CAJA SOCIAL',
      'BANCO CORPBANCA',
      'BANCO DE BOGOTá'
    ]
  };

  const identificationTypes = [
    'DNI',
    'Carné de Extranjería',
    'Pasaporte',
    'Cédula de Ciudadanía'
  ];

  const accountTypes = [
    'Cuenta Corriente',
    'Cuenta de Ahorros',
    'Cuenta Maestra'
  ];

  // Función para cargar las cuentas bancarias desde la BD
  const loadBankAccounts = () => {
    const userUUID = localStorage.getItem('user_uuid');
    if (!userUUID) {
      console.error('No se encontró user_uuid en localStorage');
      return;
    }
    fetch(`/api/addbank?user_uuid=${userUUID}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBankAccounts(data);
        } else {
          setBankAccounts([]);
        }
      })
      .catch((err) => {
        console.error('Error al obtener cuentas bancarias:', err);
      });
  };

  // Cargar las cuentas bancarias al montar el componente
  React.useEffect(() => {
    loadBankAccounts();
  }, []);

  // Función para crear una cuenta bancaria en la BD
  const handleAddAccount = () => {
    // Obtenemos user_uuid del localStorage
    const userUUID = localStorage.getItem('user_uuid');
    if (!userUUID) {
      Swal.fire('Error', 'No se encontró user_uuid en localStorage', 'error');
      return;
    }

    // Validar campos
    if (!selectedCountry || !selectedBank || !identificationType || !identificationNumber || !accountType || !accountNumber) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    // Preparar payload
    const payload = {
      country: selectedCountry,              // "PE" o "CO"
      bank: selectedBank,                    // p. ej. "BCP"
      identification_type: identificationType,
      identification_number: identificationNumber,
      account_type: accountType,
      interbank_number: accountNumber,
      user_uuid: userUUID
    };

    // POST /api/addbank
    fetch('/api/addbank', {
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
        // Si se insertó correctamente:
        Swal.fire({
          icon: 'success',
          title: 'Cuenta Bancaria',
          text: 'Se ha agregado la cuenta bancaria exitosamente.',
        });
        // Cerrar modal y recargar cuentas
        setShowModal(false);
        resetForm();
        loadBankAccounts();
      })
      .catch((err) => {
        console.error('Error al insertar cuenta bancaria:', err);
        Swal.fire('Error', 'Ocurrió un error al agregar la cuenta bancaria', 'error');
      });
  };

  // Limpiar campos del formulario
  const resetForm = () => {
    setSelectedCountry('');
    setSelectedBank('');
    setIdentificationType('');
    setIdentificationNumber('');
    setAccountType('');
    setAccountNumber('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Cuentas Bancarias</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} className="mr-2" />
          Agregar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm min-h-[200px]">
        {bankAccounts.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            No hay cuentas bancarias registradas
          </div>
        ) : (
          <div className="p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-2">ID</th>
                  <th className="text-left pb-2">País</th>
                  <th className="text-left pb-2">Banco</th>
                  <th className="text-left pb-2">Tipo Ident.</th>
                  <th className="text-left pb-2">N° Ident.</th>
                  <th className="text-left pb-2">Tipo Cuenta</th>
                  <th className="text-left pb-2">N° Interbancario</th>
                </tr>
              </thead>
              <tbody>
                {bankAccounts.map((acc) => (
                  <tr key={acc.id} className="border-b border-gray-100">
                    <td className="py-2">{acc.id}</td>
                    <td className="py-2">{acc.country}</td>
                    <td className="py-2">{acc.bank}</td>
                    <td className="py-2">{acc.identification_type}</td>
                    <td className="py-2">{acc.identification_number}</td>
                    <td className="py-2">{acc.account_type}</td>
                    <td className="py-2">{acc.interbank_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Bank Account Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add Bank Account</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Country Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedBank('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un país</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bank Selection */}
              {selectedCountry && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Por favor seleccione un banco
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione un banco</option>
                    {banks[selectedCountry as keyof typeof banks].map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Additional Fields (shown when bank is selected) */}
              {selectedBank && (
                <>
                  {/* Identification Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de identificación
                    </label>
                    <select
                      value={identificationType}
                      onChange={(e) => setIdentificationType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione tipo de identificación</option>
                      {identificationTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Identification Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de identificación
                    </label>
                    <input
                      type="text"
                      value={identificationNumber}
                      onChange={(e) => setIdentificationNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de cuenta
                    </label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccione tipo de cuenta</option>
                      {accountTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Account Number (Interbank) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Cuenta Interbancario
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cerrar
              </button>
              <button
                onClick={handleAddAccount}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={
                  !selectedCountry ||
                  !selectedBank ||
                  !identificationType ||
                  !identificationNumber ||
                  !accountType ||
                  !accountNumber
                }
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
