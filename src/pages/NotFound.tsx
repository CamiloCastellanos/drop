import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500">404 - Página no encontrada</h1>
      <p className="text-lg mt-4">Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/login" className="mt-4 text-blue-500">Volver al inicio</Link>
    </div>
  );
}
