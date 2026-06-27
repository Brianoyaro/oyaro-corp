import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm border border-slate-200 text-center">

        {/* Success Icon */}
        {/* <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle size={36} />
        </div> */}

        {/* Title */}
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">
          Payment Successful
        </h1>

        {/* Message */}
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
          Your payment has been confirmed and your order is being processed.
        </p>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-blue-600 px-4 py-3 text-white font-medium transition hover:bg-blue-700"
          >
            View Orders
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/products"
            className="flex items-center justify-center gap-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-700 font-medium transition hover:bg-slate-50"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-slate-400">
          Need help? Contact support anytime.
        </p>
      </div>
    </div>
  );
}