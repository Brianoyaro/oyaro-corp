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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-pulse grid md:grid-cols-2 gap-10">
          <div className="h-[500px] bg-gray-200 rounded-xl"></div>

          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="grid lg:grid-cols-2 gap-12">

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
                      h-[500px]
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-125
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
              spaceBetween={10}
              slidesPerView={4}
              watchSlidesProgress
              className="mt-4"
            >
              {images.map((image) => (
                <SwiperSlide key={image.id}>
                  <img
                    src={`${baseUrl}${image.imgUrl}`}
                    alt=""
                    className="
                      h-24
                      w-full
                      object-cover
                      rounded-lg
                      border
                      cursor-pointer
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
          <h1 className="text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <div className="mt-4">
            <span className="text-4xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-lg mb-2">
              Description
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications */}

          {product.attributes?.length > 0 && (
            <div className="mt-10">
              <h2 className="font-semibold text-lg mb-4">
                Specifications
              </h2>

              <div className="rounded-xl border overflow-hidden">
                {product.attributes.map((attribute) => (
                  <div
                    key={attribute.id}
                    className="
                      flex
                      justify-between
                      px-4
                      py-3
                      border-b
                      last:border-b-0
                    "
                  >
                    <span className="font-medium text-gray-700">
                      {attribute.attributeName}
                    </span>

                    <span className="text-gray-600">
                      {attribute.attributeValue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}

          <div className="mt-10">
            <label className="font-semibold block mb-3">
              Quantity
            </label>

            <div className="flex items-center w-fit border rounded-xl overflow-hidden">
              <button
                onClick={decrementQty}
                className="px-4 py-3 hover:bg-gray-100"
              >
                <Minus size={18} />
              </button>

              <div className="px-6 font-semibold">
                {quantity}
              </div>

              <button
                onClick={incrementQty}
                className="px-4 py-3 hover:bg-gray-100"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Actions */}

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              className="
                flex-1
                bg-blue-600
                text-white
                py-4
                rounded-xl
                hover:bg-blue-700
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
                py-4
                rounded-xl
                hover:bg-gray-50
                transition
                font-semibold
              "
            >
              Buy Now
            </button>
          </div>

          {/* Trust badges */}

          <div className="mt-8 text-sm text-gray-500 space-y-2">
            <p>✓ Secure Checkout</p>
            <p>✓ Fast Delivery</p>
            <p>✓ Quality Guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}