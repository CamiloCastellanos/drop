import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Trash2, UserCircle2 } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface Label {
  id: string;
  color: string;
  name: string;
  createdBy: string;
}

export function Labels() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [color, setColor] = React.useState("#ff0000");
  const [labelName, setLabelName] = React.useState('');
  const [labels] = React.useState<Label[]>([
    {
      id: '1',
      color: '#ff0000',
      name: 'hola',
      createdBy: 'alexander jesus nieves montilva'
    },
    {
      id: '2',
      color: '#00ff00',
      name: 'test',
      createdBy: 'alexander jesus nieves montilva'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle label creation
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Etiquetas</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
          >
            <span className="mr-2">+</span>
            Nueva Etiqueta
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etiqueta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Etiqueta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado Por</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {labels.map((label) => (
                <tr key={label.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{label.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: label.color }} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{label.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{label.createdBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <UserCircle2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Label Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Agregar Etiqueta</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Etiqueta
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded" style={{ backgroundColor: color }} />
                    <HexColorPicker color={color} onChange={setColor} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Etiqueta
                  </label>
                  <input
                    type="text"
                    value={labelName}
                    onChange={(e) => setLabelName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-green-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Exito...</h3>
            <p className="text-gray-600">Registro guardado con éxito</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}