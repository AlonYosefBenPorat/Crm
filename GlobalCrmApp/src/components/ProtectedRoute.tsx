import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isLoggedIn, role } = useContext(AuthContext);

  console.log('ProtectedRoute - isLoggedIn:', isLoggedIn);
  console.log('ProtectedRoute - role:', role);
  console.log('ProtectedRoute - allowedRoles:', allowedRoles);

  if (!isLoggedIn || !allowedRoles.includes(role)) {
    return <Navigate to="/no-permission" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;