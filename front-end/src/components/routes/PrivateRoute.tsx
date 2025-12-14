import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  // 1. Tenta pegar o token salvo
  const token = localStorage.getItem('token');

  // 2. Se NÃO tiver token, redireciona para o login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se tiver token, renderiza o componente filho (o Dashboard)
  return <>{children}</>;
}