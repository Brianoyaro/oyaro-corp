import { useParams } from "react-router-dom";
import { useOrder } from "../hook/useOrders";
import { Package, Loader2 } from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    error,
  } = useOrder(id);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="animate-spin text-blue-600" size={32} aria-hidden="true" />
        <span className="sr-only">Loading order details</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600" role="alert">
        Failed to load order
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center text-slate-500" role="alert">
        Order not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10" aria-labelledby="order-detail-title">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white border p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 id="order-detail-title" className="text-2xl font-semibold text-slate-900">
                Order #{order.id}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {order.email}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.orderStatus === "PENDING"
                  ? "bg-yellow-50 text-yellow-700"
                  : order.orderStatus === "PAID"
                  ? "bg-green-50 text-green-700"
                  : "bg-slate-100 text-slate-700"
              }`}
              aria-label={`Order status: ${order.orderStatus}`}
            >
              {order.orderStatus}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">Total Amount</p>
            <p className="text-xl font-semibold text-slate-900">
              KES {order.totalAmount}
            </p>
          </div>
        </div>

        <section className="mt-6 rounded-2xl bg-white border p-6 shadow-sm" aria-labelledby="order-items-title">
          <h2 id="order-items-title" className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Package size={18} aria-hidden="true" />
            Order Items
          </h2>

          <ul className="mt-4 space-y-4" aria-label="Items in this order">
            {order.orderItems?.length > 0 ? (
              order.orderItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-4 border-b pb-3 last:border-none"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-slate-500">
                      Qty: {item.quantity} × KES {item.unitPrice}
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    KES {item.quantity * item.unitPrice}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-500">No items found in this order</li>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}