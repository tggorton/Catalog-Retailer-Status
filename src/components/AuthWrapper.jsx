import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, saving the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // If authenticated, render the children components
};

export default AuthWrapper; 