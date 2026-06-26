import { useCart } from "../hook/useCart";
// import { useToast } from "../context/ToastContext";

export function ProductCard({
  product,
  onViewDetails,
  variant = "grid",
}) {
  const { addToCart } = useCart();
//   const { success, error } = useToast();

  const API_IMAGE_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

  const primaryImage =
    product.images?.find((img) => img.isPrimary) ||
    product.images?.[0];

    console.log(`product: ${product}`)
    console.log(primaryImage.imgUrl)
  const imageUrl = primaryImage?.imgUrl
    ? `${API_IMAGE_BASE_URL}${primaryImage.imgUrl}`
    : "https://via.placeholder.com/400x400?text=No+Image";

    console.log(`image-url is ${imageUrl}`)
  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        categoryName: product.categoryName,
        images: product.images,
      });

    //   success(`${product.name} added to cart`);
    } catch (err) {
      console.error(err);
    //   error("Failed to add product to cart");
    }
  };

  if (variant === "carousel") {
    return (
      <div className="flex-shrink-0 w-56">
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
          {/* Image */}
          <div
            className="h-56 bg-gray-100 cursor-pointer overflow-hidden"
            onClick={onViewDetails}
          >
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-3">
            <h3
              className="font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600"
              onClick={onViewDetails}
            >
              {product.name}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {product.categoryName}
            </p>

            <div className="mt-2">
              <span className="font-bold text-lg text-blue-600">
                KSh {Number(product.price).toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Card
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden">
      {/* Product Image */}
      <div
        className="h-64 bg-gray-100 cursor-pointer overflow-hidden"
        onClick={onViewDetails}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details */}
      <div className="p-4">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full mb-2">
          {product.categoryName}
        </span>

        <h3
          className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600"
          onClick={onViewDetails}
        >
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            KSh {Number(product.price).toLocaleString()}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            View
          </button>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Cart
          </button>
        </div>
      </div>
    </div>
  );
}