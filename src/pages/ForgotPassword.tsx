import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

export function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email.trim()) {
        throw new Error('Por favor ingrese su correo electrónico');
      }

      await forgotPassword(email);
      setSuccess(true);
      
      // En un entorno real, aquí se enviaría un correo con el enlace de restablecimiento
      // Para fines de demostración, mostramos un mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: 'Solicitud enviada',
        text: 'Si el correo existe en nuestra base de datos, recibirás instrucciones para restablecer tu contraseña.',
        confirmButtonText: 'Entendido'
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Error al procesar la solicitud';
      setError(errorMessage);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Recuperar Contraseña</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.
          </p>
        </div>

        {success ? (
          <div className="mt-8 space-y-6">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Solicitud enviada</h3>
                  <p className="mt-2 text-sm text-green-700">
                    Si el correo existe en nuestra base de datos, recibirás instrucciones para restablecer tu contraseña.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link to="/login" className="inline-flex items-center text-orange-600 hover:text-orange-500">
                <ArrowLeft size={16} className="mr-2" />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingrese su correo electrónico"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
              </button>
            </div>

            <div className="text-center">
              <Link to="/login" className="inline-flex items-center text-orange-600 hover:text-orange-500">
                <ArrowLeft size={16} className="mr-2" />
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">© 2025 Dropi. ❤️</p>
          <p className="text-xs text-gray-500">Versión: 2.4.0</p>
        </div>
      </div>
    </div>
  );
}