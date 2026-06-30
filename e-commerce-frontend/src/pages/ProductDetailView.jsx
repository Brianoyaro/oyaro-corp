import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { useCart } from "../hook/useCart";
import { toast } from "sonner";
import { useProduct } from "../hook/useProducts";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function ProductDetailView() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { addToCart, isLoading: cartLoading } = useCart();

  const baseUrl = import.meta.env.VITE_API_IMAGE_URL;

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const images = useMemo(() => {
    if (!product?.images) return [];
    const primary = product.images.find((img) => img.isPrimary);
    const others = product.images.filter((img) => !img.isPrimary);
    return primary ? [primary, ...others] : product.images;
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        categoryName: product.category?.name,
        images: product.images,
      });

      toast.info("Product added to cart");
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  const incrementQty = () => setQuantity((p) => p + 1);

  const decrementQty = () => {
    if (quantity > 1) setQuantity((p) => p - 1);
  };

  const currencyFormatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  });

  if (isLoading) {
    return (
      <main aria-busy="true" aria-live="polite" className="max-w-7xl mx-auto p-6">
        <p className="sr-only">Loading product details</p>
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="text-center py-20" role="alert">
        <h1 className="text-lg font-semibold">Product not found</h1>
      </main>
    );
  }

  return (
    <main
      className="max-w-7xl mx-auto px-4 py-10"
      aria-label={`Product details for ${product.name}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ================= PRODUCT IMAGES ================= */}
        <section aria-label="Product images">
          <Swiper
            modules={[Navigation, Thumbs]}
            navigation
            thumbs={{
              swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            className="border rounded-2xl overflow-hidden bg-white"
          >
            {images.map((image) => (
              <SwiperSlide key={image.id}>
                <img
                  src={`${baseUrl}${image.imgUrl}`}
                  alt={`${product.name} product image`}
                  className="w-full h-[400px] object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {images.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={8}
              watchSlidesProgress
              className="mt-4"
              aria-label="Product thumbnails"
            >
              {images.map((image) => (
                <SwiperSlide key={image.id}>
                  <button
                    type="button"
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                    aria-label="View product image"
                  >
                    <img
                      src={`${baseUrl}${image.imgUrl}`}
                      alt=""
                      aria-hidden="true"
                      className="h-20 w-full object-cover rounded-lg border"
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </section>

        {/* ================= PRODUCT INFO ================= */}
        <section aria-label="Product information">
          <h1 className="text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {currencyFormatter.format(product.price)}
          </p>

          <section className="mt-6" aria-label="Product description">
            <h2 className="font-semibold text-lg">Description</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </section>

          {/* ================= QUANTITY ================= */}
          <section className="mt-8" aria-label="Quantity selector">
            <h2 className="font-semibold mb-2">
              Quantity
              <span className="sr-only">
                Current quantity is {quantity}
              </span>
            </h2>

            <div className="flex items-center border rounded-xl w-fit">
              <button
                onClick={decrementQty}
                disabled={quantity === 1}
                aria-label="Decrease quantity"
                className="px-4 py-3 hover:bg-gray-100 disabled:opacity-40"
              >
                <Minus size={18} />
              </button>

              <span
                className="px-6 font-semibold"
                aria-live="polite"
              >
                {quantity}
              </span>

              <button
                onClick={incrementQty}
                aria-label="Increase quantity"
                className="px-4 py-3 hover:bg-gray-100"
              >
                <Plus size={18} />
              </button>
            </div>
          </section>

          {/* ================= ACTIONS ================= */}
          <section className="mt-8" aria-label="Purchase actions">
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              aria-busy={cartLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {cartLoading ? "Adding to cart..." : "Add to Cart"}
            </button>

            <button
              className="w-full mt-3 border py-4 rounded-xl font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label="Buy this product now"
            >
              Buy Now
            </button>
          </section>

          {/* ================= TRUST ================= */}
          <section className="mt-8 text-sm text-gray-500" aria-label="Trust indicators">
            <p>✓ Secure Checkout</p>
            <p>✓ Fast Delivery</p>
            <p>✓ Quality Guarantee</p>
          </section>
        </section>
      </div>
    </main>
  );
}