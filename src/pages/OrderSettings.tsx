import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

export function OrderSettings() {
  const { t } = useTranslation();
  const [addressNormalization, setAddressNormalization] = React.useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Configuración de pedidos</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Validación de direcciones</h2>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Activar normalización de direcciones
            </h3>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Normalización de direcciones</span>
                <div className="group relative">
                  <Info size={16} className="text-gray-400 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    Esta función ayuda a estandarizar las direcciones para la transportadora
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={addressNormalization}
                  onChange={(e) => setAddressNormalization(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <p className="text-gray-600">
              Permitir la normalización de direcciones te ayudara a estandarizarlas para la transportadora
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}