import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, CircuitBoard as Chip, Wifi as ContactlessPayment } from 'lucide-react';

export function DropiCard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dropi Card</h1>

      <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
        {/* Virtual Card */}
        <div className="w-full aspect-[1.586/1] bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 relative overflow-hidden mb-8">
          {/* Card Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>

          {/* Card Content */}
          <div className="relative h-full flex flex-col justify-between">
            {/* Card Header */}
            <div className="flex justify-between items-start">
              <div className="text-white">
                <CreditCard size={32} className="mb-2" />
                <h2 className="text-lg font-semibold">Dropi Card</h2>
              </div>
              <ContactlessPayment size={24} className="text-white/80" />
            </div>

            {/* Card Chip */}
            <div className="flex items-center space-x-3">
              <Chip size={40} className="text-white/80" />
              <div className="w-12 h-8 rounded-md bg-white/20"></div>
            </div>

            {/* Card Number */}
            <div className="text-white text-xl tracking-widest font-mono">
              •••• •••• •••• ••••
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-end">
              <div className="text-white">
                <div className="text-xs opacity-80 mb-1">TITULAR</div>
                <div className="font-medium">NOMBRE DEL TITULAR</div>
              </div>
              <div className="text-white">
                <div className="text-xs opacity-80 mb-1">VÁLIDA HASTA</div>
                <div className="font-medium">MM/AA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Button */}
        <button className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Solicitar Dropi Card
        </button>

        {/* Card Benefits */}
        <div className="mt-12 w-full space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">Beneficios de Dropi Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2">Compras Seguras</h4>
              <p className="text-gray-600 text-sm">Realiza tus compras de forma segura en cualquier establecimiento</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2">Sin Comisiones</h4>
              <p className="text-gray-600 text-sm">No pagas comisiones por mantenimiento ni por uso</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2">Retiros Gratis</h4>
              <p className="text-gray-600 text-sm">Retira efectivo sin costo en cajeros afiliados</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2">Control Total</h4>
              <p className="text-gray-600 text-sm">Gestiona tus gastos y movimientos desde la app</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}