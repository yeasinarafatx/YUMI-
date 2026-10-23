"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { ProductWithRelations } from "@/types";

export function SearchView({ products }: { products: ProductWithRelations[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Input Bar */}
      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search earrings, pearls, rings, necklaces..."
          className="w-full border-b-2 border-line bg-transparent py-4 pl-12 pr-10 text-lg md:text-xl font-serif text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-wider text-muted">
        <span>
          {query ? `Search results for "${query}"` : "All Collection Pieces"}
        </span>
        <span>{results.length} pieces</span>
      </div>

      {/* Grid */}
      {results.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-2xl text-ink">No matching pieces found</p>
          <p className="mt-2 text-sm text-muted">Try searching with a different keyword like &quot;gold&quot;, &quot;pearl&quot;, or &quot;hoops&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
