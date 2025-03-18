import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Shield,
  Users,
  Settings,
  Calendar,
  MessageSquare,
  BarChart,
  FileText,
  Menu,
  ChevronDown,
  Store,
  Truck,
  ClipboardCheck,
  RotateCcw,
  CreditCard,
  Building2,
  Wallet,
  UserCircle,
  DollarSign,
  KeyRound,
  Megaphone,
  Zap,
  Receipt,
  FileBarChart,
  History,
  Grid,
  UserPlus,
  ShoppingBag
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { UserMenu } from './UserMenu';
import { useAuth } from '../hooks/useAuth';

interface SubMenuItem {
  icon: React.ElementType;
  text: string;
  path: string;
  badge?: string;
}

interface MenuItem {
  icon: React.ElementType;
  text: string;
  path: string;
  badge?: string;
  subItems?: SubMenuItem[];
}

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const { user } = useAuth(); // Se espera que user tenga user.uuid, role o role_id
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('[Layout] user from AuthContext:', user);

  const currentUser = user; // Usar el usuario real

  // Llamada al backend para obtener el rol y guardarlo en localStorage
  useEffect(() => {
    if (currentUser?.uuid) {
      console.log('[Layout] UUID del usuario:', currentUser.uuid);
      fetch(`https://dropi.co.alexcode.org/api/user-role?uuid=${currentUser.uuid}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('[Layout] Respuesta del backend:', data);
          if (!data.error) {
            localStorage.setItem('user_role_id', data.role_id);
            localStorage.setItem('user_role_name', data.role_name);
            console.log('[Layout] Se guardó en localStorage:', {
              role_id: data.role_id,
              role_name: data.role_name
            });
          } else {
            console.error('[Layout] Error obteniendo el rol:', data.error);
          }
        })
        .catch((err) => {
          console.error('[Layout] Error en fetch user role:', err);
        });
    } else {
      console.warn('[Layout] currentUser es null o no tiene UUID.');
    }
  }, [currentUser]);

  // Menú base sin el subítem "Vendedor"
  const menuItemsBase: MenuItem[] = [
    { icon: Home, text: 'Inicio', path: '/home' },
    { icon: LayoutDashboard, text: 'Dashboard', path: '/dashboard' },
    {
      icon: Package,
      text: 'Productos',
      path: '/productos',
      subItems: [
        { icon: Store, text: 'Catálogo', path: '/productos/catalogo' },
        { icon: Truck, text: 'Proveedores', path: '/productos/proveedores' }
      ]
    },
    {
      icon: ShoppingCart,
      text: 'Mis Pedidos',
      path: '/pedidos',
      subItems: [
        { icon: ShoppingCart, text: 'Mis Pedidos', path: '/pedidos/lista' },
        { icon: Package, text: 'Novedades', path: '/pedidos/novedades' },
        { icon: ShoppingCart, text: 'Carritos abandonados', path: '/pedidos/carritos' },
        { icon: FileText, text: 'Etiquetas', path: '/pedidos/etiquetas' },
        { icon: Settings, text: 'Configuración de pedidos', path: '/pedidos/configuracion' }
      ]
    },
    {
      icon: Shield,
      text: 'Mis Garantías',
      path: '/garantias',
      subItems: [
        { icon: ClipboardCheck, text: 'Garantías', path: '/garantias/lista' },
        { icon: Truck, text: 'Órdenes de Despacho', path: '/garantias/despachos' },
        { icon: RotateCcw, text: 'Garantías Recolecciones', path: '/garantias/recolecciones' }
      ]
    },
    { icon: Users, text: 'Clientes', path: '/clientes' },
    { icon: Grid, text: 'Mis Integraciones', path: '/Integrations' },
    { icon: History, text: 'Historial de Cartera', path: '/historial-cartera' },
    { icon: UserPlus, text: 'Mis Referidos', path: '/referidos' },
    { icon: Calendar, text: 'Calendario', path: '/calendar' },
    {
      icon: MessageSquare,
      text: 'Marketing',
      path: '/marketing',
      subItems: [
        { icon: Megaphone, text: 'Campañas', path: '/marketing/campaign' },
        { icon: Zap, text: 'Automatización', path: '/marketing/automation' },
        { icon: Settings, text: 'Configuraciones', path: '/marketing/setting' }
      ]
    },
    {
      icon: BarChart,
      text: 'Reportes',
      path: '/reportes',
      badge: t('badges.new')
    },
    {
      icon: FileText,
      text: 'Facturas',
      path: '/facturas',
      subItems: [
        { icon: Receipt, text: 'Facturas', path: '/facturas/facturas' },
        { icon: FileBarChart, text: 'Notas', path: '/facturas/notas' }
      ]
    },
    {
      icon: Truck,
      text: 'Transportadora',
      path: '/transportadora',
      subItems: [
        { icon: Settings, text: 'Preferencias', path: '/transportadora/preferencias' }
      ]
    },
    {
      icon: CreditCard,
      text: 'Dropi Card',
      path: '/dropi-card',
      badge: t('badges.new')
    },
    {
      icon: Settings,
      text: 'Configuraciones',
      path: '/configuraciones',
      subItems: [
        { icon: Building2, text: 'Datos Bancarios', path: '/configuraciones/datos-bancarios' },
        { icon: Wallet, text: 'Planes', path: '/configuraciones/planes' },
        { icon: Store, text: 'Configuración de tienda', path: '/configuraciones/tienda' },
        { icon: UserCircle, text: 'Datos Personales', path: '/configuraciones/datos-personales' },
        { icon: DollarSign, text: 'Retiros de Saldo', path: '/configuraciones/retiros' },
        { icon: KeyRound, text: 'Mis Sesiones', path: '/configuraciones/sesiones' }
      ]
    }
  ];

  // Inyectar subítem "Vendedor" si el rol es "PROVEEDOR / MARCA"
  const menuItems: MenuItem[] = useMemo(() => {
    // Clonamos la estructura base para evitar mutar el original.
    const cloned = menuItemsBase.map(item => ({
      ...item,
      subItems: item.subItems ? [...item.subItems] : undefined
    }));

    const roleName = localStorage.getItem('user_role_name') || '';
    if (roleName === 'PROVEEDOR / MARCA') {
      console.log('[Layout] roleName = PROVEEDOR / MARCA => Inyectar "Vendedor"');
      const productosMenu = cloned.find(m => m.text === 'Productos');
      if (productosMenu && productosMenu.subItems) {
        productosMenu.subItems.push({
          icon: ShoppingBag,
          text: 'Vendedor',
          path: '/productos/vendedor'
        });
      }
    } else {
      console.log('[Layout] roleName != PROVEEDOR / MARCA => no se inyecta "Vendedor"');
    }
    return cloned;
  }, [menuItemsBase]);

  // Abrir submenú según la ruta actual (si no hay un cierre manual previo)
  useEffect(() => {
    const pathSegment = location.pathname.split('/')[1];
    if (pathSegment) {
      const menuItem = menuItems.find(item => item.path.startsWith(`/${pathSegment}`));
      if (menuItem?.subItems) {
        setOpenSubmenu(menuItem.text);
      }
    }
  }, [location.pathname, menuItems]);

  const toggleSubmenu = (menuText: string) => {
    // Si ya está abierto, lo cerramos; si no, abrimos solo este.
    setOpenSubmenu(prev => (prev === menuText ? null : menuText));
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      if (item.subItems) {
        setOpenSubmenu(item.text);
      }
    }
  };

  const isSubmenuOpen = (menuText: string) => openSubmenu === menuText;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarOpen ? 'w-full md:w-64' : 'w-full md:w-20'}
          bg-white shadow-lg transition-all duration-300
          flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200
          relative
        `}
      >
        <div className="p-4 flex items-center justify-between">
          <img
            src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&q=80"
            alt="Logo"
            className="h-8 w-auto"
          />
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        <nav className="mt-8 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {menuItems.map((item: MenuItem, index: number) => {
            if (item.subItems) {
              return (
                <div key={index}>
                  <button
                    onClick={() => {
                      toggleSubmenu(item.text);
                      handleMenuItemClick(item);
                    }}
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 ${
                      !isSidebarOpen ? 'justify-center' : ''
                    }`}
                  >
                    <div className={`flex items-center ${!isSidebarOpen ? 'justify-center w-full' : ''}`}>
                      <item.icon
                        size={20}
                        className={
                          location.pathname.startsWith(item.path)
                            ? 'text-orange-600'
                            : 'text-gray-500'
                        }
                      />
                      {isSidebarOpen && (
                        <>
                          <span className="ml-3">{item.text}</span>
                          <ChevronDown
                            size={16}
                            className={`ml-auto transform transition-transform duration-300 ease-in-out ${
                              isSubmenuOpen(item.text) ? 'rotate-180' : ''
                            }`}
                          />
                        </>
                      )}
                    </div>
                  </button>
                  {isSidebarOpen && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isSubmenuOpen(item.text) ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {item.subItems.map((subItem: SubMenuItem, subIndex: number) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="flex items-center pl-12 pr-4 py-3 text-gray-600 hover:bg-gray-100"
                        >
                          <subItem.icon
                            size={18}
                            className={
                              location.pathname === subItem.path
                                ? 'text-orange-600'
                                : 'text-gray-500'
                            }
                          />
                          <span className="ml-3">{subItem.text}</span>
                          {subItem.badge && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => handleMenuItemClick(item)}
                  className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 ${
                    !isSidebarOpen ? 'justify-center' : ''
                  }`}
                >
                  <item.icon
                    size={20}
                    className={
                      location.pathname === item.path
                        ? 'text-orange-600'
                        : 'text-gray-500'
                    }
                  />
                  {isSidebarOpen && (
                    <>
                      <span className="ml-3">{item.text}</span>
                      {item.badge && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            }
          })}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-4 space-y-4 md:space-y-0">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Menu size={20} />
                </button>
              )}
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                {t('greeting')} {user?.firstName}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button
                onClick={() => navigate('/configuraciones/retiros')}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap"
              >
                <Wallet size={20} className="mr-2" />
                <span>0,00</span>
              </button>
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default Layout;
