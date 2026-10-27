"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingBag, ShieldCheck, Truck, RefreshCw, Zap, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { formatBDT, getStockState, toWhatsAppNumber } from "@/lib/utils";
import type { ProductWithRelations, SiteSettings } from "@/types";

interface ProductActionsProps {
  product: ProductWithRelations;
  settings: SiteSettings;
}

export function ProductActions({ product, settings }: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  const stock = getStockState(product);
  const isSoldOut = stock.kind === "out_of_stock";
  const maxStock = stock.kind === "low_stock" || stock.kind === "in_stock" ? stock.quantity : 99;

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity((q) => Math.min(maxStock, q + 1));

  const handleBuyNow = () => {
    if (isSoldOut || isBuying) return;
    setIsBuying(true);

    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0]?.url ?? null,
        maxQuantity: product.track_stock ? product.stock_quantity : null,
      },
      quantity,
    );

    router.push("/checkout");
  };

  const handleAddToCart = () => {
    if (isSoldOut || isAdding) return;
    setIsAdding(true);

    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0]?.url ?? null,
        maxQuantity: product.track_stock ? product.stock_quantity : null,
      },
      quantity,
    );

    toast.success(`${product.name} added to your bag!`);
    openCart();
    setTimeout(() => setIsAdding(false), 1200);
  };

  // WhatsApp Order message
  const waNumber = toWhatsAppNumber(settings.whatsapp_number || "01700000000");
  const waMessage = `Hello YUME Jewellery!
I would like to order:
• Product: ${product.name}
• Price: ${formatBDT(product.price)}
• Quantity: ${quantity}
• Total: ${formatBDT(product.price * quantity)}
• Link: ${typeof window !== "undefined" ? window.location.href : `https://yumejewellery.com/product/${product.slug}`}

Please confirm my order with Cash on Delivery!`;

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  // Show sticky bar on mobile scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stock status indicator */}
      {product.track_stock && (
        <div className="flex items-center gap-2">
          {stock.kind === "out_of_stock" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
              Sold Out
            </span>
          ) : stock.kind === "low_stock" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-600" />
              🔥 Only {stock.quantity} left in stock - order soon!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              In Stock · Ready to Ship
            </span>
          )}
        </div>
      )}

      {/* Quantity & High-Conversion CTA Buttons */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Quantity selector */}
          {!isSoldOut && (
            <div className="flex h-13 w-32 shrink-0 items-center justify-between border border-line bg-white/70 px-3 shadow-xs">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="flex h-9 w-9 items-center justify-center text-ink disabled:opacity-30 hover:text-accent cursor-pointer active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold text-ink tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={quantity >= maxStock}
                className="flex h-9 w-9 items-center justify-center text-ink disabled:opacity-30 hover:text-accent cursor-pointer active:scale-95"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          {/* Primary Direct Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isSoldOut || isBuying}
            id="product-buy-now-btn"
            className="btn btn-primary h-13 min-w-0 flex-1 gap-2 px-3 sm:px-8 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-md cursor-pointer hover:shadow-lg active:scale-95 transition-all"
          >
            {isBuying ? (
              <>
                <Loader2 size={16} className="animate-spin text-gold" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <Zap size={16} className="fill-current text-gold" />
                {isSoldOut ? "Sold Out" : (<><span className="sm:hidden">Buy Now</span><span className="hidden sm:inline">Buy Now · Order Directly</span></>)}
              </>
            )}
          </button>
        </div>

        {/* Secondary: Add to Bag + WhatsApp */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isSoldOut}
            id="product-add-to-cart-btn"
            className="btn btn-outline h-12 gap-2 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-sand active:scale-95 transition-all"
          >
            {isAdding ? (
              <>
                <Check size={16} className="text-emerald-700" />
                <span className="text-emerald-800">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="product-whatsapp-order-btn"
            className="flex h-12 items-center justify-center gap-2 border border-[#25D366] bg-[#25D366]/10 text-xs font-bold uppercase tracking-wider text-emerald-950 transition-all hover:bg-[#25D366] hover:text-white active:scale-95 shadow-xs"
          >
            <Image src="/images/whatsapp.png" alt="WhatsApp" width={18} height={18} className="h-4 w-4 object-contain" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Guarantee & Policy Information Strip (Clean, Professional, No Filler) */}
      <div className="border-t border-line pt-6 space-y-3.5 text-xs text-muted">
        <div className="flex items-start gap-3">
          <Truck size={17} className="shrink-0 text-accent mt-0.5" />
          <span className="leading-relaxed text-ink">
            <strong className="font-semibold text-ink">Nationwide Delivery:</strong> Inside Dhaka (24–48 hrs) | Outside Dhaka (2–3 business days).
          </span>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck size={17} className="shrink-0 text-accent mt-0.5" />
          <span className="leading-relaxed text-ink">
            <strong className="font-semibold text-ink">Cash on Delivery:</strong> Safe cash payment upon receiving your parcel.
          </span>
        </div>
        <div className="flex items-start gap-3">
          <RefreshCw size={17} className="shrink-0 text-accent mt-0.5" />
          <span className="leading-relaxed text-ink">
            <strong className="font-semibold text-ink">3-Day Replacement:</strong> Free replacement if any piece arrives damaged, broken, or defective.
          </span>
        </div>
      </div>

      {/* Sticky Mobile Purchase Bar (Always within thumb reach on phone) */}
      <div
        className={`fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-line bg-cream/95 p-3 backdrop-blur-md transition-all duration-300 md:hidden ${
          showStickyBar ? "translate-y-0 opacity-100 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {product.images[0]?.url && (
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded bg-sand border border-line">
                <Image src={product.images[0].url} alt={product.name} fill sizes="44px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-serif text-xs font-bold text-ink truncate">{product.name}</p>
              <p className="font-serif text-sm font-bold text-accent">{formatBDT(product.price)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded border border-[#25D366] bg-[#25D366]/10 text-emerald-800"
              aria-label="Order on WhatsApp"
            >
              <Image src="/images/whatsapp.png" alt="WhatsApp" width={18} height={18} className="h-4 w-4 object-contain" />
            </a>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isSoldOut || isBuying}
              className="btn btn-primary h-10 px-5 text-xs font-bold uppercase tracking-wider shadow active:scale-95"
            >
              {isBuying ? "Loading..." : isSoldOut ? "Sold Out" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
