import * as KenyaLocations from "kenya-locations";

import PaystackPop from "@paystack/inline-js";
import { paystackApi } from '../api/paystackApi';


import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../hook/useCart";
import { useState, useMemo } from "react";
import { useAuth } from "../hook/useAuth";


export default function CartView() {
  const navigate = useNavigate()
  const [loadingPayment, setLoadingPayment] = useState(false);


  const baseUrl = import.meta.env.VITE_API_IMAGE_URL;
  const {
    cart,
    updateCart,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const currencyFormatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  });

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    county: "",
    town: "",
    street: "",
  });

   //memoized version
  const counties = useMemo(() => KenyaLocations.counties, []);
  const towns = useMemo(() => {
    if (!shippingAddress.county) return [];

    return KenyaLocations.getLocalitiesInCounty(shippingAddress.county);
  }, [shippingAddress.county]);



  /**const handleCheckout = () => {
   * 
    alert("Payment coming soon.");
    console.log({
      shippingAddress,
      total: getCartTotal(),
      cart,
    });
    
      //Save the shipping address to your backend.
      //Create an order.
      //Initialize the Paystack transaction.
      //Redirect the cust
     
  };*/

  const handleCheckout = async () => {
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.county ||
      !shippingAddress.town ||
      !shippingAddress.street
    ) {
      alert("Please fill all shipping details.");
      return;
    }

    try {
      setLoadingPayment(true);
      //
    
      const initializeResponse = await paystackApi.initialize(
        {
          contactName: shippingAddress.fullName,
          contactPhone: shippingAddress.phone,
          shippingStreet: shippingAddress.street,
          shippingCounty: shippingAddress.county,
          shippingTown: shippingAddress.town,
        });

      const popup = new PaystackPop();

      popup.resumeTransaction(initializeResponse.accessCode, {
        
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,

        onSuccess: async () => {
          try {
            const verify = await paystackApi.verify(initializeResponse.reference)
            if (verify.status !==  "success") {
              throw new Error("Verification failed");
            }

            clearCart();

            setShowCheckoutModal(false);
            alert("Payment completed successfully.")
            navigate(`/orders/${initializeResponse.orderId}`);
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          }
        },

        onCancel: () => {
          console.log("Customer cancelled payment.");
          alert("Payment cancelled.");
        },

        onError: (err) => {
          console.error(err);
          alert("Unable to process payment.");
        }
      });
    } catch (err) {
      console.error(err);
      alert("Unable to initialize payment.");
    } finally {
      setLoadingPayment(false);
    }
  };
    
  const getImageUrl =  (item) => {
    const imgurl = item.imgUrl
    if (imgurl.startsWith('/upload')) {
      return `${baseUrl}${imgurl}`
    }
    return imgurl
  }
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
                src={getImageUrl(item)}
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
              onClick={() => {
                if (!isAuthenticated) {
                  navigate(`/login?next=${encodeURIComponent('/cart')}`);
                  return;
                }
                setShowCheckoutModal(true);
              }}
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
            {!isAuthenticated && (
              <p className="mt-3 text-sm text-red-600">
                Please sign in to continue to payment.
              </p>
            )}

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

      {showCheckoutModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

          <h2 className="text-2xl font-bold mb-1">
            Shipping Address
          </h2>

          <p className="text-gray-500 mb-6">
            Enter your delivery details.
          </p>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={shippingAddress.fullName}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  fullName: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-3"
            />

            <div>
            <label className="block text-sm font-medium mb-1">
              County
            </label>

            <select
              value={shippingAddress.county}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  county: e.target.value,
                  town: "",
                })
              }
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">
                Select County
              </option>

              {counties.map((county) => (
                <option
                  key={county.name}
                  value={county.name}
                >
                  {county.name}
                </option>
              ))}
            </select>
          </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Town / City
              </label>

              <select
                disabled={!shippingAddress.county}
                value={shippingAddress.town}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    town: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3 disabled:bg-gray-100"
              >
                <option value="">
                  {shippingAddress.county
                    ? "Select Town"
                    : "Select County First"}
                </option>

                {towns.map((town) => (
                  <option
                    key={town.name}
                    value={town.name}
                  >
                    {town.name}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              rows={3}
              placeholder="Street / Building / Apartment"
              value={shippingAddress.street}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  street: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-3 resize-none"
            />
          </div>

          <div className="mt-6 border-t pt-4">

            <div className="flex justify-between mb-6">
              <span className="font-medium">Order Total</span>

              <span className="font-bold text-blue-600">
                {currencyFormatter.format(getCartTotal())}
              </span>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 border border-gray-300 py-3 rounded-xl hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                disabled={loadingPayment}
                onClick={handleCheckout}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
"
              >
                {loadingPayment ? "Initializing..." : "Pay Now"}
              </button>

            </div>

          </div>

        </div>
      </div>
    )}
    </div>
  );
}