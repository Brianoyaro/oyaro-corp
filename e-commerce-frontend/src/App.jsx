import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './components/Dashboard';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';


// Auth pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';

// Admin pages
import { AdminHome } from './pages/admin/AdminHome';
import CreateCategory from './pages/admin/CreateCategory';
import EditCategory from './pages/admin/EditCategory';
import EditProduct from './pages/admin/EditProduct';
import CreateProduct from './pages/admin/CreateProduct';

// normal user pages
import ProductListView from './pages/ProductListView';
import ProductDetailView from './pages/ProductDetailView';


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
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />



                      {/* <Route path="/create-product" element={<CreateProduct /> } />
                      <Route path="/edit-product/:id" element={<EditProduct />} /> */}


                      <Route path="/products" element={<ProductListView />} />
                      <Route path="/product/:id" element={<ProductDetailView />} />

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
                      <Route
                        path="/create-product"
                        element={
                          <ProtectedRoute
                            roles={["ADMIN"]}
                          >
                            <CreateProduct />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/edit-product/:id"
                        element={
                          <ProtectedRoute
                            roles={["ADMIN"]}
                          >
                            <EditProduct />
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
