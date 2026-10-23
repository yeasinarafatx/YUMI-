/**
 * Domain types. These mirror the Supabase schema planned for Phase 2,
 * so the UI won't need to change when we swap sample data for the DB.
 */

export type UUID = string;

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface ProductImage {
  id: UUID;
  product_id: UUID;
  url: string;
  sort_order: number;
  alt?: string | null;
}

export interface Product {
  id: UUID;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category_id: UUID | null;
  track_stock: boolean;
  stock_quantity: number | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

/** Product joined with its images + category, as the storefront consumes it. */
export interface ProductWithRelations extends Product {
  images: ProductImage[];
  category: Pick<Category, "id" | "name" | "slug"> | null;
}

export type StockState =
  | { kind: "untracked" }
  | { kind: "in_stock"; quantity: number }
  | { kind: "low_stock"; quantity: number }
  | { kind: "out_of_stock" };

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  image_url: string;
  image_alt: string;
  primary_cta: { label: string; href: string };
  secondary_cta: { label: string; href: string } | null;
}

export interface SocialLinks {
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}

export interface FeatureFlags {
  reviews_enabled: boolean;
  show_stock: boolean;
  cod_enabled: boolean;
}

/** Public, client-safe site settings (stored as key/jsonb rows in Phase 2). */
export interface SiteSettings {
  whatsapp_number: string;
  bkash_number: string;
  nagad_number: string;
  delivery_inside_dhaka: number;
  delivery_outside_dhaka: number;
  free_delivery_threshold: number | null;
  announcement_text: string | null;
  hero: HeroContent;
  social: SocialLinks;
  instagram_handle: string | null;
  features: FeatureFlags;
}
