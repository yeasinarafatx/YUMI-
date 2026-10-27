"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { Zap, ShoppingBag, Loader2, Check } from "lucide-react";
import type { ProductWithRelations } from "@/types";

export function QuickAddBtn({ product }: { product: ProductWithRelations }) {
  const router = useRouter();
  const [isBuying, setIsBuying] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);
  const isSoldOut = product.track_stock && (product.stock_quantity ?? 0) <= 0;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      1,
    );

    router.push("/checkout");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      1,
    );

    toast.success(`${product.name} added to your bag!`);
    openCart();
    setTimeout(() => setIsAdding(false), 1200);
  };

  if (isSoldOut) return null;

  return (
    <div className="absolute inset-x-2 bottom-2 z-10 flex items-center gap-1.5 transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0">
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={isBuying}
        className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-sm bg-accent px-2.5 text-[0.6875rem] font-bold uppercase tracking-wider text-cream shadow-md transition-all duration-150 hover:bg-ink active:scale-95 cursor-pointer"
        aria-label={`Buy ${product.name} now`}
      >
        {isBuying ? (
          <>
            <Loader2 size={12} className="animate-spin text-gold" />
            <span>Redirecting...</span>
          </>
        ) : (
          <>
            <Zap size={12} className="fill-current text-gold" />
            <span>Buy Now</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={handleQuickAdd}
        disabled={isAdding}
        title="Add to bag"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-cream/95 text-ink shadow-md backdrop-blur transition-all duration-150 hover:bg-sand active:scale-95 cursor-pointer"
        aria-label={`Add ${product.name} to bag`}
      >
        {isAdding ? <Check size={14} className="text-emerald-700" /> : <ShoppingBag size={14} />}
      </button>
    </div>
  );
}
