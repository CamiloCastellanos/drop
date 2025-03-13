import React from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Chrome, AppWindow as Windows, X } from 'lucide-react';

interface SessionItem {
  id: number;
  date_time_login: string;
  browser: string;
  os: string;
}

export function Sessions() {
  const { t } = useTranslation();
  const [sessions, setSessions] = React.useState<SessionItem[]>([]);

  // Función para cerrar sesión de un dispositivo específico
  const handleLogout = (sessionId: number) => {
    console.log("Iniciando proceso de logout para sesión ID:", sessionId);
    Swal.fire({
      title: '¿Está seguro?',
      text: "Se cerrará la sesión de este dispositivo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Enviando solicitud DELETE para la sesión:", sessionId);
        fetch(`/api/sessions/${sessionId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => {
            console.log("Respuesta del logout:", res);
            return res.json();
          })
          .then((data) => {
            console.log("Datos del logout:", data);
            Swal.fire({
              icon: 'success',
              title: 'Sesión cerrada',
              text: 'La sesión ha sido cerrada correctamente.',
            });
            // Actualizamos la lista de sesiones eliminando la que se cerró
            setSessions((prevSessions) =>
              prevSessions.filter((session) => session.id !== sessionId)
            );
          })
          .catch((err) => {
            console.error("Error cerrando sesión:", err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al cerrar la sesión.',
            });
          });
      } else {
        console.log("Logout cancelado por el usuario.");
      }
    });
  };

  // Cargar sesiones desde el servidor
  React.useEffect(() => {
    const userUUID = localStorage.getItem('user_uuid');
    console.log('User UUID obtenido para sesiones:', userUUID);
    if (!userUUID) {
      console.error('No se encontró user_uuid en localStorage');
      return;
    }
    console.log('Iniciando fetch a /api/sessions?user_uuid=' + userUUID);
    fetch(`/api/sessions?user_uuid=${userUUID}`)
      .then((res) => {
        console.log('Respuesta del servidor (sessions):', res);
        return res.json();
      })
      .then((data) => {
        console.log('Datos recibidos para sesiones:', data);
        setSessions(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Error fetching sessions:', err));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Mis Sesiones</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora de Inicio de sesión
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Navegador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sistema Operativo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => {
                console.log('Renderizando sesión:', session);
                return (
                  <tr key={session.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.date_time_login}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Chrome className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-900">{session.browser}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Windows className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-900">{session.os}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleLogout(session.id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <span className="mr-1">Cerrar Sesión</span>
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    No hay sesiones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
