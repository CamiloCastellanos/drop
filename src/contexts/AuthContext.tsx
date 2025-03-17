import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  register: (userData: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<{ uuid: string }>; // Cambié el tipo de retorno
  logout: () => void;
  user: any;
  isAuthenticated: boolean;
  loading: boolean; // Agregamos la propiedad loading
}

interface RegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  email: string;
  password: string;
  role: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga

  // Verificar si el usuario ya está autenticado al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Se termina la carga al verificar el token
  }, []);

  const register = async (userData: RegisterData) => {
    try {
      await axios.post('https://dropi.co.alexcode.org/api/register', userData);
    } catch (error: any) {
      console.error('Error al registrar usuario', error);
      throw new Error('Error al registrar usuario');
    }
  };

  const login = async (email: string, password: string): Promise<{ uuid: string }> => {
    setLoading(true); // Inicia la carga mientras se autentica
    try {
      const response = await axios.post('https://dropi.co.alexcode.org/api/login', { email, password });
      
      // Verificar que el servidor haya respondido correctamente
      if (response.data && response.data.uuid) {
        // Si se encontró el UUID, configuramos el estado
        setUser({
          userId: response.data.userId,
          email: response.data.email,
          role: response.data.role,
          uuid: response.data.uuid, // Guardamos el UUID en el estado
        });
    
        setIsAuthenticated(true); // Marcamos como autenticado
        localStorage.setItem('token', response.data.token); // Almacenamos el token (si es necesario)
  
        return { uuid: response.data.uuid }; // Aquí devolvemos el UUID, como se espera en el tipo
      } else {
        throw new Error('Respuesta inesperada del servidor. Usuario no encontrado o uuid no disponible');
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión', error);
      throw new Error('Error al iniciar sesión');
    } finally {
      setLoading(false); // Termina la carga después de la autenticación
    }
  };
  
  
  

  // Función logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ register, login, logout, user, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
