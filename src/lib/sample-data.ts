/**
 * ⚠️ TEMPORARY SAMPLE DATA (Phase 1 preview only)
 * -------------------------------------------------
 * Images in /public/images/sample are AI-generated stand-ins.
 * Names, prices and descriptions are drafts for you to replace.
 * In Phase 2 this file becomes the seed script for Supabase and the
 * storefront will read from the database instead.
 */
import type { Category, ProductWithRelations, SiteSettings } from "@/types";

const IMG = "/images/sample";

export const sampleCategories: Category[] = [
  { id: "cat-earrings", name: "Earrings", slug: "earrings", image_url: `${IMG}/cat-earrings.jpg`, sort_order: 1, is_active: true },
  { id: "cat-necklaces", name: "Necklaces", slug: "necklaces", image_url: `${IMG}/cat-necklaces.jpg`, sort_order: 2, is_active: true },
  { id: "cat-rings", name: "Rings", slug: "rings", image_url: `${IMG}/cat-rings.jpg`, sort_order: 3, is_active: true },
  { id: "cat-bracelets", name: "Bracelets", slug: "bracelets", image_url: `${IMG}/cat-bracelets.jpg`, sort_order: 4, is_active: true },
];

const catRef = (id: string) => {
  const c = sampleCategories.find((x) => x.id === id)!;
  return { id: c.id, name: c.name, slug: c.slug };
};

type SeedProduct = Omit<ProductWithRelations, "images" | "category" | "is_active"> & {
  image: string;
  alt: string;
};

const seed: SeedProduct[] = [
  {
    id: "p-01",
    name: "Pearl Cascade Earrings",
    slug: "pearl-cascade-earrings",
    description:
      "Three freshwater pearls fall from a polished gold stud on whisper-fine chains. Light enough for every day, graceful enough for every occasion.",
    price: 1450,
    compare_at_price: 1850,
    category_id: "cat-earrings",
    track_stock: false,
    stock_quantity: null,
    is_featured: true,
    created_at: "2026-10-14T10:00:00Z",
    image: `${IMG}/cat-earrings.jpg`,
    alt: "Gold drop earrings with three freshwater pearls on cream paper",
  },
  {
    id: "p-02",
    name: "Garnet Heart Pendant",
    slug: "garnet-heart-pendant",
    description:
      "A deep wine-red heart set in a clean gold bezel on a delicate cable chain. A quiet declaration, made to be worn close.",
    price: 2250,
    compare_at_price: null,
    category_id: "cat-necklaces",
    track_stock: false,
    stock_quantity: null,
    is_featured: true,
    created_at: "2026-10-12T10:00:00Z",
    image: `${IMG}/cat-necklaces.jpg`,
    alt: "Gold chain necklace with a garnet heart pendant on linen",
  },
  {
    id: "p-03",
    name: "Pearl Stack Ring Set",
    slug: "pearl-stack-ring-set",
    description:
      "A hammered band crowned with a single pearl, paired with a slim polished ring. Wear them together or let each shine alone.",
    price: 1250,
    compare_at_price: null,
    category_id: "cat-rings",
    track_stock: false,
    stock_quantity: null,
    is_featured: false,
    created_at: "2026-10-16T10:00:00Z",
    image: `${IMG}/cat-rings.jpg`,
    alt: "Two stacked gold rings, one with a pearl, on a cream stone pedestal",
  },
  {
    id: "p-04",
    name: "Pearl Station Bracelet",
    slug: "pearl-station-bracelet",
    description:
      "Tiny pearls spaced along a fine gold chain, catching the light with every movement. The everyday bracelet you'll never take off.",
    price: 1650,
    compare_at_price: null,
    category_id: "cat-bracelets",
    track_stock: false,
    stock_quantity: null,
    is_featured: true,
    created_at: "2026-10-10T10:00:00Z",
    image: `${IMG}/cat-bracelets.jpg`,
    alt: "Delicate gold chain bracelet with pearl stations on cream silk",
  },
  {
    id: "p-05",
    name: "Classic Gold Hoops",
    slug: "classic-gold-hoops",
    description:
      "Softly rounded, high-polish hoops with a secure hinged clasp. The modern essential that goes from desk to dinner.",
    price: 1350,
    compare_at_price: null,
    category_id: "cat-earrings",
    track_stock: true,
    stock_quantity: 3,
    is_featured: true,
    created_at: "2026-10-17T10:00:00Z",
    image: `${IMG}/prod-hoops.jpg`,
    alt: "Pair of chunky polished gold hoop earrings",
  },
  {
    id: "p-06",
    name: "Mini Pearl Jhumka",
    slug: "mini-pearl-jhumka",
    description:
      "A contemporary take on the timeless jhumka — a brushed gold dome with a fringe of seed pearls, hung from a delicate open ring.",
    price: 1850,
    compare_at_price: 2200,
    category_id: "cat-earrings",
    track_stock: false,
    stock_quantity: null,
    is_featured: true,
    created_at: "2026-10-18T08:00:00Z",
    image: `${IMG}/prod-jhumka.jpg`,
    alt: "Modern gold jhumka earrings with pearl fringe beside a dried rose",
  },
  {
    id: "p-07",
    name: "Freshwater Pearl Strand",
    slug: "freshwater-pearl-strand",
    description:
      "Lustrous hand-knotted freshwater pearls finished with a petite gold clasp. An heirloom-in-the-making for brides and beyond.",
    price: 3450,
    compare_at_price: null,
    category_id: "cat-necklaces",
    track_stock: false,
    stock_quantity: null,
    is_featured: false,
    created_at: "2026-10-08T10:00:00Z",
    image: `${IMG}/prod-pearl-strand.jpg`,
    alt: "Single strand freshwater pearl necklace on cream silk",
  },
  {
    id: "p-08",
    name: "Ruby Dot Bangle",
    slug: "ruby-dot-bangle",
    description:
      "A slender polished bangle punctuated with a single drop of deep red. Minimal, stackable, and quietly striking.",
    price: 1950,
    compare_at_price: null,
    category_id: "cat-bracelets",
    track_stock: true,
    stock_quantity: 0,
    is_featured: false,
    created_at: "2026-10-15T10:00:00Z",
    image: `${IMG}/prod-bangle.jpg`,
    alt: "Slim gold bangle with a small red stone on a travertine block",
  },
];

