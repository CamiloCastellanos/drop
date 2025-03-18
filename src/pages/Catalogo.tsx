import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Heart,
  Grid,
  List,
  Filter,
  ShoppingCart,
  Lock,
} from 'lucide-react';
import { DetailsProductos } from './DetailsProductos'; // <-- Importa tu componente de detalles

// Interfaz del producto
interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  proveedor: string;
  precio_proveedor: number;
  precio_sugerido: number;
  stock: number;
  imagen: string;
}

export function Catalogo() {
  const { t } = useTranslation();

  // Estados para switches y filtros
  const [modoVista, setModoVista] = React.useState<'cuadricula' | 'lista'>('cuadricula');
  const [ordenarPor, setOrdenarPor] = React.useState('Aleatorio');
  const [favoritos, setFavoritos] = React.useState(false);
  const [privados, setPrivados] = React.useState(false);
  const [conOrdenes, setConOrdenes] = React.useState(false);

  // Filtros de texto
  const [busqueda, setBusqueda] = React.useState('');
  const [proveedorSeleccionado, setProveedorSeleccionado] = React.useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = React.useState('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = React.useState('');

  // Filtros de rango
  const [rangoPrecio, setRangoPrecio] = React.useState({ min: '0', max: '1000000' });
  const [rangoStock, setRangoStock] = React.useState({ min: '', max: '' });

  // Estado que almacena todos los productos cargados
  const [productos, setProductos] = React.useState<Producto[]>([]);

  // Estado para manejar el "detalle" de un producto (null = modo listado)
  const [selectedProduct, setSelectedProduct] = React.useState<Producto | null>(null);

  // Cargar productos al montar
  React.useEffect(() => {
    cargarProductos();
  }, []);

  // Función para cargar los productos desde /api/productos con los filtros
  const cargarProductos = () => {
    const params = new URLSearchParams();
    if (busqueda) params.append('busqueda', busqueda);
    if (categoriaSeleccionada) params.append('categoria', categoriaSeleccionada);
    if (proveedorSeleccionado) params.append('proveedor', proveedorSeleccionado);
    if (rangoPrecio.min) params.append('precio_min', rangoPrecio.min);
    if (rangoPrecio.max) params.append('precio_max', rangoPrecio.max);
    if (rangoStock.min) params.append('stock_min', rangoStock.min);
    if (rangoStock.max) params.append('stock_max', rangoStock.max);

    fetch(`https://dropi.co.alexcode.org/api/productos?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          setProductos([]);
        }
      })
      .catch((err) => {
        console.error('Error al obtener productos:', err);
      });
  };

  // Aplica los filtros (vuelve a cargar)
  const aplicarFiltros = () => {
    cargarProductos();
  };

  // -----------------------------------------------------
  // Si hay un producto seleccionado, renderizamos el DETALLE
  // -----------------------------------------------------
  if (selectedProduct) {
    return (
      <DetailsProductos
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  // -----------------------------------------------------
  // Caso contrario => MODO LISTADO (Catálogo)
  // -----------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Sección de filtros superiores */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-6">
          {/* Switches: Favoritos, Privados, Con órdenes */}
          <div className="flex items-center gap-8">
            {/* Favoritos */}
            <label className="flex items-center gap-2 cursor-pointer">
              <Heart size={20} className="text-primary" />
              <span className="text-gray-700">Favoritos</span>
              <div className="relative inline-block w-10 h-6 ml-2">
                <input
                  type="checkbox"
                  checked={favoritos}
                  onChange={(e) => setFavoritos(e.target.checked)}
                  className="opacity-0 w-0 h-0"
                />
                <span
                  className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                    favoritos ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 transform ${
                      favoritos ? 'translate-x-4' : 'translate-x-1'
                    } top-1`}
                  />
                </span>
              </div>
            </label>
            {/* Privados */}
            <label className="flex items-center gap-2 cursor-pointer">
              <Lock size={20} className="text-gray-500" />
              <span className="text-gray-700">Privados</span>
              <div className="relative inline-block w-10 h-6 ml-2">
                <input
                  type="checkbox"
                  checked={privados}
                  onChange={(e) => setPrivados(e.target.checked)}
                  className="opacity-0 w-0 h-0"
                />
                <span
                  className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                    privados ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 transform ${
                      privados ? 'translate-x-4' : 'translate-x-1'
                    } top-1`}
                  />
                </span>
              </div>
            </label>
            {/* Con órdenes */}
            <label className="flex items-center gap-2 cursor-pointer">
              <ShoppingCart size={20} className="text-gray-500" />
              <span className="text-gray-700">Con órdenes</span>
              <div className="relative inline-block w-10 h-6 ml-2">
                <input
                  type="checkbox"
                  checked={conOrdenes}
                  onChange={(e) => setConOrdenes(e.target.checked)}
                  className="opacity-0 w-0 h-0"
                />
                <span
                  className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                    conOrdenes ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 transform ${
                      conOrdenes ? 'translate-x-4' : 'translate-x-1'
                    } top-1`}
                  />
                </span>
              </div>
            </label>
          </div>

          {/* Buscador */}
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Filtros avanzados */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de proveedor:
            </label>
            <select
              value={proveedorSeleccionado}
              onChange={(e) => setProveedorSeleccionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Proveedor</option>
              <option value="MAYORISTAS">MAYORISTAS</option>
              <option value="MARCO">MARCO</option>
              <option value="UNMERCO">UNMERCO</option>
            </select>
          </div>

          {/* Rango de precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rango de precio:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={rangoPrecio.min}
                onChange={(e) =>
                  setRangoPrecio({ ...rangoPrecio, min: e.target.value })
                }
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span>—</span>
              <input
                type="number"
                value={rangoPrecio.max}
                onChange={(e) =>
                  setRangoPrecio({ ...rangoPrecio, max: e.target.value })
                }
                placeholder="1.000.000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock mínimo:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={rangoStock.min}
                onChange={(e) =>
                  setRangoStock({ ...rangoStock, min: e.target.value })
                }
                placeholder="Mínimo"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span>—</span>
              <input
                type="number"
                value={rangoStock.max}
                onChange={(e) =>
                  setRangoStock({ ...rangoStock, max: e.target.value })
                }
                placeholder="Máximo"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categorías:
            </label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Categorías</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Herramientas">Herramientas</option>
              <option value="Salud">Salud</option>
              <option value="Belleza">Belleza</option>
            </select>
          </div>
        </div>

        {/* Filtro por ciudad (opcional) */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad:
          </label>
          <select
            value={ciudadSeleccionada}
            onChange={(e) => setCiudadSeleccionada(e.target.value)}
            className="w-full md:w-1/4 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Seleccione una ciudad</option>
            <option value="lima">Lima</option>
            <option value="arequipa">Arequipa</option>
            <option value="trujillo">Trujillo</option>
          </select>
        </div>

        {/* Botón para aplicar filtros */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={aplicarFiltros}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Filter size={20} className="mr-2" />
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* Sección de productos (opciones de vista) */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Ordenar por:</span>
          <select
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Aleatorio</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
            <option>Stock: Menor a Mayor</option>
            <option>Stock: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Grid o lista de productos */}
      <div
  className={
    modoVista === 'cuadricula'
      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6'
      : 'space-y-4'
  }
>

        {productos.map((producto) => (
          <div
            key={producto.id}
            onClick={() => setSelectedProduct(producto)} 
            className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer ${
              modoVista === 'lista' ? 'flex' : ''
            }`}
          >
            <div
              className={`relative ${
                modoVista === 'lista' ? 'w-48 flex-shrink-0' : 'aspect-square'
              }`}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <Heart size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-4">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-gray-500">{producto.categoria}</span>
    <span className="text-xs text-gray-700">Stock <span className="text-sm font-bold text-green-500"> 
    {producto.stock}</span></span>

  </div>
  
  <h3 className="font-medium text-gray-900 mb-2 flex justify-center">{producto.nombre}</h3>
  
  <div className="space-y-1 mb-4 text-center">
    <div className="text-sm text-gray-500 flex justify-start">
      Proveedor:{' '}
      <span className="font-medium text-primary-dark ">{producto.proveedor}</span>
    </div>
    
    <div className="flex  items-center justify-center gap-1">
      <div className="text-xs text-gray-500">
        Proveedor:{' '}
        <span className="font-medium text-base text-gray-700">
          ${Number(producto.precio_proveedor).toFixed(2)}
        </span>
      </div>
      
      <div className="text-xs text-gray-500">
        Variable:{' '}
        <span className="font-bold text-xl text-gray-700">
          ${Number(producto.precio_sugerido).toFixed(2)}
        </span>
      </div>
    </div>
  </div>
  
  <hr />

  <button className="flex items-center justify-center gap-2 text-primary font-bold text-base mt-4 w-full">
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id="mask0_1412_90" maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="21">
        <rect x="0.5" y="0.325195" width="20" height="20" fill="#D9D9D9"></rect>
      </mask>
      <g mask="url(#mask0_1412_90)">
        <path
          d="M10.5 8.3252L9.4375 7.2627L10.625 6.0752H7.5V4.5752H10.625L9.4375 3.3877L10.5 2.3252L13.5 5.3252L10.5 8.3252ZM5.99558 18.3252C5.58186 18.3252 5.22917 18.1779 4.9375 17.8833C4.64583 17.5887 4.5 17.2345 4.5 16.8208C4.5 16.4071 4.64731 16.0544 4.94192 15.7627C5.23654 15.471 5.59071 15.3252 6.00442 15.3252C6.41814 15.3252 6.77083 15.4725 7.0625 15.7671C7.35417 16.0617 7.5 16.4159 7.5 16.8296C7.5 17.2433 7.35269 17.596 7.05808 17.8877C6.76346 18.1794 6.40929 18.3252 5.99558 18.3252ZM14.9956 18.3252C14.5819 18.3252 14.2292 18.1779 13.9375 17.8833C13.6458 17.5887 13.5 17.2345 13.5 16.8208C13.5 16.4071 13.6473 16.0544 13.9419 15.7627C14.2365 15.471 14.5907 15.3252 15.0044 15.3252C15.4181 15.3252 15.7708 15.4725 16.0625 15.7671C16.3542 16.0617 16.5 16.4159 16.5 16.8296C16.5 17.2433 16.3527 17.596 16.0581 17.8877C15.7635 18.1794 15.4093 18.3252 14.9956 18.3252ZM1.5 3.8252V2.3252H4.27083L7.5 9.8252H13.7708L16.125 4.3252H17.75L15.1458 10.4085C15.0208 10.6863 14.8368 10.9085 14.5938 11.0752C14.3507 11.2419 14.0764 11.3252 13.7708 11.3252H7.10417L6.22917 12.8252H16.5V14.3252H6.25C5.66667 14.3252 5.22917 14.0717 4.9375 13.5648C4.64583 13.0578 4.64583 12.5613 4.9375 12.0752L6.02083 10.2002L3.29167 3.8252H1.5Z"
          fill="#005f7e"
        ></path>
      </g>
    </svg>
    Enviar a cliente
  </button>
</div>

          </div>
        ))}
      </div>
    </div>
  );
}
