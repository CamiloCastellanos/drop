import React from 'react';
import { useTranslation } from 'react-i18next';
import { GripVertical } from 'lucide-react';
import Swal from 'sweetalert2';

interface Carrier {
  name: string;      // "EVACOURIER"
  logo: string;      // URL de logo
  order: number;     // 1, 2, 3 ...
}

export function CarrierPreferences() {
  const { t } = useTranslation();
  const [carriers, setCarriers] = React.useState<Carrier[]>([]);
  const [draggedCarrier, setDraggedCarrier] = React.useState<Carrier | null>(null);

  // Cargar carriers desde la BD al montar
  React.useEffect(() => {
    loadCarriersFromDB();
  }, []);

  const loadCarriersFromDB = () => {
    const userUUID = localStorage.getItem('user_uuid');
    if (!userUUID) {
      console.error('No se encontró user_uuid en localStorage');
      return;
    }
    fetch(`https://dropi.co.alexcode.org/api/carriers?user_uuid=${userUUID}`)
      .then((res) => res.json())
      .then((data) => {
        // data: [{ name: 'EVACOURIER', order: 1 }, { name: 'URBANO', order: 2 } ...]
        // Aseguramos que tengan logo si deseas (puedes mapear manualmente)
        const withLogos = data.map((c: any) => ({
          name: c.name,
          order: c.order,
          logo: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=40&h=40&q=80' 
        }));
        setCarriers(withLogos);
      })
      .catch((err) => console.error('Error fetching carriers:', err));
  };

  const handleDragStart = (carrier: Carrier) => {
    setDraggedCarrier(carrier);
  };

  const handleDragOver = (e: React.DragEvent, carrier: Carrier) => {
    e.preventDefault();
    if (!draggedCarrier || draggedCarrier.name === carrier.name) return;

    const updatedCarriers = [...carriers];
    const draggedIndex = updatedCarriers.findIndex(c => c.name === draggedCarrier.name);
    const hoverIndex = updatedCarriers.findIndex(c => c.name === carrier.name);

    // Intercambiar el order
    const draggedOrder = updatedCarriers[draggedIndex].order;
    updatedCarriers[draggedIndex].order = updatedCarriers[hoverIndex].order;
    updatedCarriers[hoverIndex].order = draggedOrder;

    // Ordenar el array por 'order'
    updatedCarriers.sort((a, b) => a.order - b.order);
    
    setCarriers(updatedCarriers);
  };

  const handleDragEnd = () => {
    setDraggedCarrier(null);
  };

  // Guardar cambios en la BD
  const handleSave = () => {
    const userUUID = localStorage.getItem('user_uuid');
    if (!userUUID) {
      Swal.fire('Error', 'No se encontró user_uuid en localStorage', 'error');
      return;
    }
    // Construir payload
    // carriers: [{ name: 'EVACOURIER', order: 1, logo: ... }, ...]
    // El backend solo necesita name y order
    const payloadCarriers = carriers.map(c => ({
      name: c.name,
      order: c.order
    }));

    fetch('https://dropi.co.alexcode.org/api/carriers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_uuid: userUUID, carriers: payloadCarriers })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          Swal.fire('Error', data.error, 'error');
          return;
        }
        // Exito
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados',
          text: 'El orden de las transportadoras se ha actualizado.',
        });
      })
      .catch(err => {
        console.error('Error saving carriers:', err);
        Swal.fire('Error', 'Ocurrió un error al guardar los cambios', 'error');
      });
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
                key={carrier.name}
                draggable
                onDragStart={() => handleDragStart(carrier)}
                onDragOver={(e) => handleDragOver(e, carrier)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-move
                  ${draggedCarrier?.name === carrier.name ? 'opacity-50' : ''}
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
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
