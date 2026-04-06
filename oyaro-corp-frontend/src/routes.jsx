import { createBrowserRouter } from "react-router-dom";

// main app component
import App from './App.jsx'

// authentication pages
import Login from './pages/authentication/Login.jsx'
import Register from './pages/authentication/Register.jsx'

// error pages
import NotFound from './pages/errors/NotFound.jsx'

const router = createBrowserRouter([
  // Home Route
  {
    path: "/",
    element: <App />,
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


  // Error Routes
  // 404 Not Found Route
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;