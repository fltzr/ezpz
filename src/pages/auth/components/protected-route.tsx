import { Navigate, Outlet } from 'react-router-dom';
import { LoadingBar } from '@cloudscape-design/chat-components';

import { useAuth } from '../hooks/use-auth';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingBar variant='gen-ai-masked' />;
  }

  if (!user) {
    return <Navigate to='/auth' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
