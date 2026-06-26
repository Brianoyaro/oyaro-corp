import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaBox, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../hook/useCart';
import { useAuth } from '../hook/useAuth';
import { useProfile } from '../hook/userProfileHook';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const authMenuRef = useRef(null);
  const navigate = useNavigate();

  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount() || 0;
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { data: user } = useProfile();
  const isAdmin = user?.role?.toLowerCase().includes(('ADMIN').toLowerCase);

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'products', label: 'Products', path: '/products' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

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

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Navbar */}
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          {isAdmin && 
            <Link
            to="/admin-home"
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <span className="ml-2 text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Admin
            </span>
          </Link>
          }
          {!isAdmin &&
          <Link
          to="/"
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <span className="ml-2 text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              MavunoHub
            </span>
          </Link>
          }

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

          {/* Right Section - Cart & Menu Button */}
          <div className="flex items-center gap-3 md:gap-4">
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