export const sampleProducts: ProductWithRelations[] = seed.map(({ image, alt, ...p }) => ({
  ...p,
  is_active: true,
  category: p.category_id ? catRef(p.category_id) : null,
  images: [{ id: `${p.id}-img-1`, product_id: p.id, url: image, sort_order: 0, alt }],
}));

/** Sample best-sellers until real order data exists (Phase 3+). */
export const sampleBestSellerIds = ["p-02", "p-06", "p-04", "p-07"];

export const sampleSettings: SiteSettings = {
  whatsapp_number: "",
  bkash_number: "",
  nagad_number: "",
  delivery_inside_dhaka: 70,
  delivery_outside_dhaka: 130,
  free_delivery_threshold: 3000,
  announcement_text: "18K Gold Plated Stainless Steel · Cash on Delivery Nationwide · 3-Day Replacement",
  hero: {
    eyebrow: "The Autumn Edit · 2026",
    title: "Dreamt in gold,\nmade for you.",
    subtitle:
      "Delicate, timeless pieces designed to be treasured — from everyday essentials to the moments worth remembering.",
    image_url: `${IMG}/hero-banner.jpg`,
    image_alt: "Gold pearl necklace and pearl stud earrings resting on cream silk with a rose petal",
    primary_cta: { label: "Shop the collection", href: "/shop" },
    secondary_cta: { label: "New arrivals", href: "/shop?sort=newest" },
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: null,
  },
  instagram_handle: "yume.jewellery",
  features: {
    reviews_enabled: false,
    show_stock: true,
    cod_enabled: true,
  },
};
