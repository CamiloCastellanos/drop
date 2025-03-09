import React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';

export function Profile() {
  const { t } = useTranslation();
  const [phoneCode, setPhoneCode] = React.useState('51');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Datos Personales</h1>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Datos Personales</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-700">Los campos con asterisco(*) son obligatorios</p>
          </div>

          <div className="space-y-6">
            {/* Logo and Image Upload */}
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&q=80"
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                  Cambiar Logo
                </button>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  defaultValue="alexander jesus"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Apellido(s) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido (s) *
                </label>
                <input
                  type="text"
                  defaultValue="nieves montilva"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Email de Contacto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de Contacto *
                </label>
                <input
                  type="email"
                  defaultValue="alexanderjesusnievesmontilva@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <div className="flex space-x-2">
                  <div className="w-24">
                    <select
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="51">🇵🇪 +51</option>
                      <option value="1">🇺🇸 +1</option>
                      <option value="34">🇪🇸 +34</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    defaultValue="944918994"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Direccion *
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Document Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cedula escaneada
                </label>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm flex items-center">
                    <Upload size={16} className="mr-2" />
                    Seleccionar archivo
                  </button>
                  <span className="text-sm text-gray-500">Ningún archivo</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rut (opcional)
                </label>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm flex items-center">
                    <Upload size={16} className="mr-2" />
                    Seleccionar archivo
                  </button>
                  <span className="text-sm text-gray-500">Ningún archivo seleccionado</span>
                </div>
              </div>
            </div>

            {/* Document Verification Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document verification status:
              </label>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                PENDIENTE
              </span>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}