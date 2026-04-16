import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  FiArrowLeft,
  FiCreditCard,
  FiPhone,
  FiMapPin,
  FiUser,
  FiMail,
  FiCheck,
  FiLock,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../service/apiService';

// Zod validation schema
const orderSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  zipCode: z.string().min(3, 'ZIP code required'),
  paymentMethod: z.enum(['mpesa', 'stripe'], {
    errorMap: () => ({ message: 'Please select a payment method' }),
  }),
});

export default function Order() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      paymentMethod: 'mpesa',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data) => {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
        },
        paymentMethod: data.paymentMethod === 'mpesa' ? 'MPESA' : 'STRIPE',
        totalAmount: getTotalPrice(),
      };

      return api.post('/orders', orderData);
    },
    onSuccess: (response) => {
      clearCart();
      setOrderPlaced(true);
      
      // Redirect to payment page or order confirmation after 3 seconds
      setTimeout(() => {
        navigate(`/order-confirmation/${response.data.id}`);
      }, 3000);
    },
  });

  const onSubmit = (data) => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }
    createOrderMutation.mutate(data);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-900"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <div className="mb-4 flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <FiCheck size={48} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. You will be redirected to the confirmation page.
          </p>
          <div className="animate-spin">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-900"
          >
            <FiArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiMapPin size={20} /> Delivery Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.firstName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.lastName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      {...register('address')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.address
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.city
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  {/* ZIP Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      {...register('zipCode')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.zipCode
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiLock size={20} /> Payment Method
                </h2>

                <div className="space-y-4">
                  {/* M-Pesa Option */}
                  <label className="relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    style={{borderColor: selectedPaymentMethod === 'mpesa' ? '#3b82f6' : '#e5e7eb',
                      backgroundColor: selectedPaymentMethod === 'mpesa' ? '#eff6ff' : 'transparent'
                    }}>
                    <input
                      type="radio"
                      value="mpesa"
                      {...register('paymentMethod')}
                      className="mt-1"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2">
                        <FiPhone size={20} className="text-blue-600" />
                        <span className="font-bold text-gray-900">M-Pesa</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay securely using M-Pesa. You'll receive a prompt on your phone.
                      </p>
                    </div>
                  </label>

                  {/* Stripe Option */}
                  <label className="relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    style={{borderColor: selectedPaymentMethod === 'stripe' ? '#3b82f6' : '#e5e7eb',
                      backgroundColor: selectedPaymentMethod === 'stripe' ? '#eff6ff' : 'transparent'
                    }}>
                    <input
                      type="radio"
                      value="stripe"
                      {...register('paymentMethod')}
                      className="mt-1"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2">
                        <FiCreditCard size={20} className="text-blue-600" />
                        <span className="font-bold text-gray-900">Card (Stripe)</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay using Visa, Mastercard, or other card methods via Stripe.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck size={20} />
                    Place Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-20 p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-3 max-h-80 overflow-y-auto border-b border-gray-200 pb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-b border-gray-200 pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>KES {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (16%)</span>
                  <span>KES {(getTotalPrice() * 0.16).toLocaleString()}</span>
                </div>
              </div>

              {/* Final Total */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  KES {(getTotalPrice() * 1.16).toLocaleString()}
                </span>
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 p-4 rounded-lg text-center text-xs text-gray-600">
                <p>🔒 Secure payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
