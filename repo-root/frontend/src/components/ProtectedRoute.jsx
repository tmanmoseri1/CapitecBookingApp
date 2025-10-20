// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access (optional)
  if (roles && !roles.some(role => user.roles?.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
