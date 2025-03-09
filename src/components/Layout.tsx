import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Home, Package, ShoppingCart, Shield, Users, Settings, 
  Calendar, MessageSquare, BarChart, FileText, Menu, ChevronDown, Store, 
  Truck, ClipboardCheck, RotateCcw, CreditCard, Building2, Wallet, 
  UserCircle, DollarSign, KeyRound, Megaphone, Zap, Receipt, FileBarChart, 
  History, Grid, UserPlus 
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { UserMenu } from './UserMenu';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [openSubmenus, setOpenSubmenus] = React.useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
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
        { icon: Truck, text: 'Ordenes de Despacho', path: '/garantias/despachos' },
        { icon: RotateCcw, text: 'Garantías Recolecciones', path: '/garantias/recolecciones' }
      ]
    },
    { icon: Users, text: 'Clientes', path: '/clientes' },
    { icon: Grid, text: 'Mis Integraciones', path: '/integraciones' },
    { icon: History, text: 'Historial de Cartera', path: '/historial-cartera' },
    { icon: Users, text: 'Mis usuarios', path: '/usuarios' },
    { icon: UserPlus, text: 'Mis Referidos', path: '/referidos' },
    { icon: Calendar, text: 'Calendario', path: '/calendario' },
    {
      icon: MessageSquare,
      text: 'Marketing',
      path: '/marketing',
      subItems: [
        { icon: Megaphone, text: 'Campañas', path: '/marketing/campanas' },
        { icon: Zap, text: 'Automatización', path: '/marketing/automatizacion' },
        { icon: Settings, text: 'Configuraciones', path: '/marketing/configuraciones' }
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
        { icon: Receipt, text: 'Facturas', path: '/facturas/lista' },
        { icon: FileBarChart, text: 'Notas de crédito', path: '/facturas/notas' }
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

  React.useEffect(() => {
    const pathSegment = location.pathname.split('/')[1];
    if (pathSegment) {
      const menuItem = menuItems.find(item => item.path.startsWith(`/${pathSegment}`));
      if (menuItem?.subItems) {
        setOpenSubmenus(prev => [...prev, menuItem.text]);
      }
    }
  }, [location.pathname]);

  const toggleSubmenu = (menuText: string) => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setOpenSubmenus([menuText]);
    } else {
      setOpenSubmenus(prev => 
        prev.includes(menuText) 
          ? prev.filter(item => item !== menuText)
          : [...prev, menuText]
      );
    }
  };

  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      if (item.subItems) {
        setOpenSubmenus([item.text]);
      }
    }
  };

  const isSubmenuOpen = (menuText: string) => openSubmenus.includes(menuText);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 overflow-hidden">
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
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => {
                      toggleSubmenu(item.text);
                      handleMenuItemClick(item);
                    }}
                    className={`w-full flex items-center px-4 py-3 hover:bg-gray-50 ${!isSidebarOpen ? 'justify-center' : ''}`}
                  >
                    <div className={`flex items-center ${!isSidebarOpen ? 'justify-center w-full' : ''}`}>
                      <item.icon 
                        size={20} 
                        className={location.pathname.startsWith(item.path) ? 'text-orange-600' : 'text-gray-500'} 
                      />
                      {isSidebarOpen && (
                        <>
                          <span className="ml-3">{item.text}</span>
                          <ChevronDown
                            size={16}
                            className={`ml-auto transform transition-transform duration-200 ${
                              isSubmenuOpen(item.text) ? 'rotate-180' : ''
                            }`}
                          />
                        </>
                      )}
                    </div>
                  </button>
                  {isSidebarOpen && isSubmenuOpen(item.text) && (
                    <div className="bg-gray-50">
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className="flex items-center pl-12 pr-4 py-3 text-gray-600 hover:bg-gray-100"
                        >
                          <subItem.icon size={18} className={location.pathname === subItem.path ? 'text-orange-600' : 'text-gray-500'} />
                          <span className="ml-3">{subItem.text}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => handleMenuItemClick(item)}
                  className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 ${!isSidebarOpen ? 'justify-center' : ''}`}
                >
                  <item.icon 
                    size={20} 
                    className={location.pathname === item.path ? 'text-orange-600' : 'text-gray-500'} 
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
              )}
            </div>
          ))}
        </nav>
      </aside>

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