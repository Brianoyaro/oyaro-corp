import { createBrowserRouter } from "react-router-dom";

// main app component
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

// authentication pages
import Login from './pages/authentication/Login.jsx'
import Register from './pages/authentication/Register.jsx'

// error pages
import NotFound from './pages/errors/NotFound.jsx'

// protected route
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  // Home Route - Dashboard
  {
    path: "/",
    element: <Dashboard />,
  },

  // Authentication Routes
  // Login Route
  {
    path: "/login",
    element: <Login />,
  },
  // Register Route
  {
    path: "/register",
    element: <Register />,
  },

  // Admin Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },


  // Error Routes
  // 404 Not Found Route
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;