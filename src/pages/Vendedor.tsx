import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';

export function Vendedor(): JSX.Element {
  const { user } = useAuth();
  // Obtenemos el user_uuid del contexto o localStorage
  const userUUID = user?.uuid || localStorage.getItem('user_uuid');

  const [store, setStore] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  // formData contiene el nombre de la tienda y las categorías (como arreglo de strings)
  const [formData, setFormData] = useState({ name: '', categories: [] as string[] });
  // Valor temporal para el input de tags
  const [tagInput, setTagInput] = useState('');

  // Cargar la tienda del usuario al montar, utilizando el userUUID
  useEffect(() => {
    if (userUUID) {
      axios
        .get(`/api/stores/${userUUID}`)
        .then((res) => {
          if (res.data && res.data.categories) {
            // Convertir el string de categorías en un arreglo, eliminando espacios en blanco
            res.data.categories = res.data.categories.split(',').map((tag: string) => tag.trim());
          }
          setStore(res.data);
        })
        .catch((err) => {
          // Si se recibe un 404, significa que no existe tienda para este usuario; lo manejamos silenciosamente
          if (err.response && err.response.status === 404) {
            console.log('No se encontró tienda para este usuario, se mostrará el formulario');
            setStore(null);
          } else {
            console.error('Error al obtener la tienda:', err);
          }
        });
    } else {
      console.error('No se encontró user_uuid.');
    }
  }, [userUUID]);

  // Manejar ingreso de tags: al presionar "Enter", se agrega el tag si no está vacío y no se repite.
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

  // Eliminar un tag
  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((t) => t !== tag),
    }));
  };

  // Manejar el cambio en el input de nombre
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  // Manejar el envío del formulario para crear la tienda
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.categories.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Debes ingresar el nombre de la tienda y al menos una categoría',
      });
      return;
    }

    if (!userUUID) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el identificador de usuario. Por favor inicia sesión nuevamente.',
      });
      return;
    }

    const payload = {
      name: formData.name,
      categories: formData.categories.join(','), // Unir los tags en un string separado por comas
      user_uuid: userUUID, // Si decides conservarlo en la tabla; en este ejemplo puedes eliminarlo según convenga
    };

    console.log('Enviando payload para crear tienda:', payload);

    try {
      await axios.post('/api/stores', payload);
      Swal.fire({
        icon: 'success',
        title: '¡Tienda creada!',
        text: 'La tienda se ha creado correctamente.',
        confirmButtonText: 'Aceptar'
      });
      setShowModal(false);
      window.location.reload(); // Recargar la página para mostrar el CRUD de productos
    } catch (error: any) {
      console.error('Error al crear la tienda:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'No se pudo crear la tienda. Intente nuevamente.',
      });
    }
  };

  // Si no existe la tienda, se muestra el botón y modal para crearla
  if (!store) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
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
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nombre de la tienda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categorías (presiona Enter para agregar)
                    </label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Ej: Ropa, Tecnología, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.categories.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
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

  // Si ya existe la tienda, mostrar el CRUD de productos (o la vista correspondiente)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
      {/* Aquí se mostrará el CRUD de productos para la tienda */}
    </div>
  );
}

export default Vendedor;
