import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/useAdminAuth';
import AdminAuth from './AdminAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/admin' 
}) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  // While the session is being restored (e.g. after a page refresh) render
  // nothing instead of flashing a spinner or the sign-in screen.
  if (isLoading) {
    return null;
  }


  // If not authenticated, show the admin auth component
  if (!isAuthenticated) {
    return <AdminAuth />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
