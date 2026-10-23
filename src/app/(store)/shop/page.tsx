import type { Metadata } from "next";
import { ShopView } from "@/components/shop/shop-view";
import { getAllProducts, getCategories, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop All Jewellery",
  description: "Browse our complete collection of waterproof & anti-tarnish stainless steel earrings, necklaces, rings, and bracelets (18K gold plated).",
};

export const instant = false;

export default async function ShopPage() {
  const [products, categories, settings] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="mb-10 text-center">
        <span className="eyebrow mb-2">The Complete Collection</span>
        <h1 className="font-serif text-4xl text-ink md:text-5xl">Shop All Jewellery</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Thoughtfully crafted pieces in warm gold and delicate pearls, made to accompany you through every day and every celebration.
        </p>
      </div>

      <ShopView
        products={products}
        categories={categories}
        initialCategorySlug="all"
        showStock={settings.features.show_stock}
      />
    </div>
  );
}
