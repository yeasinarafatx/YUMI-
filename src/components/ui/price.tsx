import { cn, discountPercent, formatBDT } from "@/lib/utils";

interface PriceProps {
  price: number;
  compareAt?: number | null;
  className?: string;
  size?: "sm" | "lg";
}

/** Price with optional struck-through compare-at (sale) price. */
export function Price({ price, compareAt, className, size = "sm" }: PriceProps) {
  const pct = discountPercent(price, compareAt ?? null);
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className="sr-only">{pct ? "Sale price" : "Price"}</span>
      <span
        className={cn(
          "font-medium tabular-nums",
          pct ? "text-accent" : "text-ink",
          size === "lg" ? "text-2xl" : "text-[0.9375rem]",
        )}
      >
        {formatBDT(price)}
      </span>
      {pct && compareAt && (
        <>
          <span className="sr-only">Original price</span>
          <s className={cn("tabular-nums text-muted", size === "lg" ? "text-lg" : "text-[0.8125rem]")}>
            {formatBDT(compareAt)}
          </s>
        </>
      )}
    </p>
  );
}
