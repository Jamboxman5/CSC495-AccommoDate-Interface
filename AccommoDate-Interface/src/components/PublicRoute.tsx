import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/auth';

export default function PublicRoute({ children }: { children: ReactNode }) {
  const token = getToken();

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
