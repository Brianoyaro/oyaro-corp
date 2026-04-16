import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const accessToken = localStorage.getItem('accessToken');

  // Check if user is logged in
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, you'd need to decode the JWT
  // For now, we'll just check if the token exists
  // In production, you should decode the JWT and check the role claim

  return children;
}
