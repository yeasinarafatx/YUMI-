import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProductWithRelations, StockState } from "@/types";

/** Merge Tailwind class names safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const bdtFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

/** Format a number as Bangladeshi Taka, e.g. 1250 → "৳1,250". */
export function formatBDT(amount: number): string {
  return `৳${bdtFormatter.format(Math.round(amount))}`;
}

/** Percentage saved when a compare-at price is set. */
export function discountPercent(price: number, compareAt: number | null) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export const LOW_STOCK_THRESHOLD = 5;

/**
 * Derive a product's stock state. When `track_stock` is OFF, stock is never
 * shown nor enforced anywhere in the store.
 */
export function getStockState(
  product: Pick<ProductWithRelations, "track_stock" | "stock_quantity">,
): StockState {
  if (!product.track_stock) return { kind: "untracked" };
  const qty = product.stock_quantity ?? 0;
  if (qty <= 0) return { kind: "out_of_stock" };
  if (qty <= LOW_STOCK_THRESHOLD) return { kind: "low_stock", quantity: qty };
  return { kind: "in_stock", quantity: qty };
}

/** Normalise a Bangladeshi phone number to international format for wa.me links. */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return digits;
}

/** Warm-cream placeholder shown while images load (prevents flashes / CLS). */
export const IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="10"><rect width="8" height="10" fill="#EADCC3"/></svg>`,
)}`;
