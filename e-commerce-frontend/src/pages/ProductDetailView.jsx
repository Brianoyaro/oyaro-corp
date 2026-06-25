import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { useProduct } from "../hook/useProducts";

export default function ProductDetailView() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);

  const baseUrl = "http://localhost:8080";

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const images = useMemo(() => {
    if (!product?.images) return [];

    const primary = product.images.find((img) => img.isPrimary);
    const others = product.images.filter((img) => !img.isPrimary);

    return primary ? [primary, ...others] : product.images;
  }, [product]);

  const incrementQty = () => setQuantity((prev) => prev + 1);

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  const currencyFormatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-200 rounded-xl"></div>

          <div className="space-y-3 sm:space-y-4">
            <div className="h-8 sm:h-10 bg-gray-200 rounded"></div>
            <div className="h-6 sm:h-7 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 sm:h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">

        {/* =======================================
            PRODUCT IMAGES
        ======================================== */}

        <div>
          <Swiper
            modules={[Navigation, Thumbs]}
            navigation
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed
                  ? thumbsSwiper
                  : null,
            }}
            className="border rounded-2xl overflow-hidden bg-white"
          >
            {images.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="group overflow-hidden bg-white">
                  <img
                    src={`${baseUrl}${image.imgUrl}`}
                    alt={product.name}
                    className="
                      w-full
                      h-64 sm:h-80 md:h-96 lg:h-[500px]
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-110
                      cursor-zoom-in
                    "
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails */}

          {images.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={8}
              breakpoints={{
                0: {
                    slidesPerView: 3,
                },
                480: {
                    slidesPerView: 4,
                },
                768: {
                    slidesPerView: 5,
                },
                1024: {
                    slidesPerView: 5,
                },
            }}
              watchSlidesProgress
              className="mt-3 sm:mt-4"
            >
              {images.map((image) => (
                <SwiperSlide key={image.id}>
                  <img
                    src={`${baseUrl}${image.imgUrl}`}
                    alt=""
                    className="
                      h-16 sm:h-20 md:h-24
                      w-full
                      object-cover
                      rounded-lg
                      border
                      cursor-pointer
                      transition-opacity
                      hover:opacity-70
                    "
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* =======================================
            PRODUCT INFO
        ======================================== */}

        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <div className="mt-2 sm:mt-4">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
              {currencyFormatter.format(product.price)}
            </span>
          </div>

          <div className="mt-4 sm:mt-6 md:mt-8">
            <h2 className="font-semibold text-base sm:text-lg mb-2">
              Description
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications */}

          {product.attributes?.length > 0 && (
            <div className="mt-6 sm:mt-8 md:mt-10">
              <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
                Specifications
              </h2>

              <div className="rounded-xl border overflow-hidden">
                {product.attributes.map((attribute) => (
                  <div
                    key={attribute.id}
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:justify-between
                      px-3 sm:px-4
                      py-2 sm:py-3
                      border-b
                      last:border-b-0
                      text-sm sm:text-base
                    "
                  >
                    <span className="font-medium text-gray-700">
                      {attribute.attributeName}
                    </span>

                    <span className="text-gray-600 break-words">
                      {attribute.attributeValue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}

          <div className="mt-6 sm:mt-8 md:mt-10">
            <label className="font-semibold text-sm sm:text-base block mb-2 sm:mb-3">
              Quantity
            </label>

            <div className="flex items-center w-full sm:w-fit border rounded-xl overflow-hidden">
              <button
                onClick={decrementQty}
                className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100"
              >
                <Minus size={16} className="sm:w-5 sm:h-5" />
              </button>

              <div className="flex-1 sm:flex-none text-center px-4 sm:px-6 font-semibold text-sm sm:text-base">
                {quantity}
              </div>

              <button
                onClick={incrementQty}
                className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100"
              >
                <Plus size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Actions */}

          <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <button
              className="
                flex-1
                bg-blue-600
                text-white
                text-sm sm:text-base
                py-3 sm:py-4
                rounded-xl
                hover:bg-blue-700
                active:bg-blue-800
                transition
                font-semibold
              "
            >
              Add To Cart
            </button>

            <button
              className="
                flex-1
                border
                border-gray-300
                text-sm sm:text-base
                py-3 sm:py-4
                rounded-xl
                hover:bg-gray-50
                active:bg-gray-100
                transition
                font-semibold
              "
            >
              Buy Now
            </button>
          </div>

          {/* Trust badges */}

          <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-2">
            <p>✓ Secure Checkout</p>
            <p>✓ Fast Delivery</p>
            <p>✓ Quality Guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}