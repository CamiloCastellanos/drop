import React from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Phone, AlertTriangle } from 'lucide-react';

export function StoreSettings() {
  const { t } = useTranslation();
  const affiliateLink = 'https://app.dropi.pe/auth/register?afl=23786';
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Configuración de tienda</h1>

      {/* Store Configuration Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700">Los campos con asterisco(*) son obligatorios</p>
          </div>

          <div className="space-y-6">
            {/* Store Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la tienda
                </label>
                <input
                  type="text"
                  placeholder="Nombre de la tienda"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue=""
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  readOnly
                />
              </div>
            </div>

            {/* Store URL and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Url
                </label>
                <input
                  type="text"
                  placeholder="Url de la Tienda"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono de la tienda
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Teléfono de la tienda"
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  />
                </div>
              </div>
            </div>

            {/* Affiliate Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link de Afiliado:
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{affiliateLink}</span>
                <button
                  onClick={() => copyToClipboard(affiliateLink)}
                  className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Copiar
                </button>
              </div>
            </div>

            {/* Default Order Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado por defecto de nueva orden:
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark">
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="PROCESANDO">PROCESANDO</option>
                <option value="COMPLETADO">COMPLETADO</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Data Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Datos de autenticación</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700">Los campos con asterisco(*) son obligatorios</p>
          </div>

          <div className="space-y-6">
            {/* Authentication Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de autenticación
                </label>
                <input
                  type="email"
                  placeholder="Email de autenticación"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono de autenticación
                </label>
                <div className="flex space-x-2">
                  <select
                    defaultValue="57"
                    className="w-24 px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  >
                    <option value="57">🇨🇴 57</option>
                    <option value="51">🇵🇪 51</option>
                    <option value="1">🇺🇸 1</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Número de teléfono"
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Guardar autenticación
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Eliminar cuenta</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="text-red-600 mt-0.5 mr-3" size={20} />
              <div>
                <p className="text-red-700 font-medium mb-1">¡Advertencia! Esta acción es irreversible</p>
                <p className="text-red-600">
                  Al eliminar tu cuenta, perderás acceso a todos tus datos, historial de transacciones y configuraciones. 
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              Eliminar mi cuenta
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700">
                Por favor, escribe "ELIMINAR" para confirmar que deseas eliminar tu cuenta:
              </p>
              <input
                type="text"
                placeholder="Escribe ELIMINAR"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex space-x-4">
                <button
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirmar eliminación
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}