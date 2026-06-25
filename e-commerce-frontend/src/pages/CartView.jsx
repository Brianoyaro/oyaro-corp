import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../hook/useCart";


export default function CartView() {
  const {
    cart,
    updateCart,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();

  const currencyFormatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  });

  const baseUrl = "http://localhost:8080"

  if (!cart.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingCart
          size={80}
          className="mx-auto text-gray-300"
        />

        <h1 className="mt-6 text-3xl font-bold">
          Your cart is empty
        </h1>

        <p className="mt-2 text-gray-500">
          Looks like you haven't added any products yet.
        </p>

        <Link
          to="/products"
          className="
            inline-block
            mt-8
            px-8
            py-3
            bg-blue-600
            text-white
            rounded-xl
            hover:bg-blue-700
          "
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          Shopping Cart
        </h1>

        <button
          onClick={clearCart}
          className="
            text-red-600
            font-medium
            hover:text-red-700
          "
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Cart Items */}

        <div className="lg:col-span-2 space-y-4">

          {cart.map((item) => (
            <div
              key={item.productId}
              className="
                bg-white
                border
                rounded-2xl
                p-4
                flex
                flex-col
                sm:flex-row
                gap-4
              "
            >

              {/* Image */}

              <img
                src={`${baseUrl}${item.imgUrl}`}
                alt={item.productName}
                className="
                  w-full
                  sm:w-32
                  h-48
                  sm:h-32
                  object-cover
                  rounded-xl
                "
              />

              {/* Details */}

              <div className="flex-1">

                <div className="flex justify-between gap-4">

                  <div>
                    <h2 className="font-semibold text-lg">
                      {item.productName}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {item.productCategoryName}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.id ?? item.productId)
                    }
                    className="
                      text-red-500
                      hover:text-red-700
                    "
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">

                  <span className="font-semibold text-blue-600">
                    {currencyFormatter.format(item.unitPrice)}
                  </span>

                  {/* Quantity */}

                  <div
                    className="
                      flex
                      items-center
                      border
                      rounded-xl
                    "
                  >
                    <button
                      onClick={() =>
                        updateCart(
                          item.id ?? item.productId,
                          item.quantity - 1
                        )
                      }
                      className="px-3 py-2"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-4">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateCart(
                          item.id ?? item.productId,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-2"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                </div>

                <div className="mt-3">
                  <span className="font-bold">
                    Subtotal:{" "}
                    {currencyFormatter.format(
                      item.unitPrice * item.quantity
                    )}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}

        <div>

          <div
            className="
              bg-white
              border
              rounded-2xl
              p-6
              sticky
              top-24
            "
          >
            <h2 className="text-xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>Items</span>

                <span>
                  {cart.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>
                  {currencyFormatter.format(
                    getCartTotal()
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>

                <span>Calculated at checkout</span>
              </div>

              <hr />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>

                <span>
                  {currencyFormatter.format(
                    getCartTotal()
                  )}
                </span>
              </div>

            </div>

            <button
              className="
                w-full
                mt-6
                bg-blue-600
                text-white
                py-4
                rounded-xl
                hover:bg-blue-700
                transition
                font-semibold
              "
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="
                block
                text-center
                mt-4
                text-blue-600
                hover:underline
              "
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}