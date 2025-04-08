// src/components/PublicRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/auth';

export default function PublicRoute({ children }: { children: ReactNode }) {
  const token = getToken();

  // If user is logged in, redirect to /home
  if (token) {
    return <Navigate to="/home" replace />;
  }

  // Otherwise, show the public page (like login)
  return <>{children}</>;
}
