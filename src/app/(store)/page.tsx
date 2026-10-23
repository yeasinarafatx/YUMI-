import { Hero } from "@/components/home/hero";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { ProductRail } from "@/components/home/product-rail";
import { BrandStory } from "@/components/home/brand-story";
import { PromoBanner } from "@/components/home/promo-banner";
import { TrustBadges } from "@/components/home/trust-badges";
import { InstagramGallery } from "@/components/home/instagram-gallery";
import {
  getBestSellers,
  getCategories,
  getGalleryImages,
  getNewArrivals,
  getSiteSettings,
} from "@/lib/data";

export const instant = false;

export default async function HomePage() {
  const [settings, categories, newArrivals, bestSellers, gallery] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getNewArrivals(4),
    getBestSellers(4),
    getGalleryImages(),
  ]);

  const showStock = settings.features.show_stock;

  return (
    <>
      <Hero hero={settings.hero} />
      <FeaturedCategories categories={categories} />
      <ProductRail
        id="new-arrivals"
        eyebrow="Just in"
        title="New arrivals"
        products={newArrivals}
        showStock={showStock}
        link={{ label: "View all", href: "/shop?sort=newest" }}
        className="pt-0 md:pt-0"
      />
      <BrandStory />
      <PromoBanner {...settings.promo_banner} />
      <ProductRail
        id="best-sellers"
        eyebrow="Most loved"
        title="Best sellers"
        products={bestSellers}
        showStock={showStock}
        link={{ label: "Shop all", href: "/shop" }}
      />
      <TrustBadges freeDeliveryThreshold={settings.free_delivery_threshold} />
      <InstagramGallery
        images={gallery}
        handle={settings.instagram_handle}
        profileUrl={settings.social.instagram}
      />
    </>
  );
}
