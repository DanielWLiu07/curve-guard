import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';

export default function ProtectedApp() {
  const { user } = useAuthenticator();

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect authenticated users to detection page
  return <Navigate to="/detection" replace />;
}