import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ProductRail } from "@/components/home/product-rail";
import { Price } from "@/components/ui/price";
import { discountPercent } from "@/lib/utils";
import { getAllProducts, getProductBySlug, getRelatedProducts, getSiteSettings } from "@/lib/data";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const image = product.images[0]?.url;

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | YUME Jewellery`,
      description: product.description,
      images: image ? [{ url: image, alt: product.name }] : [],
    },
  };
}

export const instant = false;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [settings, related] = await Promise.all([
    getSiteSettings(),
    getRelatedProducts(product.id, product.category_id, 4),
  ]);

  const discount = discountPercent(product.price, product.compare_at_price);

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price,
      availability:
        product.track_stock && (product.stock_quantity ?? 0) <= 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-luxe py-8 md:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
            <li>
              <Link href="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <li>/</li>
            {product.category && (
              <>
                <li>
                  <Link href={`/category/${product.category.slug}`} className="hover:text-accent">
                    {product.category.name}
                  </Link>
                </li>
                <li>/</li>
              </>
            )}
            <li className="text-ink font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Gallery (7 cols on desktop) */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} title={product.name} />
          </div>

          {/* Right: Details (5 cols on desktop) */}
          <div className="flex flex-col justify-center lg:col-span-5">
            {product.category && (
              <span className="eyebrow mb-2">{product.category.name}</span>
            )}
            <h1 className="font-serif text-3xl text-ink sm:text-4xl md:text-5xl">
              {product.name}
            </h1>

            {/* Price & Savings badge */}
            <div className="mt-4 flex items-center gap-3">
              <Price price={product.price} compareAt={product.compare_at_price} size="lg" />
              {discount && (
                <span className="rounded bg-accent px-2.5 py-1 text-xs font-semibold text-cream">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-ink/80">
              <p>{product.description}</p>
            </div>

            {/* Actions (Quantity, Add to Cart, WhatsApp Order, Delivery Guarantee) */}
            <div className="mt-8">
              <ProductActions product={product} settings={settings} />
            </div>
          </div>
        </div>

        {/* Reserved Reviews Section (gated by feature flag) */}
        {settings.features.reviews_enabled && (
          <section className="mt-20 border-t border-line pt-16">
            <h2 className="font-serif text-3xl text-ink">Customer Reviews</h2>
            <p className="mt-2 text-sm text-muted">There are no reviews yet. Be the first to review this piece!</p>
          </section>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24 border-t border-line pt-16">
            <ProductRail
              id="related-products"
              eyebrow="You might also love"
              title="Complete the look"
              products={related}
              showStock={settings.features.show_stock}
            />
          </div>
        )}
      </div>
    </>
  );
}
