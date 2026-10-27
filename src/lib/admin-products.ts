import { revalidatePath } from "next/cache";
import { z } from "zod";

export const ProductInputSchema = z.object({
  name: z.string().trim().min(2, "Product name is required"),
  slug: z.string().trim().optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or more"),
  compare_at_price: z.number().min(0).nullable().optional(),
  category_id: z.string().nullable().optional(),
  track_stock: z.boolean().optional(),
  stock_quantity: z.number().int().min(0, "Stock cannot be negative").optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  image_url: z.string().optional(),
});

/** Same fields, all optional — used for partial updates (no defaults, so nothing is reset). */
export const ProductPatchSchema = ProductInputSchema.partial();

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const PRODUCT_SELECT = `
  *,
  category:categories(id, name, slug),
  images:product_images(*)
`;

/** Refresh every storefront page that shows products / stock. */
export function refreshStorefront() {
  revalidatePath("/", "layout");
}

export function friendlyProductError(message: string) {
  if (message.includes("products_slug_key") || message.includes("duplicate key")) {
    return "This URL slug is already used by another product. Please change it.";
  }
  return message;
}
