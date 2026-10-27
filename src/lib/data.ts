/**
 * Data-access layer for the storefront.
 *
 * Every page/component gets data ONLY through these functions.
 * Queries Supabase when configured with active tables, falling back
 * seamlessly to local sample data.
 */
import type { Category, ProductWithRelations } from "@/types";
import {
  sampleBestSellerIds,
  sampleCategories,
  sampleProducts,
} from "@/lib/sample-data";
import { getStoredSettings, type ExtendedSiteSettings } from "@/lib/settings-storage";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getSiteSettings(): Promise<ExtendedSiteSettings> {
  return getStoredSettings();
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch {
      // Fallback to sample categories
    }
  }
  return sampleCategories
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

function activeSampleProducts() {
  return sampleProducts.filter((p) => p.is_active);
}

export async function getAllProducts(): Promise<ProductWithRelations[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug),
          images:product_images(*)
        `)
        .eq("is_active", true);

      if (!error && data && data.length > 0) {
        return data as ProductWithRelations[];
      }
    } catch {
      // Fallback
    }
  }
  return activeSampleProducts();
}

/** Every product (including hidden ones), newest first. Admin-only. */
export async function getAdminProducts(): Promise<ProductWithRelations[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug),
          images:product_images(*)
        `)
        .order("created_at", { ascending: false });
      if (!error && data) {
        return data as ProductWithRelations[];
      }
    } catch {
      // Fallback
    }
  }
  return sampleProducts;
}

export async function getNewArrivals(limit = 8): Promise<ProductWithRelations[]> {
  const all = await getAllProducts();
  return [...all]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, limit);
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithRelations[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.is_featured).slice(0, limit);
}

/**
 * Best sellers. Ranked by featured / order history.
 */
export async function getBestSellers(limit = 4): Promise<ProductWithRelations[]> {
  const all = await getAllProducts();
  const byId = new Map(all.map((p) => [p.id, p]));
  const matched = sampleBestSellerIds
    .map((id) => byId.get(id))
    .filter((p): p is ProductWithRelations => Boolean(p));

  if (matched.length > 0) {
    return matched.slice(0, limit);
  }
  return all.slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name, slug),
          images:product_images(*)
        `)
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        return data as ProductWithRelations;
      }
    } catch {
      // Fallback
    }
  }
  const product = activeSampleProducts().find((p) => p.slug === slug);
  return product ?? null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug && c.is_active);
  return category ?? null;
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductWithRelations[]> {
  const all = await getAllProducts();
  const cat = await getCategoryBySlug(categorySlug);
  if (!cat) return [];
  return all.filter((p) => p.category?.slug === categorySlug || p.category_id === cat.id);
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4,
): Promise<ProductWithRelations[]> {
  const all = await getAllProducts();
  return all
    .filter((p) => p.id !== productId && (categoryId ? p.category_id === categoryId : true))
    .slice(0, limit);
}

/** Images for the Instagram-style gallery strip. */
export async function getGalleryImages(): Promise<{ url: string; alt: string }[]> {
  return [
    { url: "/images/sample/brand-story.jpg", alt: "Model wearing layered gold necklaces and fine rings" },
    { url: "/images/sample/prod-jhumka.jpg", alt: "Gold jhumka earrings with pearl fringe" },
    { url: "/images/sample/cat-rings.jpg", alt: "Stacked gold pearl rings" },
    { url: "/images/sample/prod-pearl-strand.jpg", alt: "Freshwater pearl strand necklace" },
    { url: "/images/sample/prod-hoops.jpg", alt: "Polished gold hoop earrings" },
    { url: "/images/sample/cat-necklaces.jpg", alt: "Garnet heart pendant necklace" },
  ];
}
