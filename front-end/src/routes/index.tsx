import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { routePaths } from '@/constants/routes';
import DashboardPage from '@/pages/Main/Dashboard';
import PrivateRoutes from '@/routes/PrivateRoutes';
import PublicRoutes from '@/routes/PublicRoutes';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routePaths.home} element={<Navigate replace to={routePaths.dashboard} />} />

        <Route element={<PublicRoutes />}>
          <Route path={routePaths.dashboard} element={<DashboardPage />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path={routePaths.privateArea} element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate replace to={routePaths.dashboard} />} />
      </Routes>
    </BrowserRouter>
  );
}
