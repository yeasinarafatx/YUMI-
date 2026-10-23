"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore, selectCartCount, selectCartSubtotal } from "@/stores/cart-store";
import { formatBDT, toWhatsAppNumber } from "@/lib/utils";
import { sampleSettings } from "@/lib/sample-data";
import { useHydrated } from "@/hooks/use-hydrated";

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!hydrated) {
    return (
      <div className="container-luxe flex min-h-[50vh] items-center justify-center py-20">
        <p className="text-sm text-muted">Loading your cart...</p>
      </div>
    );
  }

  const threshold = sampleSettings.free_delivery_threshold ?? 3000;
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
  const diff = threshold - subtotal;

  const waNumber = toWhatsAppNumber(sampleSettings.whatsapp_number || "01700000000");
  const waItemsText = items.map((i) => `• ${i.name} (x${i.quantity}) - ${formatBDT(i.price * i.quantity)}`).join("\n");
  const waMsg = `Hello YUME! I want to order from my cart:\n\n${waItemsText}\n\nSubtotal: ${formatBDT(subtotal)}\nPlease confirm availability!`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;

  if (items.length === 0) {
    return (
      <div className="container-luxe flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sand text-accent">
          <ShoppingBag size={36} strokeWidth={1.2} />
        </div>
        <h1 className="mt-6 font-serif text-3xl md:text-4xl text-ink">Your cart is empty</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          Your shopping bag is currently empty. Explore our exquisite collection and find pieces you adore.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12 md:py-20">
      <h1 className="font-serif text-3xl md:text-4xl text-ink">Shopping Bag ({count})</h1>

      {/* Free Delivery Bar */}
      <div className="mt-6 border border-line bg-sand/30 p-4">
        <div className="mb-2 flex justify-between text-xs font-medium text-ink">
          <span>
            {diff <= 0 ? (
              <span className="text-emerald-800 font-semibold">🎉 Congratulations! You have unlocked FREE Delivery!</span>
            ) : (
              <>Add <strong className="text-accent">{formatBDT(diff)}</strong> more to unlock FREE Delivery!</>
            )}
          </span>
          <span className="text-muted">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8">
          <ul className="divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 py-6 sm:gap-6">
                <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-sand sm:w-28">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h2 className="font-serif text-lg md:text-xl text-ink">
                        <Link href={`/product/${item.slug}`} className="hover:text-accent">
                          {item.name}
                        </Link>
                      </h2>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-muted hover:text-accent"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-medium text-accent">{formatBDT(item.price)}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-line/60 pt-4">
                    <div className="flex items-center rounded border border-line bg-cream">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink hover:bg-sand"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-xs font-semibold text-ink">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink hover:bg-sand"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="font-semibold text-ink">
                      {formatBDT(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="border border-line bg-cream p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-2xl text-ink">Order Summary</h2>

            <dl className="space-y-3.5 border-b border-line pb-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatBDT(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery Fee</dt>
                <dd className="text-ink">
                  {diff <= 0 ? (
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-xs">FREE Delivery 🎉</span>
                  ) : (
                    "Calculated at checkout"
                  )}
                </dd>
              </div>
            </dl>

            <div className="flex justify-between font-serif text-xl font-bold text-ink">
              <span>Estimated Total</span>
              <span className="text-accent">{formatBDT(subtotal)}</span>
            </div>

            <div className="space-y-3 pt-2">
              <Link href="/checkout" id="cart-proceed-checkout" className="btn btn-primary w-full h-12 gap-2 text-center text-xs uppercase tracking-wider cursor-pointer">
                Proceed to Checkout
                <ArrowRight size={16} />
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full h-11 text-center text-xs cursor-pointer"
              >
                Order via WhatsApp
              </a>
            </div>

            <p className="pt-2 text-center text-xs text-muted">
              100% Secure Checkout · Cash on Delivery & Mobile Banking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
