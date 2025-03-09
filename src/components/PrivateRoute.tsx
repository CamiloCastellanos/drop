import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Allow guest access for demo purposes
  return <>{children}</>;
  
  // In a real implementation, we would use:
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }
  // return <>{children}</>;
}