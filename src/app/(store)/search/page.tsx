import type { Metadata } from "next";
import { SearchView } from "@/components/search/search-view";
import { getAllProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Search Pieces",
  description: "Search waterproof stainless steel jewellery from YUME Jewellery.",
};

export const instant = false;

export default async function SearchPage() {
  const products = await getAllProducts();

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="mb-8 text-center">
        <span className="eyebrow mb-2">Instant Search</span>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Find What You Dream Of</h1>
      </div>
      <SearchView products={products} />
    </div>
  );
}
