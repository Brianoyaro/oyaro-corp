import { Navigate, useLocation } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../hook/useAuth";
import { useProfile } from "../hook/userProfileHook";


/**
 * ProtectedRoute Component
 * Redirects to login if user is not authenticated
 * Shows loading spinner while checking authentication
 */
export function ProtectedRoute({ 
  children,
  roles = [],
 }) {
  const { isAuthenticated, authLoading } = useAuth();
  const {data: user, isLoading: profileLoading} = useProfile();
  const location = useLocation();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  // If roles are specified, check if the user has the required role
  if (roles.length > 0) {
    const userRole = (user?.role || '').toUpperCase();
    if (!user || !roles.map(role => role.toUpperCase()).includes(userRole)) {
      return <Navigate to="/unauthorized" replace />; //redirect to an unauthorized page or dashboard 'or homepage' if user doesn't have the required role
    }
  }

  return children;
}