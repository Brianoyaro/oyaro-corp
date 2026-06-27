import * as KenyaLocations from "kenya-locations";
import { toast } from "sonner";
import PaystackPop from "@paystack/inline-js";
import { paystackApi } from "../api/paystackApi";

import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ShieldCheck, ArrowRight } from "lucide-react";
import { useCart } from "../hook/useCart";
import { useState, useMemo } from "react";
import { useAuth } from "../hook/useAuth";

export default function CartView() {
  const navigate = useNavigate();
  const [loadingPayment, setLoadingPayment] = useState(false);

  const baseUrl = import.meta.env.VITE_API_IMAGE_URL;
  const { cart, updateCart, removeFromCart, clearCart, getCartTotal } = useCart();
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

  const counties = useMemo(() => KenyaLocations.counties, []);
  const towns = useMemo(() => {
    if (!shippingAddress.county) return [];
    return KenyaLocations.getLocalitiesInCounty(shippingAddress.county);
  }, [shippingAddress.county]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = getCartTotal();

  const handleCheckout = async () => {
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.county ||
      !shippingAddress.town ||
      !shippingAddress.street
    ) {
      toast.warning("Please fill all shipping details.");
      return;
    }

    try {
      setLoadingPayment(true);

      const initializeResponse = await paystackApi.initialize({
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
            const verify = await paystackApi.verify(initializeResponse.reference);
            if (verify.status !== "success") {
              throw new Error("Verification failed");
            }

            clearCart();
            setShowCheckoutModal(false);
            toast.success("Payment completed successfully.");
            navigate("/dashboard");
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed.");
          }
        },

        onCancel: () => {
          console.log("Customer cancelled payment.");
          toast.info("Customer cancelled payment.");
        },

        onError: (err) => {
          console.error(err);
          toast.error("Unable to process payment.");
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Unable to initialize payment.");
    } finally {
      setLoadingPayment(false);
    }
  };

  const getImageUrl = (item) => {
    const imgurl = item.imgUrl;
    if (imgurl.startsWith("/upload")) {
      return `${baseUrl}${imgurl}`;
    }
    return imgurl;
  };

  if (!cart.length) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14">
          <div className="rounded-full bg-blue-50 p-5 text-blue-600">
            <ShoppingCart size={40} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-slate-900">Your cart is empty</h1>
          <p className="mt-3 max-w-md text-base text-slate-500">
            Looks like you haven’t added any products yet. Start exploring our latest picks and build your order.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Continue shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Shopping cart</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your selected items</h1>
            <p className="mt-2 text-sm text-slate-500">{itemCount} item{itemCount !== 1 ? "s" : ""} ready for checkout</p>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center justify-center rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Clear cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-start"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                  <img
                    src={getImageUrl(item)}
                    alt={item.productName}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Link to={`/product/${item.productId}`} className="text-lg font-semibold text-slate-900 transition hover:text-blue-600">
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">{item.productCategoryName}</p>
                      
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id ?? item.productId)}
                      className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:border-red-200 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Unit price</p>
                      <p className="text-xl font-semibold text-blue-600">{currencyFormatter.format(item.unitPrice)}</p>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-full border border-slate-200 bg-slate-50 px-2 py-2">
                      <button
                        onClick={() => updateCart(item.id ?? item.productId, item.quantity - 1)}
                        className="rounded-full p-2 text-slate-600 transition hover:bg-white hover:text-blue-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-8 text-center text-base font-semibold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCart(item.id ?? item.productId, item.quantity + 1)}
                        className="rounded-full p-2 text-slate-600 transition hover:bg-white hover:text-blue-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">{currencyFormatter.format(item.unitPrice * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="rounded-[1.25rem] bg-slate-900 p-5 text-white">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">Order summary</p>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-sm text-slate-300">Total</span>
                  <span className="text-2xl font-semibold">{currencyFormatter.format(subtotal)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span className="font-medium text-slate-900">{itemCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">{currencyFormatter.format(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span className="font-medium text-slate-900">Calculated at checkout</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate(`/login?next=${encodeURIComponent("/cart")}`);
                    return;
                  }
                  setShowCheckoutModal(true);
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Proceed to checkout
                <ArrowRight size={18} />
              </button>

              {!isAuthenticated && (
                <p className="mt-3 text-center text-sm text-red-600">Please sign in to continue to payment.</p>
              )}

              <Link to="/products" className="mt-4 block text-center text-sm font-medium text-blue-600 transition hover:underline">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6">
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Checkout</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Shipping details</h2>
              <p className="mt-2 text-sm text-slate-500">Enter your delivery address to complete payment securely.</p>
            </div>

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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">County</label>
                <select
                  value={shippingAddress.county}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      county: e.target.value,
                      town: "",
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  <option value="">Select County</option>
                  {counties.map((county) => (
                    <option key={county.name} value={county.name}>
                      {county.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Town / City</label>
                <select
                  disabled={!shippingAddress.county}
                  value={shippingAddress.town}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      town: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 disabled:bg-slate-100"
                >
                  <option value="">{shippingAddress.county ? "Select Town" : "Select County First"}</option>
                  {towns.map((town) => (
                    <option key={town.name} value={town.name}>
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
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              />
            </div>

            <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Order total</span>
                <span className="text-lg font-semibold text-slate-900">{currencyFormatter.format(subtotal)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                disabled={loadingPayment}
                onClick={handleCheckout}
                className="flex-1 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loadingPayment ? "Initializing..." : "Pay now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
