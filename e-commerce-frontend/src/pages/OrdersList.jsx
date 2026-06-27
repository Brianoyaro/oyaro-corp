import { useOrders } from "../hook/useOrders";
import { Link } from "react-router-dom";
import { Package, Loader2 } from "lucide-react";

export default function Orders() {
  const { data: orders, isLoading, error } = useOrders();

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
        Failed to load orders
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold text-slate-900">
          My Orders
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track and manage your purchases
        </p>

        {!orders?.length ? (
          <div className="mt-10 rounded-2xl border bg-white p-10 text-center">
            <Package className="mx-auto text-slate-400" size={40} />
            <p className="mt-4 text-slate-600">No orders found</p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-full bg-blue-600 px-5 py-2 text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block rounded-2xl border bg-white p-5 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between">

                  {/* LEFT SIDE */}
                  <div>
                    <p className="font-medium text-slate-900">
                      Order #{order.id}
                    </p>

                    <p className="text-sm text-slate-500">
                      {order.orderStatus}
                    </p>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      KES {order.totalAmount}
                    </p>

                    <p className="text-xs text-slate-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}