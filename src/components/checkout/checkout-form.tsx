"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, Check, ShieldCheck, ArrowRight, Loader2, Truck, RefreshCw, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { useCartStore, selectCartSubtotal } from "@/stores/cart-store";
import { formatBDT } from "@/lib/utils";
import type { SiteSettings } from "@/types";

interface CheckoutFormProps {
  settings: SiteSettings;
}

export function CheckoutForm({ settings }: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectCartSubtotal);
  const clearCart = useCartStore((s) => s.clear);

  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [deliveryZone, setDeliveryZone] = useState<"inside_dhaka" | "outside_dhaka">("inside_dhaka");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">("cod");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_percent: number;
    discount_amount: number;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const threshold = settings.free_delivery_threshold ?? 3000;
  const isFreeDelivery = threshold > 0 && subtotal >= threshold;
  const deliveryCharge = isFreeDelivery
    ? 0
    : deliveryZone === "inside_dhaka"
      ? settings.delivery_inside_dhaka
      : settings.delivery_outside_dhaka;

  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const finalSubtotal = Math.max(0, subtotal - discountAmount);
  const total = finalSubtotal + deliveryCharge;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid coupon code.");
      }
      setAppliedCoupon(data);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message || "Failed to apply coupon.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info("Coupon code removed.");
  };

  // Numbers from settings or fallback
  const bkashNumber = settings.bkash_number || "01711223344";
  const nagadNumber = settings.nagad_number || "01711223344";

  const handleCopy = (num: string, type: string) => {
    navigator.clipboard.writeText(num);
    setCopiedField(type);
    toast.success(`${type} number copied to clipboard! (${num})`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty! Please add items before checking out.");
      return;
    }

    // Phone validation
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(phone.trim())) {
      toast.error("Please enter a valid 11-digit BD mobile number (e.g. 017XXXXXXXX)");
      return;
    }

    if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      if (!transactionId.trim()) {
        toast.error("Please enter your Transaction ID (TrxID)");
        return;
      }
      if (!senderNumber.trim() || !bdPhoneRegex.test(senderNumber.trim())) {
        toast.error("Please enter the 11-digit sender phone number used for payment");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          phone,
          email: email || null,
          address,
          district,
          delivery_zone: deliveryZone,
          payment_method: paymentMethod,
          payment_number_used: senderNumber || null,
          transaction_id: transactionId || null,
          notes: notes || null,
          coupon_code: appliedCoupon?.code || null,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place your order. Please try again.");
      }

      // Clear the cart only after successful save
      clearCart();
      toast.success("Order confirmed successfully!");
      router.push(`/order-success/${data.order.order_number}`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred. Please contact us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-3xl text-ink">Your Bag is Empty</h2>
        <p className="text-sm text-muted">Discover our waterproof stainless steel jewellery pieces to start checkout.</p>
        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="btn btn-primary mt-2 font-bold"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
      {/* Honeypot field (hidden from real users) */}
      <input
        type="text"
        name="honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Left: Customer & Delivery & Payment Form */}
      <div className="space-y-8 lg:col-span-7">
        {/* Cash on Delivery Notice */}
        <div className="rounded border border-accent/20 bg-accent/5 p-4 flex items-start gap-3">
          <Truck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-ink space-y-1">
            <p className="font-bold text-accent">
              Cash on Delivery Available Across Bangladesh
            </p>
            <p className="text-muted leading-relaxed font-medium">
              Pay securely in cash when your parcel is delivered to your doorstep.
            </p>
          </div>
        </div>

        {/* 1. Customer Details */}
        <section className="border border-line bg-cream p-4 sm:p-8 space-y-5 shadow-sm">
          <div>
            <h2 className="font-serif font-bold text-2xl text-ink">1. Customer Information</h2>
            <p className="mt-0.5 text-xs font-medium text-muted">Guest Checkout — no account needed.</p>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <label htmlFor="customer_name" className="block text-xs font-bold uppercase tracking-wider text-ink">
                Full Name *
              </label>
              <input
                id="customer_name"
                required
                type="text"
                placeholder="e.g. Nusrat Jahan / Fahim Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full border border-line bg-white/80 px-4 py-2.5 text-sm font-medium text-ink placeholder:text-muted/60 focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-ink">
                  Phone Number (BD) *
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  placeholder="01XXXXXXXXX (11 digits)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full border border-line bg-white/80 px-4 py-2.5 text-sm font-semibold text-ink placeholder:text-muted/60 focus:border-accent focus:bg-white focus:outline-none"
                />
                <span className="mt-1 block text-[0.6875rem] font-medium text-muted">
                  Courier delivery associate will call this number prior to arrival.
                </span>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-ink">
                  Email Address (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full border border-line bg-white/80 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Delivery Address */}
        <section className="border border-line bg-cream p-4 sm:p-8 space-y-5 shadow-sm">
          <div>
            <h2 className="font-serif font-bold text-2xl text-ink">2. Shipping Address</h2>
            <p className="mt-0.5 text-xs text-muted">Where should we deliver your jewellery?</p>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-ink">
                Street Address, House & Road No *
              </label>
              <textarea
                id="address"
                required
                rows={2}
                placeholder="House #, Road #, Area / Thana (e.g. House 12, Road 4, Dhanmondi)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1.5 w-full border border-line bg-white/80 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="district" className="block text-xs font-bold uppercase tracking-wider text-ink">
                  District / City *
                </label>
                <input
                  id="district"
                  required
                  type="text"
                  placeholder="e.g. Dhaka, Chittagong, Sylhet"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-1.5 w-full border border-line bg-white/80 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                  Delivery Zone *
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryZone("inside_dhaka")}
                    className={`border p-2.5 text-left text-xs transition-all cursor-pointer ${
                      deliveryZone === "inside_dhaka"
                        ? "border-accent bg-accent text-cream shadow-sm"
                        : "border-line bg-white/60 text-ink hover:border-accent"
                    }`}
                  >
                    <span className="font-bold block">Inside Dhaka</span>
                    <span className="text-[0.6875rem] opacity-90">৳{settings.delivery_inside_dhaka} (24–48 hrs)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryZone("outside_dhaka")}
                    className={`border p-2.5 text-left text-xs transition-all cursor-pointer ${
                      deliveryZone === "outside_dhaka"
                        ? "border-accent bg-accent text-cream shadow-sm"
                        : "border-line bg-white/60 text-ink hover:border-accent"
                    }`}
                  >
                    <span className="font-bold block">Outside Dhaka</span>
                    <span className="text-[0.6875rem] opacity-90">৳{settings.delivery_outside_dhaka} (2–3 days)</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-ink">
                Order Notes / Delivery Instructions (Optional)
              </label>
              <input
                id="notes"
                type="text"
                placeholder="Special delivery notes or gift card message"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5 w-full border border-line bg-white/80 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* 3. Payment Method */}
        <section className="border border-line bg-cream p-4 sm:p-8 space-y-5 shadow-sm">
          <div>
            <h2 className="font-serif font-bold text-2xl text-ink">3. Payment Method</h2>
            <p className="mt-0.5 text-xs text-muted">Select your preferred payment option below.</p>
          </div>

          <div className="space-y-4 pt-1">
            {/* Cash on Delivery Option (Primary) */}
            {settings.features.cod_enabled && (
              <div
                onClick={() => setPaymentMethod("cod")}
                className={`cursor-pointer border p-4 transition-all ${
                  paymentMethod === "cod"
                    ? "border-accent bg-accent/5 ring-1 ring-accent/30 shadow-sm"
                    : "border-line bg-white/60 hover:border-accent/40"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-accent mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-ink">Cash on Delivery (COD)</span>
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[0.625rem] font-bold text-emerald-800">
                        MOST POPULAR
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted leading-relaxed font-medium">
                      Pay cash directly upon delivery at your doorstep. No advance payment required.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* bKash Option */}
            <div
              onClick={() => setPaymentMethod("bkash")}
              className={`cursor-pointer border p-4 transition-all ${
                paymentMethod === "bkash"
                  ? "border-accent bg-accent/5 ring-1 ring-accent/30 shadow-sm"
                  : "border-line bg-white/60 hover:border-accent/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="accent-accent"
                  />
                  <div className="flex h-7 items-center justify-center rounded bg-white px-2 py-0.5 shadow-sm">
                    <Image src="/images/payments/bkash.png" alt="bKash" width={60} height={18} className="h-4 w-auto object-contain" />
                  </div>
                  <span className="text-sm font-bold text-ink">bKash (Send Money / Payment)</span>
                </div>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[0.625rem] font-bold text-emerald-800">
                  VERIFIED
                </span>
              </div>

              {paymentMethod === "bkash" && (
                <div className="mt-4 border-t border-line/60 pt-4 text-xs space-y-3.5 text-ink/80">
                  <div className="flex items-center justify-between rounded bg-sand/80 p-3.5 border border-line flex-wrap gap-3">
                    <div>
                      <p className="text-[0.6875rem] font-medium text-muted">bKash Send Money Number:</p>
                      <p className="font-mono text-lg font-bold text-accent">{bkashNumber}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(bkashNumber, "bKash");
                      }}
                      className="btn btn-outline h-9 px-3.5 text-xs gap-1.5 cursor-pointer bg-white"
                    >
                      {copiedField === "bKash" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      {copiedField === "bKash" ? "Copied" : "Copy Number"}
                    </button>
                  </div>

                  <p className="leading-relaxed bg-white/70 p-3 rounded border border-line/60 text-xs text-ink">
                    <strong>Instructions:</strong> Open bKash App, select <em>Send Money</em> to the number above for <strong>{formatBDT(total)}</strong>, then enter your TrxID below:
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[0.6875rem] text-ink">
                        Sender bKash Number *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="mt-1 w-full border border-line bg-white px-3 py-2 text-xs focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[0.6875rem] text-ink">
                        Transaction ID (TrxID) *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. 9K48FL72P"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="mt-1 w-full border border-line bg-white px-3 py-2 text-xs uppercase focus:border-accent focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nagad Option */}
            <div
              onClick={() => setPaymentMethod("nagad")}
              className={`cursor-pointer border p-4 transition-all ${
                paymentMethod === "nagad"
                  ? "border-accent bg-accent/5 ring-1 ring-accent/30 shadow-sm"
                  : "border-line bg-white/60 hover:border-accent/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "nagad"}
                    onChange={() => setPaymentMethod("nagad")}
                    className="accent-accent"
                  />
                  <div className="flex h-7 items-center justify-center rounded bg-white px-2 py-0.5 shadow-sm">
                    <Image src="/images/payments/nagad.png" alt="Nagad" width={60} height={18} className="h-4 w-auto object-contain" />
                  </div>
                  <span className="text-sm font-bold text-ink">Nagad (Send Money)</span>
                </div>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[0.625rem] font-bold text-emerald-800">
                  VERIFIED
                </span>
              </div>

              {paymentMethod === "nagad" && (
                <div className="mt-4 border-t border-line/60 pt-4 text-xs space-y-3.5 text-ink/80">
                  <div className="flex items-center justify-between rounded bg-sand/80 p-3.5 border border-line flex-wrap gap-3">
                    <div>
                      <p className="text-[0.6875rem] font-medium text-muted">Nagad Send Money Number:</p>
                      <p className="font-mono text-lg font-bold text-accent">{nagadNumber}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(nagadNumber, "Nagad");
                      }}
                      className="btn btn-outline h-9 px-3.5 text-xs gap-1.5 cursor-pointer bg-white"
                    >
                      {copiedField === "Nagad" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      {copiedField === "Nagad" ? "Copied" : "Copy Number"}
                    </button>
                  </div>

                  <p className="leading-relaxed bg-white/70 p-3 rounded border border-line/60 text-xs text-ink">
                    <strong>Instructions:</strong> Open Nagad App, tap <em>Send Money</em> to the number above for <strong>{formatBDT(total)}</strong>, and submit your TrxID below:
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[0.6875rem] text-ink">
                        Sender Nagad Number *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="mt-1 w-full border border-line bg-white px-3 py-2 text-xs focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[0.6875rem] text-ink">
                        Transaction ID (TrxID) *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. 7M99AB21"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="mt-1 w-full border border-line bg-white px-3 py-2 text-xs uppercase focus:border-accent focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Right: Sticky Order Summary */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28 border border-line bg-cream p-4 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="font-serif font-bold text-2xl text-ink">Order Summary</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <ul className="max-h-72 overflow-y-auto divide-y divide-line/70 pr-1">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3.5 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-sand border border-line/60 rounded">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  )}
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[0.625rem] font-bold text-cream shadow-sm">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-sm text-ink truncate">{item.name}</h3>
                  <p className="text-xs text-muted">{formatBDT(item.price)} each</p>
                </div>
                <span className="text-sm font-bold text-ink tabular-nums">
                  {formatBDT(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          {/* Coupon Code Input */}
          <div className="border-t border-line pt-4 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink">
              Coupon / Promo Code
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded text-xs">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-700 shrink-0" />
                  <span className="font-mono font-bold text-emerald-900">{appliedCoupon.code}</span>
                  <span className="text-emerald-700 font-semibold">({appliedCoupon.discount_percent}% OFF applied)</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. YUME20 / YUME30"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 border border-line bg-white/80 px-3 py-2 text-xs uppercase font-mono tracking-wider focus:border-accent focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon}
                  className="btn btn-outline h-9 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer bg-white hover:bg-sand"
                >
                  {validatingCoupon ? <Loader2 size={13} className="animate-spin" /> : "Apply"}
                </button>
              </div>
            )}
          </div>

          <dl className="space-y-3 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted font-medium">Subtotal</dt>
              <dd className="font-bold text-ink">{formatBDT(subtotal)}</dd>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-800 font-medium bg-emerald-50/60 p-2 rounded border border-emerald-100">
                <dt className="font-semibold">Discount ({appliedCoupon?.code} · {appliedCoupon?.discount_percent}%)</dt>
                <dd className="font-bold">−{formatBDT(discountAmount)}</dd>
              </div>
            )}
            <div className="flex justify-between items-center">
              <dt className="text-muted font-medium">
                Delivery ({deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"})
              </dt>
              <dd className="font-bold text-ink">
                {isFreeDelivery ? (
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded text-xs">
                    FREE 🎉
                  </span>
                ) : (
                  formatBDT(deliveryCharge)
                )}
              </dd>
            </div>
          </dl>

          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="font-serif text-xl sm:text-2xl font-bold text-ink">Total to Pay</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-accent">{formatBDT(total)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="checkout-place-order-btn"
            className="btn btn-primary w-full h-14 gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-lg cursor-pointer hover:shadow-xl active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing Order...
              </>
            ) : (
              <>
                Confirm Order
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Trust Guarantees Badges */}
          <div className="space-y-2 border-t border-line/60 pt-4 text-xs text-muted">
            <div className="flex items-center gap-2 text-ink font-semibold">
              <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
              <span>18K Gold Plated Stainless Steel · Waterproof</span>
            </div>
            <div className="flex items-center gap-2 text-ink font-semibold">
              <RefreshCw size={16} className="text-accent shrink-0" />
              <span>3-Day Replacement Guarantee (Damaged / Defective)</span>
            </div>
            <div className="flex items-center gap-2 text-ink font-semibold">
              <PhoneCall size={16} className="text-accent shrink-0" />
              <span>Fast Dispatch · Dedicated Customer Care</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
