import { createBrowserRouter } from "react-router-dom";

// main app component
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Order from './pages/Order.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'

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

  // Product Detail Route
  {
    path: "/product/:productId",
    element: <ProductDetail />,
  },

  // Cart Route
  {
    path: "/cart",
    element: <Cart />,
  },

  // Order/Checkout Route
  {
    path: "/order",
    element: (
      <ProtectedRoute>
        <Order />
      </ProtectedRoute>
    ),
  },

  // Order Confirmation Route
  {
    path: "/order-confirmation/:orderId",
    element: <OrderConfirmation />,
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