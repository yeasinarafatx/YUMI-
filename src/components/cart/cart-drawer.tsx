"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore, selectCartCount, selectCartSubtotal } from "@/stores/cart-store";
import { formatBDT, toWhatsAppNumber } from "@/lib/utils";
import { sampleSettings } from "@/lib/sample-data";

export function CartDrawer() {
  const { items, isOpen, close, updateQuantity, removeItem } = useCartStore();
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Esc key & body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const threshold = sampleSettings.free_delivery_threshold ?? 3000;
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
  const diff = threshold - subtotal;

  // WhatsApp quick checkout link
  const waItemsText = items.map((i) => `• ${i.name} (x${i.quantity}) - ${formatBDT(i.price * i.quantity)}`).join("\n");
  const waMsg = `Hello YUME! I want to order from my cart:\n\n${waItemsText}\n\nSubtotal: ${formatBDT(subtotal)}\nPlease confirm availability!`;
  const waUrl = `https://wa.me/${toWhatsAppNumber(sampleSettings.whatsapp_number || "01700000000")}?text=${encodeURIComponent(waMsg)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <m.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl sm:border-l sm:border-line"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-line px-6">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-accent" />
                <h2 className="font-serif text-xl text-ink">Your Bag</h2>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                id="cart-drawer-close"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-sand/60 cursor-pointer active:scale-95"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Delivery Bar */}
            <div className="border-b border-line bg-sand/30 px-6 py-3.5">
              <div className="mb-1.5 flex justify-between text-xs font-medium text-ink">
                <span>
                  {diff <= 0 ? (
                    <span className="text-emerald-700">🎉 Congratulations! You have unlocked FREE Delivery!</span>
                  ) : (
                    <>Add <strong className="text-accent">{formatBDT(diff)}</strong> more for FREE delivery</>
                  )}
                </span>
                <span className="text-muted">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full bg-accent transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand text-accent">
                    <ShoppingBag size={28} strokeWidth={1.2} />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl text-ink">Your cart is empty</h3>
                  <p className="mt-2 max-w-xs text-sm text-muted">
                    Explore our waterproof stainless steel pieces and find something you&apos;ll cherish forever.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="btn btn-primary mt-6"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-4 py-4">
                      <div className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden bg-sand">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-sand text-xs text-muted">
                            YUME
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <h4 className="font-serif text-base text-ink line-clamp-1">{item.name}</h4>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="text-muted hover:text-accent"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="mt-0.5 text-sm font-semibold text-accent">{formatBDT(item.price)}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded border border-line bg-cream">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center text-ink hover:bg-sand"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-ink">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center text-ink hover:bg-sand"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-xs text-muted">
                            Total: <strong className="text-ink">{formatBDT(item.price * item.quantity)}</strong>
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="border-t border-line bg-cream p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">Subtotal</span>
                  <span className="font-serif text-2xl font-bold text-ink">{formatBDT(subtotal)}</span>
                </div>
                <p className="text-xs text-muted">
                  Delivery fee calculated at checkout. Cash on Delivery available across Bangladesh.
                </p>

                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/checkout"
                    onClick={close}
                    id="cart-drawer-checkout-btn"
                    className="btn btn-primary w-full h-12 gap-2 text-center text-xs uppercase tracking-wider shadow cursor-pointer"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </Link>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline w-full h-11 gap-2 text-center text-xs cursor-pointer"
                  >
                    Order via WhatsApp
                  </a>
                </div>
              </div>
            )}
          </m.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
