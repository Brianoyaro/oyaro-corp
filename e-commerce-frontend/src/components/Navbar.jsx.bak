import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, use } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaBox, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../hook/useCart';
import { useAuth } from '../hook/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useProducts } from '../hook/useProducts';
import { useCategories } from '../hook/useCategory';
import { useProfile } from '../hook/userProfileHook';


export function  Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const searchRef = useRef(null);
  const authMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount() || 0;
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { data: user, isLoading } = useProfile();
  const isAdmin = user?.role?.toLowerCase().includes(("ADMIN").toLowerCase());

  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'products', label: 'Products', path: '/products' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];


  const isActive = (path) => location.pathname === path;

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Get all products flattened
  const allProducts = products || [];

  // Search filtering logic
  const searchResults =
    searchQuery.trim().length > 0
        ? allProducts.filter((product) => {
            const query = searchQuery.toLowerCase();

            return (
            product.name?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.categoryName?.toLowerCase().includes(query)
            );
        })
        : [];

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchModal]);

  // Close search modal on Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowSearchModal(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  // Close auth menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setIsAuthMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAuthMenuOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchResults(false);
      setShowSearchModal(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setShowSearchResults(false);
    setShowSearchModal(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Navbar */}
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <span className="ml-2 text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              MavunoHub
            </span>
          </Link>

          {/* Desktop Navigation Links - Center */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`font-medium text-sm transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section - Search, Cart & Menu Button */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Icon */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              aria-label="Search"
              title="Search products"
            >
              <FaSearch className="w-5 h-5 md:w-6 md:h-6" />
            </button>

              {/* Cart Icon with Badge */}
            {!isAdmin && (
            <Link
            to="/cart"
            className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <FaShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
            )}

            {/* Authentication Section */}
            <div className="hidden md:flex items-center gap-2 border-l border-gray-200 pl-3 md:pl-4">
              {isAuthenticated ? (
                <div ref={authMenuRef} className="relative">
                  <button
                    onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 rounded-lg transition-all duration-200 hover:bg-blue-50"
                  >
                    <FaUser className="w-4 h-4" />
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {user?.email?.split('@')[0] || 'Account'}
                    </span>
                  </button>

                  {/* Auth Dropdown Menu */}
                  {isAuthMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500">Authenticated</p>
                      </div>
                        {isAdmin && (
                        <>
                            <Link
                            to="/admin-home"
                            onClick={() => setIsAuthMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                            Admin Dashboard
                            </Link>

                            <Link
                            to="/admin/products"
                            onClick={() => setIsAuthMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                            Manage Products
                            </Link>

                            <Link
                            to="/admin/categories"
                            onClick={() => setIsAuthMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                            Manage Categories
                            </Link>
                        </>
                        )}
                      <Link
                        to="/profile"
                        onClick={() => setIsAuthMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FaUser className="inline w-4 h-4 mr-2" />
                        My Profile
                      </Link>
                      { !isAdmin && (
                        <Link
                        to="/orders"
                        onClick={() => setIsAuthMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FaBox className="inline w-4 h-4 mr-2" />
                        My Orders
                      </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200"
                      >
                        <FaSignOutAlt className="inline w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Modal - Overlay */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start pt-20 justify-center" onClick={() => setShowSearchModal(false)}>
            {/* Search Modal Container */}
            <div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input Section */}
              <div className="p-4 md:p-6 border-b border-gray-200">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                  <FaSearch className="text-gray-400 text-lg flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products by name, type, or attributes..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchResults(e.target.value.length > 0);
                    }}
                    className="w-full px-2 py-2 outline-none text-gray-900 placeholder-gray-400 text-lg"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                        searchInputRef.current?.focus();
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </form>
              </div>

              {/* Search Results Section */}
              <div className="max-h-96 overflow-y-auto">
                {showSearchResults && searchQuery.trim().length > 0 ? (
                  searchResults.length > 0 ? (
                    <div>
                      {/* Results Count */}
                      <div className="px-4 md:px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">
                          Found <span className="font-bold text-blue-600">{searchResults.length}</span> product{searchResults.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Results List */}
                      <div className="divide-y divide-gray-200">
                        {searchResults.slice(0, 10).map(product => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full text-left px-4 md:px-6 py-3 hover:bg-blue-50 transition-colors duration-150 flex items-start gap-3"
                          >
                            <FaBox className="text-blue-600 mt-1 flex-shrink-0 text-sm" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate text-sm md:text-base">
                                {product.name}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs md:text-sm text-gray-500 truncate">
                                  {product.type || product.categoryName}
                                </p>
                                <p className="text-sm font-bold text-blue-600 whitespace-nowrap ml-2">
                                  KSH {product.price?.toFixed(2) || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* View All Results */}
                      {searchResults.length > 10 && (
                        <button
                          onClick={handleSearchSubmit}
                          className="w-full px-4 md:px-6 py-3 text-blue-600 hover:bg-blue-50 font-medium text-sm transition-colors border-t border-gray-200"
                        >
                          View all {searchResults.length} results →
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 md:px-6 py-12 text-center">
                      <FaBox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No products found</p>
                      <p className="text-gray-400 text-sm mt-1">Try searching for a different term</p>
                    </div>
                  )
                ) : (
                  <div className="px-4 md:px-6 py-12 text-center">
                    <FaSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Start typing to search</p>
                    <p className="text-gray-400 text-sm mt-1">Find products by name, type, or category</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                onClick={handleLinkClick}
                className={`block px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isAuthenticated ? (
                <div>
                  <div className="px-4 py-3 bg-blue-50 rounded-lg mb-3">
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500">Authenticated</p>
                  </div>
                  {isAdmin && (
                    <>
                        <Link
                        to="/admin-home"
                        onClick={handleLinkClick}
                        className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                        Admin Dashboard
                        </Link>

                        <Link
                        to="/admin/products"
                        onClick={handleLinkClick}
                        className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                        Manage Products
                        </Link>

                        <Link
                        to="/admin/categories"
                        onClick={handleLinkClick}
                        className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                        Manage Categories
                        </Link>
                    </>
                    )}
                  <Link
                    to="/profile"
                    onClick={handleLinkClick}
                    className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaUser className="inline w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                  {!isAdmin &&(
                    <Link
                    to="/orders"
                    onClick={handleLinkClick}
                    className="block px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                    <FaBox className="inline w-4 h-4 mr-2" />
                    My Orders
                  </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
                  >
                    <FaSignOutAlt className="inline w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="flex-1 px-3 py-2 text-center text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={handleLinkClick}
                    className="flex-1 px-3 py-2 text-center text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
