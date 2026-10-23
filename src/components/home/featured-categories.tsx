import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { IMAGE_PLACEHOLDER } from "@/lib/utils";
import type { Category } from "@/types";

const categorySubtitleMap: Record<string, string> = {
  earrings: "Studs, Hoops & Drops",
  necklaces: "Chains & Pendants",
  rings: "Bands & Statement Rings",
  bracelets: "Cuffs & Bangles",
};

export function FeaturedCategories({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="categories-heading" className="container-luxe py-12 md:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Shop by category"
          title="Find Your Signature Piece"
          description="From everyday waterproof earrings to statement chains — 18K gold plated anti-tarnish jewellery to treasure."
        />
      </Reveal>

      <ul className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-6 mt-8">
        {categories.map((cat, i) => (
          <li key={cat.id}>
            <Reveal delay={i * 0.08}>
              <Link
                href={`/category/${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded bg-sand shadow-sm transition-all hover:shadow-md"
                id={`category-card-${cat.slug}`}
              >
                {cat.image_url && (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    placeholder="blur"
                    blurDataURL={IMAGE_PLACEHOLDER}
                    className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.08]"
                  />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent transition-opacity duration-500 group-hover:opacity-90"
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-4 text-center md:p-6">
                  <h3 className="font-serif font-bold text-[1.4rem] sm:text-[1.6rem] md:text-[1.8rem] leading-none text-white drop-shadow-md">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-[0.6875rem] font-medium text-cream/90">
                    {categorySubtitleMap[cat.slug] || "Explore Collection"}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.25em] text-gold drop-shadow-sm md:text-[0.625rem]">
                    Shop Now →
                  </span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
