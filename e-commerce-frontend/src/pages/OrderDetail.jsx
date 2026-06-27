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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load order
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="rounded-2xl bg-white border p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Order #{order.id}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {order.email}
              </p>
            </div>

            <span
              className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${
                  order.orderStatus === "PENDING"
                    ? "bg-yellow-50 text-yellow-700"
                    : order.orderStatus === "PAID"
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-100 text-slate-700"
                }
              `}
            >
              {order.orderStatus}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Amount</p>
            <p className="text-xl font-semibold text-slate-900">
              KES {order.totalAmount}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 rounded-2xl bg-white border p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Package size={18} />
            Order Items
          </h2>

          <div className="mt-4 space-y-4">
            {order.orderItems?.length > 0 ? (
              order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-none"
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
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No items found in this order
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}