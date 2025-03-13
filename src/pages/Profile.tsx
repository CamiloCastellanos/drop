import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

export function Profile() {
  const { t } = useTranslation();
  const [scannedIdFile, setScannedIdFile] = useState<File | null>(null);
  const [phoneCode, setPhoneCode] = useState('51');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Obtener UUID del usuario desde localStorage
  const userUuid = localStorage.getItem('user_uuid');
  console.log('UUID desde localStorage:', userUuid);

  // Obtener los datos del usuario desde localStorage o API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userUuid) {
        console.error('No UUID encontrado en localStorage.');
        return;
      }

      try {
        const response = await fetch(`/api/user?uuid=${userUuid}`);
        const data = await response.json();
        
        if (response.ok && data) {
          console.log('Datos obtenidos del servidor:', data);
          setUserData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
          });
        } else {
          console.error('Error al obtener los datos:', data);
        }
      } catch (error) {
        console.error('Error al hacer la solicitud API:', error);
      }
    };

    fetchUserData();
  }, [userUuid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    if (!userUuid) {
      console.error('No UUID encontrado. No se puede guardar el perfil.');
      return;
    }

    const formData = new FormData();
    formData.append('first_name', userData.firstName);
    formData.append('last_name', userData.lastName);
    formData.append('email', userData.email);
    formData.append('phone_code', phoneCode);
    formData.append('phone', userData.phone);
    formData.append('address', userData.address);

    if (selectedFile) {
      formData.append('profile_image', selectedFile);
    }

    if (scannedIdFile) {
      formData.append('cedula_image', scannedIdFile);
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          Authorization: userUuid,
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        console.error('Error en la respuesta:', response.status);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al guardar tu perfil.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        return;
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        Swal.fire({
          title: '¡Éxito!',
          text: 'Tu perfil ha sido guardado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        localStorage.setItem('userData', JSON.stringify(userData));

        if (selectedFile) {
          localStorage.setItem('profileImage', selectedFile.name);
        }
      } else {
        console.error('La respuesta no es JSON:', await response.text());
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al procesar la solicitud.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Datos Personales</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-700">Los campos con asterisco(*) son obligatorios</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido (s) *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de Contacto *
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <div className="flex space-x-2">
                  <div className="w-24">
                    <select
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="57">🇨🇴 57</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección *
              </label>
              <textarea
                rows={4}
                name="address"
                value={userData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex justify-end">
              <button onClick={handleSave} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
