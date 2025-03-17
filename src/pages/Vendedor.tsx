// src/pages/Vendedor.tsx
import React, { useEffect, useState, useMemo, FormEvent } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { Search, Edit3, Trash2 } from 'lucide-react';

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

export function Vendedor(): JSX.Element {
  const { user } = useAuth();

  // -------------------------------------------------------------------
  // 1) Manejo de user_uuid / user_id
  // -------------------------------------------------------------------
  const userUUID = user?.uuid || localStorage.getItem('user_uuid') || '';
  const [userID, setUserID] = useState<string | null>(
    user?.id?.toString() || localStorage.getItem('user_id')
  );

  const fetchUserID = async () => {
    if (!userUUID) return;
    try {
      const res = await axios.get(`/api/user-info?uuid=${userUUID}`);
      if (res.data?.id) {
        localStorage.setItem('user_id', String(res.data.id));
        setUserID(String(res.data.id));
      }
    } catch (err) {
      console.error('❌ Error obteniendo user_id:', err);
    }
  };

  // -------------------------------------------------------------------
  // 2) Manejo de la Tienda
  // -------------------------------------------------------------------
  const [store, setStore] = useState<any>(null); // si existe, tendremos la tienda
  const [showModal, setShowModal] = useState(false); // modal para crear tienda

  // Formulario para crear la tienda
  const [formData, setFormData] = useState({
    name: '',
    categories: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null); // archivo del logo

  const [isReady, setIsReady] = useState(false); // habilita la creación

  // -------------------------------------------------------------------
  // 3) CRUD de productos (si la tienda existe)
  // -------------------------------------------------------------------
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal "Agregar producto"
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductData, setNewProductData] = useState({
    nombre: '',
    categoria: '',
    precio_proveedor: '',
    precio_sugerido: '',
    stock: '',
    imagen: '',
  });

  // Modal "Editar producto"
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [editProductData, setEditProductData] = useState({
    nombre: '',
    categoria: '',
    precio_proveedor: '',
    precio_sugerido: '',
    stock: '',
    imagen: '',
  });

  // -------------------------------------------------------------------
  // Verificar userID y userUUID para habilitar la creación de tienda
  // -------------------------------------------------------------------
  useEffect(() => {
    if (userUUID && userID) {
      setIsReady(true);
    } else if (userUUID && !userID) {
      fetchUserID();
    } else {
      setIsReady(false);
    }
  }, [userUUID, userID]);

  // -------------------------------------------------------------------
  // Cargar la tienda del usuario (si existe)
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!userUUID) return;
    axios
      .get(`/api/stores?user_uuid=${userUUID}`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const tienda = res.data[0];
          if (tienda.categories) {
            tienda.categories = tienda.categories.split(',').map((t: string) => t.trim());
          }
          setStore(tienda);
        } else {
          setStore(null);
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setStore(null);
        } else {
          console.error('❌ Error al obtener la tienda:', err.response?.data || err.message);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar la tienda. Intente nuevamente.',
          });
        }
      });
  }, [userUUID]);

  // -------------------------------------------------------------------
  // Manejo de tags (categorías) para crear tienda
  // -------------------------------------------------------------------
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (!formData.categories.includes(tag)) {
        setFormData((prev) => ({ ...prev, categories: [...prev.categories, tag] }));
      }
      setTagInput('');
    }
  };
  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((t) => t !== tag),
    }));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  // Manejo del input file para logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    } else {
      setLogoFile(null);
    }
  };

  // -------------------------------------------------------------------
  // Crear tienda (POST /api/stores) con formData
  // -------------------------------------------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.categories.length === 0) {
      Swal.fire('Campos incompletos', 'Ingresa nombre y al menos una categoría', 'warning');
      return;
    }
    if (!userUUID || !userID) {
      Swal.fire('Error', 'No se encontró el identificador de usuario', 'error');
      return;
    }

    try {
      const sendData = new FormData();
      sendData.append('name', formData.name);
      sendData.append('categories', formData.categories.join(','));
      sendData.append('user_uuid', userUUID);
      sendData.append('user_id', userID);
      if (logoFile) {
        // 'logo' debe coincidir con uploadSuppliers.single('logo') en tu backend
        sendData.append('logo', logoFile);
      }

      const response = await axios.post('/api/stores', sendData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire('¡Tienda creada!', 'La tienda se ha creado correctamente.', 'success');
      setStore(response.data);
      setShowModal(false);
    } catch (error: any) {
      console.error('❌ Error al crear la tienda:', error.response?.data || error.message);
      Swal.fire('Error', error.response?.data?.error || 'No se pudo crear la tienda', 'error');
    }
  };

  // -------------------------------------------------------------------
  // CRUD Productos
  // -------------------------------------------------------------------
  const fetchProductos = () => {
    axios
      .get(`/api/productos?user_uuid=${userUUID}`)
      .then((res) => {
        setProductos(res.data || []);
      })
      .catch((err) => {
        console.error('Error al obtener productos:', err);
        Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
      });
  };

  useEffect(() => {
    if (store) {
      fetchProductos();
    }
  }, [store]);

  // Búsqueda local
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        p.proveedor.toLowerCase().includes(q)
    );
  }, [productos, searchQuery]);

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Agregar producto
  const openAddProductModal = () => {
    setNewProductData({
      nombre: '',
      categoria: '',
      precio_proveedor: '',
      precio_sugerido: '',
      stock: '',
      imagen: '',
    });
    setShowAddProductModal(true);
  };
  const closeAddProductModal = () => setShowAddProductModal(false);

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddProduct = () => {
    const {
      nombre,
      categoria,
      precio_proveedor,
      precio_sugerido,
      stock,
      imagen,
    } = newProductData;

    if (!nombre || !categoria || !precio_proveedor || !precio_sugerido || !stock) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    // Forzamos el proveedor = store.name
    axios
      .post('/api/productos', {
        nombre,
        categoria,
        proveedor: store?.name,
        precio_proveedor: Number(precio_proveedor),
        precio_sugerido: Number(precio_sugerido),
        stock: Number(stock),
        imagen,
        user_uuid: userUUID,
      })
      .then(() => {
        Swal.fire('Éxito', 'Producto creado exitosamente', 'success');
        setShowAddProductModal(false);
        fetchProductos();
      })
      .catch((err) => {
        console.error('Error al crear producto:', err);
        Swal.fire('Error', 'No se pudo crear el producto', 'error');
      });
  };

  // Editar producto
  const openEditProductModal = (prod: Producto) => {
    setEditingProduct(prod);
    setEditProductData({
      nombre: prod.nombre,
      categoria: prod.categoria,
      precio_proveedor: String(prod.precio_proveedor),
      precio_sugerido: String(prod.precio_sugerido),
      stock: String(prod.stock),
      imagen: prod.imagen,
    });
    setShowEditProductModal(true);
  };
  const closeEditProductModal = () => {
    setShowEditProductModal(false);
    setEditingProduct(null);
  };

  const handleEditProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProductData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const {
      nombre,
      categoria,
      precio_proveedor,
      precio_sugerido,
      stock,
      imagen,
    } = editProductData;

    if (!nombre || !categoria || !precio_proveedor || !precio_sugerido || !stock) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    // Forzamos el proveedor = store.name
    axios
      .put(`/api/productos/${editingProduct.id}`, {
        nombre,
        categoria,
        proveedor: store?.name,
        precio_proveedor: Number(precio_proveedor),
        precio_sugerido: Number(precio_sugerido),
        stock: Number(stock),
        imagen,
        user_uuid: userUUID,
      })
      .then(() => {
        Swal.fire('Éxito', 'Producto actualizado', 'success');
        setShowEditProductModal(false);
        setEditingProduct(null);
        fetchProductos();
      })
      .catch((err) => {
        console.error('Error al actualizar producto:', err);
        Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
      });
  };

  // Eliminar producto
  const handleDeleteProduct = (prod: Producto) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/productos/${prod.id}`)
          .then(() => {
            Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
            fetchProductos();
          })
          .catch((err) => {
            console.error('Error al eliminar producto:', err);
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
          });
      }
    });
  };

  // -------------------------------------------------------------------
  // Render principal
  // -------------------------------------------------------------------

  // Si no existe la tienda => mostrar el formulario para crearla
  if (!store) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
          disabled={!isReady}
        >
          Crear Tienda
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Crear Tienda</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', categories: [] });
                    setTagInput('');
                    setLogoFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✖
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {/* Nombre de la tienda */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Nombre de la tienda"
                      required
                    />
                  </div>

                  {/* Categorías (tags) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Categorías (Enter para agregar)
                    </label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Ej: Ropa, Tecnología..."
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.categories.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-200 rounded-full"
                        >
                          {tag}{' '}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-gray-500 hover:text-gray-700 ml-1"
                          >
                            ✖
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Logo (input file) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Logo de la tienda
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="block w-full text-sm text-gray-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!isReady}
                      className={`px-4 py-2 ${
                        isReady ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'
                      } text-white rounded-lg`}
                    >
                      Crear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Si la tienda ya existe => mostrar CRUD de productos
  // -------------------------------------------------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

      {/* Filtro y botones */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={openAddProductModal}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + Agregar
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Exportar
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow-sm mt-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio Prov.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio Sug.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    No hay resultados
                  </td>
                </tr>
              ) : (
                currentProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td className="px-6 py-4">{prod.id}</td>
                    <td className="px-6 py-4">{prod.nombre}</td>
                    <td className="px-6 py-4">{prod.categoria}</td>
                    <td className="px-6 py-4">{prod.proveedor}</td>
                    <td className="px-6 py-4">{prod.precio_proveedor}</td>
                    <td className="px-6 py-4">{prod.precio_sugerido}</td>
                    <td className="px-6 py-4">{prod.stock}</td>
                    <td className="px-6 py-4">
                      {prod.imagen ? (
                        <img
                          src={prod.imagen}
                          alt={prod.nombre}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        'Sin imagen'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => openEditProductModal(prod)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteProduct(prod)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => goToPrevPage()}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToNextPage()}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Agregar producto */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Agregar Producto</h2>
              <button
                onClick={closeAddProductModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={newProductData.nombre}
                  onChange={handleNewProductChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  name="categoria"
                  value={newProductData.categoria}
                  onChange={handleNewProductChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              {/* Proveedor => solo lectura con store?.name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor
                </label>
                <input
                  type="text"
                  value={store?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  readOnly
                />
              </div>
              {/* Precios */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Prov.
                  </label>
                  <input
                    type="number"
                    name="precio_proveedor"
                    value={newProductData.precio_proveedor}
                    onChange={handleNewProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Sug.
                  </label>
                  <input
                    type="number"
                    name="precio_sugerido"
                    value={newProductData.precio_sugerido}
                    onChange={handleNewProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              {/* Stock + Imagen */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={newProductData.stock}
                    onChange={handleNewProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen (URL)
                  </label>
                  <input
                    type="text"
                    name="imagen"
                    value={newProductData.imagen}
                    onChange={handleNewProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              {/* Botón Guardar */}
              <div className="flex justify-end">
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar producto */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Editar Producto</h2>
              <button
                onClick={closeEditProductModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={editProductData.nombre}
                  onChange={handleEditProductChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  name="categoria"
                  value={editProductData.categoria}
                  onChange={handleEditProductChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              {/* Proveedor => solo lectura con store?.name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor
                </label>
                <input
                  type="text"
                  value={store?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  readOnly
                />
              </div>
              {/* Precios */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Prov.
                  </label>
                  <input
                    type="number"
                    name="precio_proveedor"
                    value={editProductData.precio_proveedor}
                    onChange={handleEditProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Sug.
                  </label>
                  <input
                    type="number"
                    name="precio_sugerido"
                    value={editProductData.precio_sugerido}
                    onChange={handleEditProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              {/* Stock + Imagen */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editProductData.stock}
                    onChange={handleEditProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen (URL)
                  </label>
                  <input
                    type="text"
                    name="imagen"
                    value={editProductData.imagen}
                    onChange={handleEditProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              {/* Botón Actualizar */}
              <div className="flex justify-end">
                <button
                  onClick={handleUpdateProduct}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendedor;
