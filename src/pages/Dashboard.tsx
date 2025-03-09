import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Package,
  Truck,
  AlertCircle
} from 'lucide-react';

export function Dashboard() {
  const { t } = useTranslation();

  const stats = [
    { 
      title: 'Ventas Totales', 
      value: 'S/. 24,500', 
      icon: DollarSign, 
      change: '+12%', 
      up: true,
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: 'Pedidos Nuevos', 
      value: '145', 
      icon: ShoppingBag, 
      change: '+8%', 
      up: true,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: 'Clientes Nuevos', 
      value: '32', 
      icon: Users, 
      change: '+15%', 
      up: true,
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      title: 'Tasa de Conversión', 
      value: '3.24%', 
      icon: TrendingUp, 
      change: '+2%', 
      up: true,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      product: 'iPhone 13 Pro',
      customer: 'Juan Pérez',
      amount: 4599.99,
      status: 'Completado'
    },
    {
      id: 'ORD-002',
      product: 'MacBook Air M1',
      customer: 'María García',
      amount: 5299.99,
      status: 'En Proceso'
    },
    {
      id: 'ORD-003',
      product: 'AirPods Pro',
      customer: 'Carlos López',
      amount: 899.99,
      status: 'Pendiente'
    }
  ];

  const alerts = [
    {
      title: 'Stock Bajo',
      message: '5 productos están por debajo del stock mínimo',
      type: 'warning'
    },
    {
      title: 'Pedidos Pendientes',
      message: '3 pedidos requieren atención inmediata',
      type: 'error'
    },
    {
      title: 'Nuevas Reseñas',
      message: '2 nuevas reseñas de clientes',
      type: 'info'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Pedidos Recientes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{order.product}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">S/. {order.amount.toFixed(2)}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Completado' ? 'bg-green-100 text-green-800' :
                      order.status === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts and Notifications */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Alertas y Notificaciones</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                  <div className={`p-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-100' :
                    alert.type === 'error' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    <AlertCircle size={20} className={
                      alert.type === 'warning' ? 'text-yellow-600' :
                      alert.type === 'error' ? 'text-red-600' :
                      'text-blue-600'
                    } />
                  </div>
                  <div>
                    <h3 className="font-medium">{alert.title}</h3>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Rendimiento de Ventas</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Gráfico de Ventas</p>
        </div>
      </div>
    </div>
  );
}