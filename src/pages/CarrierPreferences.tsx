import React from 'react';
import { useTranslation } from 'react-i18next';
import { GripVertical } from 'lucide-react';

interface Carrier {
  id: string;
  name: string;
  logo: string;
  order: number;
}

export function CarrierPreferences() {
  const { t } = useTranslation();
  const [carriers, setCarriers] = React.useState<Carrier[]>([
    {
      id: '1',
      name: 'EVACOURIER',
      logo: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=40&h=40&q=80',
      order: 1
    },
    {
      id: '2',
      name: 'URBANO',
      logo: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=40&h=40&q=80',
      order: 2
    },
    {
      id: '3',
      name: 'FENIX',
      logo: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=40&h=40&q=80',
      order: 3
    }
  ]);
  const [draggedCarrier, setDraggedCarrier] = React.useState<Carrier | null>(null);

  const handleDragStart = (carrier: Carrier) => {
    setDraggedCarrier(carrier);
  };

  const handleDragOver = (e: React.DragEvent, carrier: Carrier) => {
    e.preventDefault();
    if (!draggedCarrier || draggedCarrier.id === carrier.id) return;

    const updatedCarriers = [...carriers];
    const draggedIndex = carriers.findIndex(c => c.id === draggedCarrier.id);
    const hoverIndex = carriers.findIndex(c => c.id === carrier.id);

    // Swap the orders
    const draggedOrder = updatedCarriers[draggedIndex].order;
    updatedCarriers[draggedIndex].order = updatedCarriers[hoverIndex].order;
    updatedCarriers[hoverIndex].order = draggedOrder;

    // Sort by order
    updatedCarriers.sort((a, b) => a.order - b.order);
    
    setCarriers(updatedCarriers);
  };

  const handleDragEnd = () => {
    setDraggedCarrier(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Transportadora favorita</h1>
          <p className="text-gray-600 mt-1">
            Arrastra y suelta para seleccionar el orden de preferencia de tus transportadoras (Util para integraciones y cargue masivo)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="space-y-2">
            {carriers.map((carrier) => (
              <div
                key={carrier.id}
                draggable
                onDragStart={() => handleDragStart(carrier)}
                onDragOver={(e) => handleDragOver(e, carrier)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-move
                  ${draggedCarrier?.id === carrier.id ? 'opacity-50' : ''}
                  hover:border-orange-500 transition-colors duration-200
                `}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <GripVertical className="text-gray-400 mr-4 flex-shrink-0" />
                  <span className="text-gray-500 font-medium mr-4">#{carrier.order}</span>
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mr-4">
                    <img
                      src={carrier.logo}
                      alt={carrier.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="font-medium truncate">{carrier.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
          Guardar cambios
        </button>
      </div>
    </div>
  );
}