import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Heart, Grid, List, Filter, ShoppingCart, Lock } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  provider: string;
  providerPrice: number;
  suggestedPrice: number;
  stock: number;
  image: string;
  isFavorite?: boolean;
  isPrivate?: boolean;
  hasOrders?: boolean;
}

export function Catalog() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = React.useState('Aleatorio');
  const [favorites, setFavorites] = React.useState(false);
  const [privateItems, setPrivateItems] = React.useState(false);
  const [withOrders, setWithOrders] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProvider, setSelectedProvider] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedCity, setSelectedCity] = React.useState('');
  const [priceRange, setPriceRange] = React.useState({ min: '0', max: '1000000' });
  const [stockRange, setStockRange] = React.useState({ min: '', max: '' });

  const products: Product[] = [
    {
      id: '1',
      name: 'Cadena Con Clave',
      category: 'Herramientas',
      provider: 'MAYORISTAS',
      providerPrice: 7.70,
      suggestedPrice: 35.00,
      stock: 300,
      image: 'https://images.unsplash.com/photo-1541873676-a18131494184?w=300&q=80'
    },
    {
      id: '2',
      name: 'Audifono Bluetooth F9',
      category: 'Tecnología',
      provider: 'MARCO',
      providerPrice: 33.00,
      suggestedPrice: 50.00,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80'
    },
    {
      id: '3',
      name: 'Liveri',
      category: 'Salud',
      provider: 'UNMERCO',
      providerPrice: 33.00,
      suggestedPrice: 99.00,
      stock: 497,
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&q=80'
    },
    {
      id: '4',
      name: 'Calefactor Para Autos',
      category: 'Tecnología',
      provider: 'VOCH',
      providerPrice: 31.00,
      suggestedPrice: 78.00,
      stock: 498,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&q=80'
    },
    {
      id: '5',
      name: 'Pulsera Luna',
      category: 'Belleza',
      provider: 'BARATISIMO',
      providerPrice: 11.00,
      suggestedPrice: 69.00,
      stock: 271,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=80'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-6">
          {/* Toggle Switches */}
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <Heart size={20} className="text-orange-500" />
              <span className="text-gray-700">Favoritos</span>
              <div className="relative inline-block w-10 h-6 ml-2">
                <input
                  type="checkbox"
                  checked={favorites}
                  onChange={(e) => setFavorites(e.target.checked)}
                  className="opacity-0 w-0 h-0"
                />
                <span className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-200 ${favorites ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <span className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 transform ${favorites ? 'translate-x-4' : 'translate-x-1'} top-1`} />
                </span>
              </div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Lock size={20} className="text-gray-500" />
              <span className="text-gray-700">Privados</span>
              <div className="relative inline-block w-10 h-6 ml-2">
                <input
                  type="checkbox"
                  checked={privateItems}
                  onChange={(e) => setPrivateItems(e.target.checked)}
                  className="opacity-0 w-0 h-0"
                />
                <span className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-200 ${privateItems ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <span className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 transform ${privateItems ? 'translate-x-4' : 'translate-x-1'} top-1`} />
                </span>
              </div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <ShoppingCart size={20} className="text-gray-500" />
              <span className="text-gray-700">Con ordenes</span>
              <div className="relative inline-block w-10 h-6 ml-2">
                <input
                  type="checkbox"
                  checked={withOrders}
                  onChange={(e) => setWithOrders(e.target.checked)}
                  className="opacity-0 w-0 h-0"
                />
                <span className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-200 ${withOrders ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <span className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 transform ${withOrders ? 'translate-x-4' : 'translate-x-1'} top-1`} />
                </span>
              </div>
            </label>
          </div>

          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de proveedor:
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Proveedor</option>
              <option value="MAYORISTAS">MAYORISTAS</option>
              <option value="MARCO">MARCO</option>
              <option value="UNMERCO">UNMERCO</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rango de precio:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span>—</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                placeholder="1.000.000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock mínimo:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={stockRange.min}
                onChange={(e) => setStockRange({ ...stockRange, min: e.target.value })}
                placeholder="Mínimo"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span>—</span>
              <input
                type="number"
                value={stockRange.max}
                onChange={(e) => setStockRange({ ...stockRange, max: e.target.value })}
                placeholder="Máximo"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categorías:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad:
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full md:w-1/4 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Seleccione una ciudad</option>
            <option value="lima">Lima</option>
            <option value="arequipa">Arequipa</option>
            <option value="trujillo">Trujillo</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Filter size={20} className="mr-2" />
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg shadow-sm overflow-hidden ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <Heart size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{product.category}</span>
                <span className="text-sm font-medium text-gray-700">Stock {product.stock}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
              <div className="space-y-1 mb-4">
                <div className="text-sm text-gray-500">
                  Provider: <span className="font-medium text-gray-700">{product.provider}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Precio proveedor: <span className="font-medium text-gray-700">PEN {product.providerPrice.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Precio sugerido: <span className="font-medium text-gray-700">PEN {product.suggestedPrice.toFixed(2)}</span>
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