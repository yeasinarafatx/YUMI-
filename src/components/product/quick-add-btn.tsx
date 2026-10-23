"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { Zap, ShoppingBag } from "lucide-react";
import type { ProductWithRelations } from "@/types";

export function QuickAddBtn({ product }: { product: ProductWithRelations }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);
  const isSoldOut = product.track_stock && (product.stock_quantity ?? 0) <= 0;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;

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
    if (isSoldOut) return;

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
  };

  if (isSoldOut) return null;

  return (
    <div className="absolute inset-x-2 bottom-2 z-10 flex items-center gap-1.5 transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0">
      <button
        type="button"
        onClick={handleBuyNow}
        className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-sm bg-accent px-2.5 text-[0.6875rem] font-bold uppercase tracking-wider text-cream shadow-md transition-all hover:bg-ink active:scale-95 cursor-pointer"
        aria-label={`Buy ${product.name} now`}
      >
        <Zap size={12} className="fill-current text-gold" />
        <span>Buy Now</span>
      </button>
      <button
        type="button"
        onClick={handleQuickAdd}
        title="Add to bag"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-cream/95 text-ink shadow-md backdrop-blur transition-all hover:bg-sand active:scale-95 cursor-pointer"
        aria-label={`Add ${product.name} to bag`}
      >
        <ShoppingBag size={14} />
      </button>
    </div>
  );
}
