import { useOrders } from "../hook/useOrders";
import { Link } from "react-router-dom";
import { Package, Loader2 } from "lucide-react";

export default function Orders() {
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="animate-spin text-blue-600" size={32} aria-hidden="true" />
        <span className="sr-only">Loading your orders</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600" role="alert">
        Failed to load orders
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10" aria-labelledby="orders-title">
      <div className="mx-auto max-w-5xl">
        <h1 id="orders-title" className="text-2xl font-semibold text-slate-900">
          My Orders
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track and manage your purchases
        </p>

        {!orders?.length ? (
          <div className="mt-10 rounded-2xl border bg-white p-10 text-center" role="status">
            <Package className="mx-auto text-slate-400" size={40} aria-hidden="true" />
            <p className="mt-4 text-slate-600">No orders found</p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-full bg-blue-600 px-5 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-4" aria-label="Order list">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  aria-label={`View details for order ${order.id}`}
                  className="block rounded-2xl border bg-white p-5 hover:shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        Order #{order.id}
                      </p>

                      <p className="text-sm text-slate-500">
                        {order.orderStatus}
                      </p>
                    </div>

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
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}