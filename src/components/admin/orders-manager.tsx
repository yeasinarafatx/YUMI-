"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, Phone, MessageSquare, ArrowRight } from "lucide-react";
import { formatBDT } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/orders";

export function OrdersManager({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (selectedStatus !== "all" && order.status !== selectedStatus) {
        return false;
      }
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchNumber = order.order_number.toLowerCase().includes(q);
        const matchName = order.customer_name.toLowerCase().includes(q);
        const matchPhone = order.phone.includes(q);
        const matchTrx = order.transaction_id ? order.transaction_id.toLowerCase().includes(q) : false;
        return matchNumber || matchName || matchPhone || matchTrx;
      }
      return true;
    });
  }, [orders, selectedStatus, search]);

  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  const tabs: { label: string; value: string; count: number }[] = [
    { label: "All", value: "all", count: statusCounts.all },
    { label: "Pending", value: "pending", count: statusCounts.pending },
    { label: "Confirmed", value: "confirmed", count: statusCounts.confirmed },
    { label: "Shipped", value: "shipped", count: statusCounts.shipped },
    { label: "Delivered", value: "delivered", count: statusCounts.delivered },
    { label: "Cancelled", value: "cancelled", count: statusCounts.cancelled },
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order # (e.g. YUME-0001), phone, customer name, or TrxID..."
          className="w-full border border-line bg-cream py-3 pl-10 pr-4 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
        />
      </div>

      {/* Filter Tabs */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setSelectedStatus(tab.value)}
            className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              selectedStatus === tab.value
                ? "bg-accent text-cream shadow-sm"
                : "border border-line bg-cream text-ink hover:border-accent"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Orders List / Cards (Mobile-first responsive cards) */}
      {filteredOrders.length === 0 ? (
        <div className="border border-line bg-cream py-16 text-center">
          <p className="font-serif text-xl text-ink">No orders found</p>
          <p className="mt-1 text-xs text-muted">Try selecting a different status or clearing search keywords.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-line bg-cream p-4 sm:p-5 shadow-sm transition-all hover:border-accent/40"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/orders/${order.order_number}`}
                      className="font-mono text-base font-bold text-accent hover:underline"
                    >
                      {order.order_number}
                    </Link>
                    <span
                      className={`rounded px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider ${
                        order.status === "pending"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : order.status === "confirmed"
                            ? "bg-blue-100 text-blue-900"
                            : order.status === "shipped"
                              ? "bg-purple-100 text-purple-900"
                              : order.status === "delivered"
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-rose-100 text-rose-900"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(order.created_at).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm font-semibold text-ink">
                    {order.customer_name} • <span className="font-mono text-xs">{order.phone}</span>
                  </p>

                  <p className="text-xs text-muted truncate max-w-md">
                    {order.address}, {order.district}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-line/60 pt-3 sm:border-0 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="font-serif text-lg font-bold text-ink">{formatBDT(order.total)}</p>
                    <p className="text-[0.6875rem] font-medium text-muted uppercase">
                      {order.payment_method} {order.transaction_id ? `• Trx: ${order.transaction_id}` : ""}
                    </p>
                  </div>

                  <Link
                    href={`/admin/orders/${order.order_number}`}
                    className="flex h-9 items-center gap-1 rounded bg-accent px-3 text-xs font-semibold uppercase tracking-wider text-cream hover:bg-accent/90"
                  >
                    <span>View</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
