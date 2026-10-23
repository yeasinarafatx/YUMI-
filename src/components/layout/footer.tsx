import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/layout/logo";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons/brand-icons";
import type { Category, SiteSettings } from "@/types";

const YEAR = new Date().getFullYear();

interface FooterProps {
  categories: Category[];
  settings: SiteSettings;
}

export function Footer({ categories, settings }: FooterProps) {
  const socials = [
    { href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.social.tiktok, label: "TikTok", Icon: TikTokIcon },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href));

  const columns = [
    {
      title: "Shop",
      links: [
        { label: "Shop All", href: "/shop" },
        ...categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
      ],
    },
    { title: "Help", links: siteConfig.footer.help },
    { title: "YUME", links: siteConfig.footer.company },
  ];

  return (
    <footer className="relative overflow-hidden bg-accent text-cream">
      {/* Large watermark wordmark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none font-serif text-[34vw] leading-none tracking-[0.12em] text-cream/[0.04] md:text-[22vw]"
      >
        YUME
      </span>

      <div className="container-luxe relative pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Logo tone="light" size="lg" className="mb-6" />
            <p className="max-w-xs font-serif text-xl italic leading-snug text-cream/85">
              {siteConfig.tagline}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/65">
              Delicate, timeless jewellery — thoughtfully designed and delivered across Bangladesh.
            </p>

            {socials.length > 0 && (
              <div className="mt-7 flex items-center gap-2.5">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`YUME on ${label}`}
                    title={`Follow YUME on ${label}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream/90 transition-all duration-300 hover:border-cream hover:bg-cream hover:text-accent active:scale-95"
                  >
                    <Icon size={18} colored={false} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:col-span-8 md:pl-8 lg:pl-16">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="mb-5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-cream/55">
                  {col.title}
                </h2>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="link-luxe text-sm text-cream/85 transition-colors hover:text-cream"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-6 border-t border-cream/15 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-cream/70">
              Verified Payment with
            </span>
            <div className="flex items-center gap-2">
              <div className="flex h-7 items-center justify-center rounded bg-white px-2 py-0.5 shadow-sm transition-transform hover:scale-105">
                <Image
                  src="/images/payments/bkash.png"
                  alt="bKash Verified"
                  width={64}
                  height={18}
                  className="h-4 w-auto object-contain"
                />
              </div>
              <div className="flex h-7 items-center justify-center rounded bg-white px-2 py-0.5 shadow-sm transition-transform hover:scale-105">
                <Image
                  src="/images/payments/nagad.png"
                  alt="Nagad Verified"
                  width={64}
                  height={18}
                  className="h-4 w-auto object-contain"
                />
              </div>
              <span className="inline-flex h-7 items-center rounded border border-cream/30 px-2.5 text-[0.6875rem] font-medium tracking-wider text-cream/90">
                Cash on Delivery
              </span>
            </div>
          </div>
          <p className="text-xs text-cream/55">
            © {YEAR} {siteConfig.name}. Made with love in Bangladesh.
          </p>
        </div>
      </div>
    </footer>
  );
}
