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
              <Heart size={20} className="text-orange-500" />
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
                    favoritos ? 'bg-orange-500' : 'bg-gray-200'
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
                    privados ? 'bg-orange-500' : 'bg-gray-200'
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
                    conOrdenes ? 'bg-orange-500' : 'bg-gray-200'
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
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span>—</span>
              <input
                type="number"
                value={rangoPrecio.max}
                onChange={(e) =>
                  setRangoPrecio({ ...rangoPrecio, max: e.target.value })
                }
                placeholder="1.000.000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span>—</span>
              <input
                type="number"
                value={rangoStock.max}
                onChange={(e) =>
                  setRangoStock({ ...rangoStock, max: e.target.value })
                }
                placeholder="Máximo"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="w-full md:w-1/4 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>Aleatorio</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
            <option>Stock: Menor a Mayor</option>
            <option>Stock: Mayor a Menor</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Vista:</span>
          <button
            onClick={() => setModoVista('cuadricula')}
            className={`p-2 rounded-lg ${
              modoVista === 'cuadricula' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setModoVista('lista')}
            className={`p-2 rounded-lg ${
              modoVista === 'lista' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Grid o lista de productos */}
      <div
        className={
          modoVista === 'cuadricula'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
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
                <span className="text-sm font-medium text-gray-700">Stock {producto.stock}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{producto.nombre}</h3>
              <div className="space-y-1 mb-4">
                <div className="text-sm text-gray-500">
                  Proveedor:{' '}
                  <span className="font-medium text-gray-700">{producto.proveedor}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Precio proveedor:{' '}
                  <span className="font-medium text-gray-700">
                    PEN {Number(producto.precio_proveedor).toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Precio sugerido:{' '}
                  <span className="font-medium text-gray-700">
                    PEN {Number(producto.precio_sugerido).toFixed(2)}
                  </span>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
                Enviar a cliente
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
