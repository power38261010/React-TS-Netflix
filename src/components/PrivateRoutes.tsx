// src/components/PrivateRoutes.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  roles?: string[]; // Lista de roles permitidos para acceder a la ruta
}

const PrivateRoute: React.FC <PrivateRouteProps> = ({ roles }) => {
  const { isAuthenticated, profile ,verifyTokenInServer } = useAuth();

  if (!isAuthenticated() || !verifyTokenInServer() ) {
    return <Navigate to="/login" />;
  }

  if (roles && roles.length > 0 && profile && !roles.includes(profile.role)) {
    if ( ["admin","super_admin"].includes(profile.role)) return <Navigate to="/admin-dashboard" />;
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
