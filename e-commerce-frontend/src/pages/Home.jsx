import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

import { useProducts } from '../hook/useProducts';
import { useCategories } from '../hook/useCategory';

// Import carousel images for proper Vite asset resolution
import shoesImage from '../assets/home-carousal/shoes.jpg?url';
import clothesImage from '../assets/home-carousal/clothes.jpg?url';
import furnitureImage from '../assets/home-carousal/furniture.jpg?url';
import kitchenImage from '../assets/home-carousal/kitchen_appliance.jpg?url';


export function Home() {
  const navigate = useNavigate();
  const scrollContainers = useRef({});
  const [scrollPositions, setScrollPositions] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel images with proper Vite asset imports
  const carouselImages = [
    shoesImage,
    clothesImage,
    furnitureImage,
    kitchenImage,
  ];

  // Auto-rotate carousel images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const {
    data: products = [],
    isLoading,
    error,
    } = useProducts();



  // Get all products flat for featured
  const allProducts = products;


  const handleScroll = (direction, categoryKey) => {
    const container = scrollContainers.current[categoryKey];
    if (!container) return;

    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load products</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Full-Screen Carousel */}
        <div className="relative w-full h-full bg-gray-200">
              {/* Carousel Images */}
              {carouselImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Hero carousel ${index + 1}`}
                  className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              {/* Previous Button */}
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 rounded-full p-2 transition-all"
              >
                ←
              </button>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-900 rounded-full p-2 transition-all"
              >
                →
              </button>

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                  />
                ))}
              </div>
        </div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white px-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Welcome to Nthuli Shop
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Discover premium quality products for every lifestyle. Shop the latest fashion, accessories, and more.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
