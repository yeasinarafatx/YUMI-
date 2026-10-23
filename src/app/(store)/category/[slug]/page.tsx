import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShopView } from "@/components/shop/shop-view";
import { getAllProducts, getCategories, getCategoryBySlug, getSiteSettings } from "@/lib/data";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Collection`,
    description: `Shop our curated collection of delicate ${category.name.toLowerCase()} at YUME Jewellery.`,
  };
}

export const instant = false;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, categories, settings] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="mb-10 text-center">
        <span className="eyebrow mb-2">Curated Category</span>
        <h1 className="font-serif text-4xl text-ink md:text-5xl">{category.name}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Discover our waterproof & anti-tarnish {category.name.toLowerCase()} (18K gold plated) designed to bring subtle luxury and elegance to your everyday style.
        </p>
      </div>

      <ShopView
        products={products}
        categories={categories}
        initialCategorySlug={slug}
        showStock={settings.features.show_stock}
      />
    </div>
  );
}
