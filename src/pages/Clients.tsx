import React from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import {
  Search,
  Plus,
  FileSpreadsheet,
  X,
  MapPin,
  Mail,
  Phone,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  Check
} from 'lucide-react';

interface Client {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  identificacion: string;
  direccion1: string;
  direccion2: string;
  departamento_id: number;
  ciudad_id: number;
  fecha_registro: string;
  department_name?: string;
  city_name?: string;
}

interface Department {
  id: string;
  name: string;
}

interface City {
  id: string;
  nombre: string;
  departamento_id: string;
}

const itemsPerPage = 5;

export function Clients() {
  const { t } = useTranslation();

  // ========================
  // Estados
  // ========================
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [formData, setFormData] = React.useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    identification: '',
    address1: '',
    address2: '',
    department: '',
    city: '',
    marketing: false
  });

  // Departamentos y ciudades (para formulario "Agregar")
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [cities, setCities] = React.useState<City[]>([]);

  // Lista de clientes
  const [clients, setClients] = React.useState<Client[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Edición inline
  const [openRowId, setOpenRowId] = React.useState<string | null>(null);
  const [editingClientId, setEditingClientId] = React.useState<string | null>(null);
  const [editingClientData, setEditingClientData] = React.useState<Partial<Client>>({});
  const [editCities, setEditCities] = React.useState<City[]>([]);

  // ========================
  // useEffect: Cargar clientes
  // ========================
  React.useEffect(() => {
    const userUUID = localStorage.getItem('user_uuid');
    console.log('User UUID obtenido:', userUUID);

    fetch(`https://dropi.co.alexcode.org/api/clients?user_uuid=${userUUID}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Clientes recibidos:', data);
        setClients(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error('Error fetching clients:', error));
  }, []);

  // ========================
  // useEffect: Cargar departamentos
  // ========================
  React.useEffect(() => {
    fetch('https://dropi.co.alexcode.org/api/departments')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Departamentos cargados:', data);
        setDepartments(data);
      })
      .catch((error) => console.error('Error fetching departments:', error));
  }, []);

  // ========================
  // Funciones de paginación (definidas UNA SOLA VEZ)
  // ========================
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // ========================
  // Funciones para formulario "Agregar"
  // ========================
  const handleDepartmentChange = (deptId: string) => {
    setFormData({ ...formData, department: deptId, city: '' });
    fetch(`https://dropi.co.alexcode.org/api/cities/${deptId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Ciudades (form):', data);
        setCities(data);
      })
      .catch((error) => console.error('Error fetching cities:', error));
  };

  const handleSaveClient = () => {
    const userUUID = localStorage.getItem('user_uuid');
    console.log('Guardando cliente con user_uuid:', userUUID);

    const payload = {
      ...formData,
      user_uuid: userUUID,
    };

    fetch('https://dropi.co.alexcode.org/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Error al guardar el cliente:', data.error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error,
          });
          return;
        }
        console.log('Cliente guardado:', data);
        Swal.fire({
          icon: 'success',
          title: 'Cliente guardado',
          text: 'El cliente ha sido agregado correctamente.',
          confirmButtonText: 'Aceptar',
        });
        setShowAddModal(false);
        // Recargar la lista de clientes
        const userUUIDReload = localStorage.getItem('user_uuid');
        fetch(`https://dropi.co.alexcode.org/api/clients?user_uuid=${userUUIDReload}`)
          .then((res2) => res2.json())
          .then((updatedData) => setClients(Array.isArray(updatedData) ? updatedData : []))
          .catch((err) => console.error('Error recargando clientes:', err));
      })
      .catch((err) => {
        console.error('Error al guardar el cliente:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar el cliente.',
        });
      });
  };

  // ========================
  // Funciones de edición inline
  // ========================
  const handleEdit = (client: Client) => {
    setEditingClientId(client.id);
    setEditingClientData({ ...client });
    if (client.departamento_id) {
      fetch(`https://dropi.co.alexcode.org/api/cities/${client.departamento_id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Ciudades (edición):', data);
          setEditCities(data);
        })
        .catch((error) => console.error('Error fetching cities for edit:', error));
    } else {
      setEditCities([]);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingClientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeptId = e.target.value;
    setEditingClientData((prev) => ({
      ...prev,
      departamento_id: Number(newDeptId),
      ciudad_id: 0,
    }));
    fetch(`https://dropi.co.alexcode.org/api/cities/${newDeptId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Ciudades (nuevo dept en edición):', data);
        setEditCities(data);
      })
      .catch((error) => console.error('Error fetching cities:', error));
  };

  const handleUpdateClient = () => {
    fetch(`https://dropi.co.alexcode.org/api/clients/${editingClientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingClientData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Cliente actualizado:', data);
        setClients((prev) =>
          prev.map((cli) =>
            cli.id === editingClientId ? { ...cli, ...editingClientData } : cli
          )
        );
        setEditingClientId(null);
        setEditingClientData({});
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El cliente ha sido actualizado correctamente.',
          confirmButtonText: 'Aceptar',
        });
      })
      .catch((error) => {
        console.error('Error updating client:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el cliente.',
        });
      });
  };

  // ========================
  // Función para borrar cliente
  // ========================
  const handleDeleteClient = (clientId: string) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción borrará el cliente permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://dropi.co.alexcode.org/api/clients/${clientId}`, { method: 'DELETE' })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log('Cliente borrado:', data);
            setClients((prev) => prev.filter((client) => client.id !== clientId));
            Swal.fire({
              icon: 'success',
              title: 'Borrado',
              text: 'El cliente ha sido borrado correctamente.',
              confirmButtonText: 'Aceptar',
            });
          })
          .catch((error) => {
            console.error('Error borrando cliente:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al borrar el cliente.',
            });
          });
      }
    });
  };

  // ========================
  // Función para colapso
  // ========================
  const toggleRow = (clientId: string) => {
    setOpenRowId((prev) => (prev === clientId ? null : clientId));
  };

  // ========================
  // Búsqueda
  // ========================
  const filteredClients = clients.filter((client) => {
    const q = searchQuery.toLowerCase();
    return (
      client.nombre.toLowerCase().includes(q) ||
      client.apellido.toLowerCase().includes(q) ||
      client.telefono.toLowerCase().includes(q) ||
      client.correo.toLowerCase().includes(q)
    );
  });

  // ========================
  // Paginación (cálculos)
  // ========================
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  // ========================
  // Función para exportar a XML (formato Excel)
  // ========================
  const handleExport = () => {
    // Encabezado de XML
    const xmlHeader = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Clientes">
    <Table>
      <Row>
        <Cell><Data ss:Type="String">ID</Data></Cell>
        <Cell><Data ss:Type="String">Nombre</Data></Cell>
        <Cell><Data ss:Type="String">Apellido</Data></Cell>
        <Cell><Data ss:Type="String">Teléfono</Data></Cell>
        <Cell><Data ss:Type="String">Correo</Data></Cell>
        <Cell><Data ss:Type="String">Identificación</Data></Cell>
        <Cell><Data ss:Type="String">Dirección 1</Data></Cell>
        <Cell><Data ss:Type="String">Dirección 2</Data></Cell>
        <Cell><Data ss:Type="String">Departamento</Data></Cell>
        <Cell><Data ss:Type="String">Ciudad</Data></Cell>
        <Cell><Data ss:Type="String">Fecha Registro</Data></Cell>
      </Row>`;

    // Filas de datos
    const xmlRows = clients
      .map((client) => `
      <Row>
        <Cell><Data ss:Type="String">${client.id}</Data></Cell>
        <Cell><Data ss:Type="String">${client.nombre}</Data></Cell>
        <Cell><Data ss:Type="String">${client.apellido}</Data></Cell>
        <Cell><Data ss:Type="String">${client.telefono}</Data></Cell>
        <Cell><Data ss:Type="String">${client.correo}</Data></Cell>
        <Cell><Data ss:Type="String">${client.identificacion}</Data></Cell>
        <Cell><Data ss:Type="String">${client.direccion1}</Data></Cell>
        <Cell><Data ss:Type="String">${client.direccion2}</Data></Cell>
        <Cell><Data ss:Type="String">${client.department_name || client.departamento_id}</Data></Cell>
        <Cell><Data ss:Type="String">${client.city_name || client.ciudad_id}</Data></Cell>
        <Cell><Data ss:Type="String">${client.fecha_registro}</Data></Cell>
      </Row>`)
      .join('');

    // Pie de XML
    const xmlFooter = `
    </Table>
  </Worksheet>
</Workbook>`;

    const xmlContent = xmlHeader + xmlRows + xmlFooter;
    // Generar blob
    const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
    // Crear URL y disparar descarga
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ========================
  // Render principal
  // ========================
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Clientes</h1>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Input de búsqueda */}
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

        {/* Botones "Agregar" y "Exportar" */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} className="mr-2" />
            Agregar
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FileSpreadsheet size={20} className="mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg shadow-sm">
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
                  Apellido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Correo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No hay resultados
                  </td>
                </tr>
              ) : (
                currentClients.map((client) => (
                  <React.Fragment key={client.id}>
                    {/* Fila principal */}
                    <tr>
                      <td className="px-6 py-4">{client.id}</td>
                      <td className="px-6 py-4">
                        {editingClientId === client.id ? (
                          <input
                            type="text"
                            name="nombre"
                            value={editingClientData.nombre || ''}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          client.nombre
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingClientId === client.id ? (
                          <input
                            type="text"
                            name="apellido"
                            value={editingClientData.apellido || ''}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          client.apellido
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingClientId === client.id ? (
                          <input
                            type="text"
                            name="telefono"
                            value={editingClientData.telefono || ''}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          client.telefono
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingClientId === client.id ? (
                          <input
                            type="text"
                            name="correo"
                            value={editingClientData.correo || ''}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          client.correo
                        )}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        {editingClientId === client.id ? (
                          <button
                            className="text-green-500 hover:text-green-700"
                            onClick={handleUpdateClient}
                          >
                            <Check size={16} />
                          </button>
                        ) : (
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEdit(client)}
                          >
                            <Edit3 size={16} />
                          </button>
                        )}
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() => toggleRow(client.id)}
                        >
                          {openRowId === client.id ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>

                    {/* Fila colapsada */}
                    {openRowId === client.id && (
                      <tr className="bg-gray-100">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="overflow-hidden transition-all duration-300 ease-in-out">
                            <table className="w-full text-sm text-gray-700">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left">Identificación</th>
                                  <th className="px-4 py-2 text-left">Dirección 1</th>
                                  <th className="px-4 py-2 text-left">Dirección 2</th>
                                  <th className="px-4 py-2 text-left">Departamento</th>
                                  <th className="px-4 py-2 text-left">Ciudad</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-white">
                                  <td className="px-4 py-2">
                                    {editingClientId === client.id ? (
                                      <input
                                        type="text"
                                        name="identificacion"
                                        value={editingClientData.identificacion || ''}
                                        onChange={handleEditChange}
                                        className="border border-gray-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      client.identificacion
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    {editingClientId === client.id ? (
                                      <input
                                        type="text"
                                        name="direccion1"
                                        value={editingClientData.direccion1 || ''}
                                        onChange={handleEditChange}
                                        className="border border-gray-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      client.direccion1
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    {editingClientId === client.id ? (
                                      <input
                                        type="text"
                                        name="direccion2"
                                        value={editingClientData.direccion2 || ''}
                                        onChange={handleEditChange}
                                        className="border border-gray-300 rounded px-2 py-1"
                                      />
                                    ) : (
                                      client.direccion2
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    {editingClientId === client.id ? (
                                      <select
                                        name="departamento_id"
                                        value={editingClientData.departamento_id ?? ''}
                                        onChange={handleDepartmentSelectChange}
                                        className="border border-gray-300 rounded px-2 py-1"
                                      >
                                        <option value="">-- Seleccione --</option>
                                        {departments.map((dept) => (
                                          <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      client.department_name
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    {editingClientId === client.id ? (
                                      <select
                                        name="ciudad_id"
                                        value={editingClientData.ciudad_id ?? ''}
                                        onChange={handleEditChange}
                                        className="border border-gray-300 rounded px-2 py-1"
                                      >
                                        <option value="">-- Seleccione --</option>
                                        {editCities.map((city) => (
                                          <option key={city.id} value={city.id}>
                                            {city.nombre}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      client.city_name
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={goToPrevPage}
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
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal para agregar cliente */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Agregar Cliente</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {/* Formulario de agregar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre (s)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    placeholder="lastname"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="Correo"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Identificación</label>
                  <input
                    type="text"
                    placeholder="identification"
                    value={formData.identification}
                    onChange={(e) => setFormData({ ...formData, identification: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección 1</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Dirección"
                      value={formData.address1}
                      onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección 2</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Dirección"
                      value={formData.address2}
                      onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccione un departamento</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!formData.department}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="">Seleccione una ciudad</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                {/* Checkbox marketing si se necesita */}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSaveClient}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
