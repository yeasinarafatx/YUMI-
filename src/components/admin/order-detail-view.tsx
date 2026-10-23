"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Phone, ArrowLeft, Copy, Check, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatBDT, toWhatsAppNumber } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/orders";

export function OrderDetailView({ initialOrder }: { initialOrder: Order }) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [status, setStatus] = useState<OrderStatus>(initialOrder.status);
  const [adminNotes, setAdminNotes] = useState(initialOrder.admin_notes || "");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [copied, setCopied] = useState(false);

  const cleanPhone = toWhatsAppNumber(order.phone);
  const waCustomerUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${order.customer_name}! This is YUME Jewellery regarding your order #${order.order_number}.`,
  )}`;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus(newStatus);
      setOrder(data.order);
      toast.success(`Order status updated to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrder(data.order);
      toast.success("Admin notes saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCopyTrx = () => {
    if (order.transaction_id) {
      navigator.clipboard.writeText(order.transaction_id);
      setCopied(true);
      toast.success("Transaction ID copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-8">
      {/* Back button & Title */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted hover:text-accent mb-3"
        >
          <ArrowLeft size={14} />
          <span>Back to All Orders</span>
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink">
              Order {order.order_number}
            </h1>
            <p className="mt-1 text-xs text-muted">
              Placed on {new Date(order.created_at).toLocaleString("en-BD")}
            </p>
          </div>

          {/* Quick Call & WhatsApp Customer Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${order.phone}`}
              className="btn btn-outline h-10 px-4 text-xs gap-1.5"
            >
              <Phone size={14} />
              Call Customer
            </a>
            <a
              href={waCustomerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center justify-center gap-2 rounded bg-[#25D366] px-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#20ba59]"
            >
              <Image src="/images/whatsapp.png" alt="WhatsApp" width={18} height={18} className="h-4 w-4 object-contain" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Status Bar Changer (1-tap status selector) */}
      <section className="border border-line bg-cream p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-ink">Update Order Status:</span>
          {savingStatus && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <Loader2 size={13} className="animate-spin" />
              Saving...
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              disabled={savingStatus}
              onClick={() => handleStatusChange(s)}
              className={`py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                status === s
                  ? s === "pending"
                    ? "bg-amber-600 text-white shadow-sm"
                    : s === "confirmed"
                      ? "bg-blue-600 text-white shadow-sm"
                      : s === "shipped"
                        ? "bg-purple-600 text-white shadow-sm"
                        : s === "delivered"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-rose-600 text-white shadow-sm"
                  : "border border-line bg-cream text-ink hover:border-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Grid: Left Items + Right Customer Details */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Items list & Totals */}
        <div className="space-y-6 lg:col-span-7">
          <section className="border border-line bg-cream p-5 sm:p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-ink">Purchased Items</h2>
            <ul className="mt-4 divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-sand">
                    {item.image_snapshot && (
                      <Image
                        src={item.image_snapshot}
                        alt={item.product_name_snapshot}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base font-medium text-ink truncate">
                      {item.product_name_snapshot}
                    </p>
                    <p className="text-xs text-muted">
                      {formatBDT(item.price_snapshot)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-serif text-base font-bold text-ink tabular-nums">
                    {formatBDT(item.price_snapshot * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 border-t border-line pt-4 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatBDT(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery ({order.delivery_zone})</dt>
                <dd className="font-semibold text-ink">{formatBDT(order.delivery_charge)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 font-serif text-lg font-bold text-ink">
                <dt>Total Amount</dt>
                <dd className="text-accent">{formatBDT(order.total)}</dd>
              </div>
            </dl>
          </section>

          {/* Admin Notes */}
          <section className="border border-line bg-cream p-5 sm:p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-ink">Internal Admin Notes</h2>
            <p className="mt-1 text-xs text-muted">Only visible to administrators.</p>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Called customer at 3 PM, confirmed address. Needs gift wrap."
              className="mt-3 w-full border border-line bg-cream p-3 text-xs focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              disabled={savingNotes}
              onClick={handleSaveNotes}
              className="btn btn-outline mt-3 h-9 px-4 text-xs gap-1.5"
            >
              {savingNotes && <Loader2 size={13} className="animate-spin" />}
              Save Notes
            </button>
          </section>
        </div>

        {/* Right: Customer & Payment verification details */}
        <div className="space-y-6 lg:col-span-5">
          {/* Customer & Address */}
          <section className="border border-line bg-cream p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="font-serif text-xl font-bold text-ink">Customer & Delivery</h2>
            <div className="text-xs space-y-1.5 text-ink">
              <p>
                <strong>Name:</strong> {order.customer_name}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${order.phone}`} className="text-accent underline font-mono">
                  {order.phone}
                </a>
              </p>
              {order.email && (
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
              )}
              <p className="pt-2">
                <strong>Address:</strong>
              </p>
              <p className="rounded bg-sand/40 p-2.5 text-muted">
                {order.address}, {order.district}
              </p>
              {order.notes && (
                <p className="pt-2">
                  <strong>Customer Note:</strong> &ldquo;{order.notes}&rdquo;
                </p>
              )}
            </div>
          </section>

          {/* Payment & Verification */}
          <section className="border border-line bg-cream p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="font-serif text-xl font-bold text-ink">Payment Details</h2>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-muted">Method:</span>
              <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase text-accent">
                {order.payment_method}
              </span>
            </div>

            {order.payment_number_used && (
              <div className="text-xs">
                <span className="text-muted">Sender Number:</span>
                <p className="font-mono font-bold text-ink">{order.payment_number_used}</p>
              </div>
            )}

            {order.transaction_id && (
              <div className="rounded bg-sand/50 p-3 text-xs">
                <span className="text-muted">Transaction ID (TrxID):</span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-accent">{order.transaction_id}</span>
                  <button
                    type="button"
                    onClick={handleCopyTrx}
                    className="flex items-center gap-1 text-[0.6875rem] font-semibold text-ink hover:text-accent"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy TrxID"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
