import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft, FiCheck } from 'react-icons/fi';
import productService from '../service/productService';
import ImageCarousel from '../components/ImageCarousel';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await productService.getProduct(productId);
      return response.data;
    },
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      setQuantity(1);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center gap-4">
        <div className="text-red-600">Product not found</div>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-900 flex items-center gap-2"
        >
          <FiArrowLeft size={20} /> Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-900"
          >
            <FiArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Product Details</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div>
            <ImageCarousel images={product.images || []} />
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            {/* Product Name */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-2">Category ID: {product.categoryId}</p>
            </div>

            {/* Price */}
            <div className="border-b border-gray-200 pb-6">
              <p className="text-4xl font-bold text-gray-900">
                KES {product.price?.toLocaleString()}
              </p>
              <p className="text-gray-600 mt-2">Incl. all taxes</p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Attributes */}
            {product.attributes && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Specifications</h2>
                <p className="text-gray-700">{product.attributes}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={decreaseQuantity}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiMinus size={20} />
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiPlus size={20} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all flex items-center justify-center gap-2 ${
                addedToCart
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {addedToCart ? (
                <>
                  <FiCheck size={24} /> Added to Cart!
                </>
              ) : (
                <>
                  <FiShoppingCart size={24} /> Add to Cart
                </>
              )}
            </button>

            {/* Shipping Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-sm">
                Free shipping on orders over KES 5,000. Delivery within 3-5 business days.
              </p>
            </div>

            {/* Return Policy */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Return Policy</h3>
              <p className="text-gray-600 text-sm">
                30-day money-back guarantee. If you're not satisfied, we'll refund your money.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
