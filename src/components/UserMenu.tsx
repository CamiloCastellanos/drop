import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCircle, Wallet, ArrowRightLeft, Settings, KeyRound, LogOut, ChevronDown, Eye, EyeOff, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';
import axios, { AxiosError } from 'axios';

export function UserMenu() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    currentPassword: '', // Campo para la contraseña actual
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [email, setEmail] = React.useState(''); // Estado para el email
  const [loading, setLoading] = React.useState(true);

  // Obtener el nombre y email del usuario al montar el componente
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user_uuid = localStorage.getItem('user_uuid');
        if (!user_uuid) {
          throw new Error('UUID de usuario no encontrado');
        }

        console.log('UUID del usuario:', user_uuid);

        const response = await axios.get(`/api/user-profile?user_uuid=${user_uuid}`);

        console.log('Respuesta de la API:', response.data);

        if (response.data.first_name) {
          setFirstName(response.data.first_name);
        }

        // Verifica que el correo electrónico esté en la respuesta de la API
        if (response.data.email) {
          setEmail(response.data.email); // Establecer el email en el estado
          console.log('Email del usuario:', response.data.email); // Agregar un log para verificar el email
        } else {
          console.log('No se encontró email en la respuesta');
        }
      } catch (error) {
        console.error('Error obteniendo perfil:', error);
        Swal.fire('Error', 'No se pudo cargar el perfil del usuario', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const menuItems = [
    { icon: UserCircle, text: t('userMenu.profile'), path: '/perfil' },
    { icon: Wallet, text: t('userMenu.wallet'), path: '/billetera' },
    { icon: ArrowRightLeft, text: t('userMenu.transfer'), path: '/transferencia' },
    { icon: Settings, text: t('userMenu.settings'), path: '/configuraciones/tienda' },
    { icon: KeyRound, text: t('userMenu.password'), action: () => setShowPasswordModal(true) },
    {
      icon: LogOut,
      text: t('userMenu.logout'),
      action: async () => {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Deseas cerrar la sesión?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cerrar sesión',
          cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
          await logout();
          await Swal.fire({
            icon: 'success',
            title: '¡Sesión cerrada!',
            text: 'Has cerrado sesión correctamente',
            timer: 1500,
            showConfirmButton: false,
          });
          navigate('/');
        }
      },
    },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu')) {
        closeDropdown();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMenuClick = async (item: typeof menuItems[0]) => {
    closeDropdown();
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      await item.action();
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones antes de enviar
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const response = await axios.post('/api/change-password', {
        user_uuid: localStorage.getItem('user_uuid'),
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.status === 200) {
        Swal.fire('Contraseña cambiada', 'Tu contraseña ha sido actualizada con éxito', 'success');
        setShowPasswordModal(false);
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error cambiando la contraseña:', error.response?.data);
        setError(error.response?.data?.error || 'Hubo un problema al cambiar la contraseña');
      } else {
        console.error('Error desconocido:', error);
        setError('Ocurrió un error desconocido');
      }
    }
  };

  return (
    <div className="user-menu relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&q=80"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-700 font-medium">
          {loading ? 'Cargando...' : firstName || 'Usuario'}
        </span>
        <ChevronDown size={16} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                className={`
                  w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50
                  ${index === menuItems.length - 1 ? 'border-t border-gray-100' : ''}
                `}
              >
                <item.icon size={18} className="mr-2" />
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal de cambio de contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Modificar Contraseña</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              {/* Contraseña actual */}
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Contraseña actual"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Nueva contraseña */}
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Nueva contraseña"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirmar contraseña */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Error */}
              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Cambiar Contraseña
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}