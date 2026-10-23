/**
 * Static site configuration (things that rarely change and don't need the
 * admin panel). Dynamic content (numbers, delivery charges, hero, flags)
 * lives in `site_settings` — see lib/data.ts.
 */
export const siteConfig = {
  name: "YUME Jewellery",
  shortName: "YUME",
  tagline: "Dreamt in gold, made for you.",
  description:
    "YUME Jewellery — delicate, timeless jewellery designed in Bangladesh. Earrings, necklaces, rings and bracelets with Cash on Delivery, bKash & Nagad.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_BD",

  /**
   * Logo: drop your file at /public/logo.svg and set `useImage: true`.
   * Until then a refined text wordmark is rendered.
   */
  logo: {
    useImage: true,
    src: "/logo.png",
    lightSrc: "/logo.png",
    width: 850,
    height: 350,
  },

  nav: [
    { label: "Shop All", href: "/shop" },
    { label: "Earrings", href: "/category/earrings" },
    { label: "Necklaces", href: "/category/necklaces" },
    { label: "Rings", href: "/category/rings" },
    { label: "Bracelets", href: "/category/bracelets" },
  ],

  footer: {
    help: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "Search", href: "/search" },
    ],
    company: [
      { label: "About YUME", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
