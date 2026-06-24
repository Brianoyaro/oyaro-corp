import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// todo. implement these. I prefer using shadcn ui where possible
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';

import { AdminHome } from './pages/admin/AdminHome';
import CreateCategory from './pages/admin/CreateCategory';
import EditCategory from './pages/admin/EditCategory';

import  ProductForm  from './pages/ProductForm';
import EditProduct from './pages/EditProductForm';

// logon, signup, orders components

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
            <Router>
              <div className="min-h-screen bg-white flex-flex-col">
                <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      //
                      <Route path="/home" element={<Home />} />
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />


                      {/* <Route path="/create-category" element={<CreateCategory />} />
                      <Route path="/edit-category/:id" element={<EditCategory />} /> */}

                      <Route path="/create-product" element={<ProductForm /> } />
                      <Route path="/edit-product/:id" element={<EditProduct />} />
                      
                      <Route
                        path="/admin-home"
                        element={
                          <ProtectedRoute
                            roles={["ADMIN"]}
                          >
                            <AdminHome />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/create-category"
                        element={
                          <ProtectedRoute
                            roles={["ADMIN"]}
                          >
                            <CreateCategory />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/edit-category/:id"
                        element={
                          <ProtectedRoute
                            roles={["ADMIN"]}
                          >
                            <EditCategory />
                          </ProtectedRoute>
                        }
                      />

                      //
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute
                            roles={["ADMIN", "USER"]}
                          >
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                <Footer />
              </div>
            </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
