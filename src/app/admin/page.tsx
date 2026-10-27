import Link from "next/link";
import { connection } from "next/server";
import { ShoppingBag, Clock, DollarSign, AlertTriangle, ArrowRight, Phone, MessageSquare } from "lucide-react";
import { getOrders } from "@/lib/orders";
import { getAllProducts } from "@/lib/data";
import { formatBDT } from "@/lib/utils";

export const instant = false;

export default async function AdminDashboardPage() {
  await connection();
  const [orders, products] = await Promise.all([getOrders(), getAllProducts()]);

  // Calculations
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const todayOrders = orders.filter((o) => {
    const today = new Date().toDateString();
    return new Date(o.created_at).toDateString() === today;
  });
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockProducts = products.filter(
    (p) => p.track_stock && (p.stock_quantity ?? 0) <= 5,
  );

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-ink">Store Overview</h1>
        <p className="mt-1 text-xs text-muted">
          Real-time metrics for YUME Jewellery sales, orders, and inventory.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Pending Orders */}
        <Link
          href="/admin/orders?status=pending"
          className="border border-line bg-cream p-5 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Pending</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <Clock size={16} />
            </span>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-ink">{pendingOrders.length}</p>
          <p className="mt-1 text-[0.6875rem] text-amber-800 font-medium">Needs confirmation</p>
        </Link>

        {/* Today's Orders */}
        <div className="border border-line bg-cream p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Today</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <ShoppingBag size={16} />
            </span>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-ink">{todayOrders.length}</p>
          <p className="mt-1 text-[0.6875rem] text-muted">{orders.length} total orders</p>
        </div>

        {/* Total Sales */}
        <div className="border border-line bg-cream p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Revenue</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
              <DollarSign size={16} />
            </span>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-accent sm:text-3xl">
            {formatBDT(totalRevenue)}
          </p>
          <p className="mt-1 text-[0.6875rem] text-muted">Excludes cancelled orders</p>
        </div>

        {/* Low Stock Alert */}
        <Link
          href="/admin/products"
          className="border border-line bg-cream p-5 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Low Stock</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-800">
              <AlertTriangle size={16} />
            </span>
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-ink">{lowStockProducts.length}</p>
          <p className="mt-1 text-[0.6875rem] text-rose-800 font-medium">Items low / out of stock</p>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <section className="border border-line bg-cream p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">Recent Orders</h2>
            <p className="text-xs text-muted">Latest customer purchases</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="divide-y divide-line">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/orders/${order.order_number}`}
                    className="font-mono text-sm font-bold text-accent hover:underline"
                  >
                    {order.order_number}
                  </Link>
                  <span
                    className={`rounded px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider ${
                      order.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "shipped"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink font-medium">
                  {order.customer_name} • {order.phone} • {order.items.length} item(s)
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="font-serif text-base font-bold text-ink">
                  {formatBDT(order.total)}
                </span>
                <Link
                  href={`/admin/orders/${order.order_number}`}
                  className="rounded border border-line bg-sand/40 px-3 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <section className="border border-rose-200 bg-rose-50/50 p-5 sm:p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-rose-800">
            <AlertTriangle size={18} />
            <h2 className="font-serif text-lg font-bold">Low Stock Warning</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded border border-rose-200 bg-white p-3">
                <div>
                  <p className="text-xs font-semibold text-ink">{p.name}</p>
                  <p className="text-[0.6875rem] text-rose-700 font-medium">
                    {p.stock_quantity === 0 ? "Out of Stock!" : `Only ${p.stock_quantity} remaining`}
                  </p>
                </div>
                <Link
                  href={`/admin/products`}
                  className="rounded bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-200"
                >
                  Restock
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
