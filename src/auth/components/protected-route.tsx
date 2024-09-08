import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@cloudscape-design/components';

import { useAuth } from '../hooks/use-auth';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner size='large' />;
  }

  if (!user) {
    return <Navigate to='/auth' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
