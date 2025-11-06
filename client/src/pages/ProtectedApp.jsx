import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';

export default function ProtectedApp() {
  const { user } = useAuthenticator();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/detect" replace />;
}