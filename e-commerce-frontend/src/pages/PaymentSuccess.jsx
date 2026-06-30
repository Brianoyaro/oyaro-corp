import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <main
      className="min-h-screen bg-slate-50 flex items-center justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm border border-slate-200 text-center"
        role="region"
        aria-label="Payment success confirmation"
      >
        {/* Success Icon */}
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600"
          aria-hidden="true"
        >
          <CheckCircle size={36} />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">
          Payment Successful
        </h1>

        {/* Message */}
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Your payment has been confirmed and your order is being processed.
        </p>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Link
            to="/orders"
            aria-label="View your orders"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-blue-600 px-4 py-3 text-white font-medium transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <span>View Orders</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>

          <Link
            to="/products"
            aria-label="Continue shopping and browse products"
            className="flex items-center justify-center gap-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-700 font-medium transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-slate-500">
          Need help? Contact support anytime.
        </p>
      </div>
    </main>
  );
}