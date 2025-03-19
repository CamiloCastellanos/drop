import React from 'react';
import Swal from 'sweetalert2';

/**
 * Interfaz del producto (ajusta según tu modelo real)
 */
interface Producto {
  id: number;
  nombre: string;
  stock: number;
  precio_sugerido: number;
}

/**
 * Interfaz de la transportadora (ajusta según tu tabla carriers_order)
 */
interface Carrier {
  id: number;
  user_uuid: string;
  carrier_name: string;
  carrier_order: number;
}

/**
 * Props que recibe el componente OrderModal
 */
interface OrderModalProps {
  product: Producto;         // El producto seleccionado
  onClose: () => void;       // Función para cerrar el modal
}

/**
 * Componente de Modal para “Enviar a cliente” (con POST a /api/pedidos).
 * Incluye varios console.log para depuración.
 */
export function OrderModal({ product, onClose }: OrderModalProps) {
  // Estados para tus campos de formulario
  const [nombre, setNombre] = React.useState('');
  const [apellido, setApellido] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [direccion, setDireccion] = React.useState('');
  const [conRecaudo, setConRecaudo] = React.useState(true);

  // Cantidad y precio de venta
  const [cantidad, setCantidad] = React.useState(1);
  const [precioVenta, setPrecioVenta] = React.useState(
    product.precio_sugerido.toString()
  );

  // Transportadoras
  const [carriers, setCarriers] = React.useState<Carrier[]>([]);
  const [selectedCarrier, setSelectedCarrier] = React.useState<string>('');

  // DEBUG: Saber cuándo se renderiza el modal
  console.log('[OrderModal] Renderizando. Producto:', product);

  // Al montar el modal, obtenemos la lista de transportadoras
  React.useEffect(() => {
    console.log('[OrderModal] Montado. Haciendo fetch a /api/couriers...');

    fetch('/api/couriers') // Ajusta la ruta si es diferente
      .then((res) => {
        console.log('[OrderModal] Respuesta bruta fetch carriers:', res);
        return res.json();
      })
      .then((data) => {
        console.log('[OrderModal] carriers data parseada:', data);
        if (Array.isArray(data)) {
          setCarriers(data);
        } else {
          setCarriers([]);
        }
      })
      .catch((err) => {
        console.error('[OrderModal] Error al obtener carriers:', err);
      });
  }, []);

  /**
   * Maneja el envío del formulario al hacer clic en "Procesar"
   */
  const handleSubmit = async () => {
    console.log('[handleSubmit] Ingresé a la función.');

    try {
      // 1) Obtenemos el user_uuid desde localStorage
      const user_uuid = localStorage.getItem('uuid') || '';
      console.log('[handleSubmit] user_uuid:', user_uuid);

      // 2) Armamos el objeto con todos los datos
      const body = {
        user_uuid,
        nombre,
        apellido,
        telefono,
        email,
        direccion,
        con_recaudo: conRecaudo, // boolean => en backend lo guardas como TINYINT(1)
        producto_id: product.id,
        cantidad,
        precio_venta: parseFloat(precioVenta),
        transportadora: selectedCarrier,
      };

      console.log('[handleSubmit] Datos a enviar:', body);

      // 3) Llamamos al endpoint POST /api/pedidos
      const response = await fetch('https://dropi.co.alexcode.org/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('[handleSubmit] Status de la respuesta:', response.status);
      console.log('[handleSubmit] response.ok:', response.ok);

      // 4) Parseamos la respuesta
      const data = await response.json();
      console.log('[handleSubmit] Respuesta del servidor:', data);

      // 5) Si hay error en la respuesta, mostramos SweetAlert2 de error
      if (!response.ok || data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'No se pudo crear el pedido',
        });
        return;
      }

      // 6) Si todo salió bien, mostramos SweetAlert2 de éxito
      Swal.fire({
        icon: 'success',
        title: 'Pedido creado',
        text: 'Tu pedido se ha creado exitosamente',
      });

      // 7) Cerrar el modal
      onClose();

    } catch (error) {
      console.error('[handleSubmit] Error en la petición:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el pedido',
      });
    }
  };

  // Subtotal calculado con el precioVenta que el usuario ponga
  const subtotal = parseFloat(precioVenta) * cantidad || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Fondo oscuro para el overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      ></div>

      {/* Contenedor del modal */}
      <div className="relative bg-white w-full max-w-2xl mx-auto rounded-md shadow-lg p-6">
        {/* Botón Cerrar (X) */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          X
        </button>

        <h2 className="text-xl font-semibold mb-4">Datos para el envío</h2>

        {/* FORMULARIO */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Nombre(s)
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Apellido(s)
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Email (Opcional)
            </label>
            <input
              type="email"
              className="w-full border rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-sm text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>

          {/* Radio buttons para Recaudo */}
          <div className="col-span-2 flex items-center gap-4 mt-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="recaudo"
                checked={conRecaudo}
                onChange={() => setConRecaudo(true)}
              />
              <span>CON RECAUDO (Contra entrega)</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="recaudo"
                checked={!conRecaudo}
                onChange={() => setConRecaudo(false)}
              />
              <span>SIN RECAUDO</span>
            </label>
          </div>
        </div>

        <hr className="my-4" />

        {/* Información del producto */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold">Producto seleccionado:</h3>
            <p>{product.nombre}</p>
            <p className="text-sm text-gray-600">
              Stock disponible: {product.stock}
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min={1}
              max={product.stock}
              className="w-20 border rounded p-1"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Precio de venta (editable) */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">
            Precio de venta (COP)
          </label>
          <input
            type="text"
            className="w-32 border rounded p-1"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
          />
        </div>

        {/* Select de Transportadora */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">
            Transportadora
          </label>
          <select
            className="border rounded p-2 w-full"
            value={selectedCarrier}
            onChange={(e) => setSelectedCarrier(e.target.value)}
          >
            <option value="">Seleccione una transportadora</option>
            {carriers.map((carrier) => (
              <option key={carrier.id} value={carrier.carrier_name}>
                {carrier.carrier_name}
              </option>
            ))}
          </select>
        </div>

        {/* Resumen de la orden */}
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Resumen de la orden</h4>
          <div className="flex justify-between text-sm">
            <span>Producto:</span>
            <span>{product.nombre}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Precio Unitario:</span>
            <span>${precioVenta}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cantidad:</span>
            <span>{cantidad}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>SubTotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button onClick={handleSubmit}>Procesar</button>

        </div>
      </div>
    </div>
  );
}
