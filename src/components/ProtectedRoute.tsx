import { useAuth } from '@/context/auth-context';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de login avec l'URL de retour
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}