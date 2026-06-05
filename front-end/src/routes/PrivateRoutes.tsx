import { Navigate, Outlet } from 'react-router-dom';

import { routePaths } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';

export default function PrivateRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate replace to={routePaths.dashboard} />;
  }

  return <Outlet />;
}
