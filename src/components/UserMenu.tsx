import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCircle, Wallet, ArrowRightLeft, Settings, KeyRound, LogOut, ChevronDown, Eye, EyeOff, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

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
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = React.useState('');

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
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          await logout();
          await Swal.fire({
            icon: 'success',
            title: '¡Sesión cerrada!',
            text: 'Has cerrado sesión correctamente',
            timer: 1500,
            showConfirmButton: false
          });
          navigate('/');
        }
      }
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Hay errores en este formulario, por favor complete todos los campos');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    // Handle password change logic here
    setShowPasswordModal(false);
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
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
        <span className="text-gray-700 font-medium">alexander jesus</span>
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

      {/* Password Change Modal */}
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
              {/* Email (disabled) */}
              <div>
                <input
                  type="email"
                  value="alexanderjesusnievesmontilva@gmail.com"
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
                />
              </div>

              {/* Current Password */}
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Current Password"
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

              {/* New Password */}
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

              {/* Confirm Password */}
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

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}