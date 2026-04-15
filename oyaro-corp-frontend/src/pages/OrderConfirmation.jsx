import { useParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <FiCheck size={64} className="text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>

        {/* Order ID */}
        <p className="text-gray-600 mb-6">
          Your order <span className="font-bold text-gray-900">#{orderId}</span> has been successfully placed.
        </p>

        {/* Message */}
        <div className="bg-blue-50 p-4 rounded-lg mb-8">
          <p className="text-sm text-gray-600">
            We'll send a confirmation email with tracking details. You can also check your order status anytime.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <FiArrowRight size={20} />
          </button>

          <button
            onClick={() => navigate('/user/orders')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-bold transition-colors"
          >
            View My Orders
          </button>
        </div>

        {/* Support Info */}
        <p className="text-xs text-gray-500 mt-8">
          Need help? <a href="mailto:support@oyaro.com" className="text-blue-600 hover:text-blue-900">Contact support</a>
        </p>
      </div>
    </div>
  );
}
