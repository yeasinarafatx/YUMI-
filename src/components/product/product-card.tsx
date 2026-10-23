import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/ui/price";
import { QuickAddBtn } from "@/components/product/quick-add-btn";
import { cn, discountPercent, getStockState, IMAGE_PLACEHOLDER } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";

interface ProductCardProps {
  product: ProductWithRelations;
  /** Respect the global show_stock flag from settings. */
  showStock?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function ProductCard({
  product,
  showStock = true,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  className,
}: ProductCardProps) {
  const [primary, secondary] = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
  const stock = getStockState(product);
  const pct = discountPercent(product.price, product.compare_at_price);
  const soldOut = stock.kind === "out_of_stock";

  return (
    <article className={cn("group relative transition-all duration-500 ease-out hover:-translate-y-1 active:scale-[0.98]", className)}>
      <Link
        href={`/product/${product.slug}`}
        className="block focus-visible:outline-offset-4"
        aria-label={`${product.name}${soldOut ? " — sold out" : ""}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          {primary && (
            <Image
              src={primary.url}
              alt={primary.alt ?? product.name}
              fill
              sizes={sizes}
              loading={priority ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL={IMAGE_PLACEHOLDER}
              className={cn(
                "object-cover transition-[transform,opacity] duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.06]",
                secondary && "group-hover:opacity-0",
                soldOut && "opacity-70",
              )}
            />
          )}
          {secondary && (
            <Image
              src={secondary.url}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}

          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5 md:left-3 md:top-3">
            {soldOut && (
              <span className="bg-ink/85 px-2.5 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-cream md:text-[0.625rem]">
                Sold out
              </span>
            )}
            {!soldOut && pct && (
              <span className="bg-accent px-2.5 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-cream md:text-[0.625rem]">
                −{pct}%
              </span>
            )}
          </div>

          {/* 1-Click Buy Now & Add to Bag */}
          <QuickAddBtn product={product} />
        </div>

        <div className="pt-3.5 md:pt-4">
          {product.category && (
            <p className="mb-1 text-[0.625rem] uppercase tracking-[0.22em] text-muted">
              {product.category.name}
            </p>
          )}
          <h3 className="font-serif text-[1.15rem] leading-tight text-ink transition-colors group-hover:text-accent md:text-[1.3rem]">
            {product.name}
          </h3>
          <Price price={product.price} compareAt={product.compare_at_price} className="mt-1.5" />
          {showStock && stock.kind === "low_stock" && (
            <p className="mt-1 text-[0.6875rem] font-medium text-accent">Only {stock.quantity} left</p>
          )}
        </div>
      </Link>
    </article>
  );
}
