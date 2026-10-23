import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";

interface ProductRailProps {
  id: string;
  eyebrow: string;
  title: string;
  products: ProductWithRelations[];
  link?: { label: string; href: string };
  showStock: boolean;
  className?: string;
}

/**
 * Product rail: swipeable snap-scroll row on mobile, 4-column grid on desktop.
 */
export function ProductRail({ id, eyebrow, title, products, link, showStock, className }: ProductRailProps) {
  if (products.length === 0) return null;
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className={cn("py-10 md:py-20", className)}>
      <div className="container-luxe">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} align="left" link={link} />
        </Reveal>
      </div>

      {/* Mobile: horizontal rail that bleeds to the screen edge */}
      <div className="md:mx-auto md:max-w-[88rem] md:px-10">
        <ul
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-3 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0"
          aria-label={title}
        >
          {products.map((product) => (
            <li key={product.id} className="w-[56%] shrink-0 snap-start sm:w-[42%] md:w-auto">
              <ProductCard product={product} showStock={showStock} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
