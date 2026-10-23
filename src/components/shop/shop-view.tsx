"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { SlidersHorizontal, Check } from "lucide-react";
import type { Category, ProductWithRelations } from "@/types";

interface ShopViewProps {
  products: ProductWithRelations[];
  categories: Category[];
  initialCategorySlug?: string;
  showStock: boolean;
}

export function ShopView({
  products,
  categories,
  initialCategorySlug = "all",
  showStock,
}: ShopViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug);
  const [sortBy, setSortBy] = useState<"featured" | "newest" | "price-asc" | "price-desc">("newest");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const filtered = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category?.slug === selectedCategory);
    }

    // Filter by In-Stock
    if (inStockOnly) {
      list = list.filter((p) => !p.track_stock || (p.stock_quantity ?? 0) > 0);
    }

    // Sort
    if (sortBy === "newest") {
      list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedCategory, inStockOnly, sortBy]);

  return (
    <div>
      {/* Category Pills & Filters Bar */}
      <div className="mb-10 flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        {/* Category Filter Pills */}
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`whitespace-nowrap px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
              selectedCategory === "all"
                ? "bg-accent text-cream shadow-sm"
                : "border border-line bg-cream text-ink hover:border-accent"
            }`}
          >
            All Pieces ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category?.slug === cat.slug).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`whitespace-nowrap px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-accent text-cream shadow-sm"
                    : "border border-line bg-cream text-ink hover:border-accent"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Controls: In-Stock Toggle & Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
          {/* In-Stock Toggle */}
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-ink">
            <span
              className={`flex h-4 w-4 items-center justify-center border transition-colors ${
                inStockOnly ? "border-accent bg-accent text-cream" : "border-line bg-cream"
              }`}
            >
              {inStockOnly && <Check size={12} strokeWidth={3} />}
            </span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="sr-only"
            />
            <span>In Stock Only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-line bg-cream px-3 py-1.5 text-xs font-medium text-ink focus:border-accent focus:outline-none"
              aria-label="Sort products"
            >
              <option value="newest">Sort: Newest</option>
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
          <p className="font-serif text-2xl text-ink">No pieces match your filter</p>
          <p className="mt-2 text-sm text-muted">Try selecting a different category or clearing filters.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setInStockOnly(false);
            }}
            className="btn btn-outline mt-6"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showStock={showStock}
            />
          ))}
        </div>
      )}
    </div>
  );
}
