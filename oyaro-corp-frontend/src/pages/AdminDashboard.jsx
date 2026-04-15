import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiLogOut,
  FiBox,
  FiTag,
  FiShoppingBag,
  FiCreditCard,
  FiMenu,
  FiX,
  FiChevronRight,
} from 'react-icons/fi';
import AdminProducts from '../components/AdminProducts';
import AdminCategories from '../components/AdminCategories';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  // Admin menu items
  const menuItems = [
    { id: 'products', label: 'Products', icon: FiBox },
    { id: 'categories', label: 'Categories', icon: FiTag },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'payments', label: 'Payments', icon: FiCreditCard },
  ];

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <AdminProductsSection />;
      case 'categories':
        return <AdminCategoriesSection />;
      case 'orders':
        return <AdminOrders />;
      case 'payments':
        return <AdminPayments />;
      default:
        return <AdminProductsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiLogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:relative left-0 top-[73px] lg:top-0 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } h-[calc(100vh-73px)]`}
        >
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Menu</h2>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={20} />
                      {item.label}
                    </span>
                    {activeTab === item.id && <FiChevronRight size={20} />}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-73px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// ===== PRODUCTS SECTION =====
function AdminProductsSection() {
  return <AdminProducts />;
}

// ===== CATEGORIES SECTION =====
function AdminCategoriesSection() {
  return <AdminCategories />;
}

// ===== ORDERS SECTION =====
function AdminOrders() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-700">#ORD-001</td>
              <td className="px-6 py-4 text-sm text-gray-700">John Doe</td>
              <td className="px-6 py-4 text-sm text-gray-700">KES 15,000</td>
              <td className="px-6 py-4 text-sm">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Completed
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">2024-04-15</td>
              <td className="px-6 py-4 text-sm">
                <button className="text-blue-600 hover:text-blue-900">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== PAYMENTS SECTION =====
function AdminPayments() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Payments</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">KES 1,250,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Pending Payments</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Completed Payments</p>
          <p className="text-3xl font-bold text-green-600 mt-2">156</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Payment ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Method
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-700">#PAY-001</td>
              <td className="px-6 py-4 text-sm text-gray-700">#ORD-001</td>
              <td className="px-6 py-4 text-sm text-gray-700">KES 15,000</td>
              <td className="px-6 py-4 text-sm text-gray-700">M-Pesa</td>
              <td className="px-6 py-4 text-sm">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Completed
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">2024-04-15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
