import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user === null) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
