import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

export function Register() {
  const [formData, setFormData] = React.useState<{
    lastName: string;
    firstName: string;
    phone: string;
    countryCode: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'DROPSHIPPER' | 'PROVIDER'; 
  }>({
    lastName: '',
    firstName: '',
    phone: '',
    countryCode: '57',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'DROPSHIPPER' 
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('El correo es requerido');
      return false;
    }
    if (!formData.password.trim()) {
      setError('La contraseña es requerida');
      return false;
    }
    if (!formData.firstName.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('El apellido es requerido');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('El teléfono es requerido');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      // Registrar el usuario
      await register({
        lastName: formData.lastName.trim(),
        firstName: formData.firstName.trim(),
        phone: formData.phone.trim(),
        countryCode: formData.countryCode,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      });

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Navegar al login
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Error al registrar usuario';
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

  const handleGuestAccess = () => {
    // Navigate directly to dashboard without authentication
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Registrarme</h2>
          <p className="mt-2 text-sm text-gray-600">
            Rellene el siguiente formulario para crear una nueva cuenta como {formData.role === 'DROPSHIPPER' ? 'Dropshipper' : 'Proveedor'}.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Apellido(s) *
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Nombre(s) *
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono *
              </label>
              <div className="mt-1 flex">
                <select
                  className="block w-20 px-3 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                >
                  <option value="57">🇨🇴 57</option>
                </select>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-r-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Teléfono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Correo"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña *
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña *
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Confirmar contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.role === 'DROPSHIPPER'}
                  onChange={() => setFormData({ ...formData, role: 'DROPSHIPPER' })}
                  className="form-radio h-4 w-4 text-orange-600"
                />
                <span className="ml-2">DROPSHIPPER</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.role === 'PROVIDER'}
                  onChange={() => setFormData({ ...formData, role: 'PROVIDER' })}
                  className="form-radio h-4 w-4 text-orange-600"
                />
                <span className="ml-2">PROVEEDOR / MARCA</span>
              </label>
            </div>
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

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                Login
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">© 2025 Dropi. ❤️</p>
          <p className="text-xs text-gray-500">Versión: 2.4.0</p>
        </div>
      </div>
    </div>
  );
}
