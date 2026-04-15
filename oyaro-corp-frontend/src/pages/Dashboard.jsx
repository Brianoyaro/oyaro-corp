import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiStar, FiLogOut } from 'react-icons/fi';
import productService from '../service/productService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await productService.getCategories();
      return response.data;
    },
  });

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      if (selectedCategory) {
        const response = await productService.getProductsByCategory(selectedCategory);
        return response.data;
      } else {
        const response = await productService.getAllProducts();
        return response.data;
      }
    },
  });

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // Flatten category tree for sidebar display
  const flattenCategories = (nodes) => {
    if (!nodes) return [];
    let flattened = [];
    const traverse = (node, level = 0) => {
      flattened.push({ ...node, level });
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverse(child, level + 1));
      }
    };
    nodes.forEach((node) => traverse(node));
    return flattened;
  };

  const flatCategories = flattenCategories(categoriesData);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Oyaro Corp</h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <FiShoppingCart size={24} />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiLogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside
          className={`fixed lg:relative left-0 top-[73px] lg:top-0 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } lg:w-64`}
          style={{ height: 'calc(100vh - 73px)' }}
        >
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Categories</h2>

            <div className="space-y-2">
              {/* All Products Option */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Products
              </button>

              {/* Categories List */}
              {categoriesLoading ? (
                <div className="text-gray-500 text-sm py-4">Loading categories...</div>
              ) : flatCategories.length > 0 ? (
                flatCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={{ paddingLeft: `${1.5 + category.level * 1}rem` }}
                  >
                    {category.name}
                  </button>
                ))
              ) : (
                <div className="text-gray-500 text-sm py-4">No categories available</div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Section Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedCategory ? 'Category Products' : 'All Products'}
              </h2>
              <p className="text-gray-600 mt-2">
                {productsData?.length || 0} products available
              </p>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 w-full h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                  </div>
                ))}
              </div>
            ) : productsData?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData.map((product) => {
                  // Get primary image or first image
                  const primaryImage =
                    product.images?.find((img) => img.isPrimary) || product.images?.[0];

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {primaryImage ? (
                          <img
                            src={primaryImage.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FiShoppingCart size={48} />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Rating (mock) */}
                        <div className="flex items-center gap-1 mt-3 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              size={16}
                              className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">(24)</span>
                        </div>

                        {/* Price and Button */}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            KES {product.price?.toLocaleString()}
                          </span>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                            <FiShoppingCart size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
