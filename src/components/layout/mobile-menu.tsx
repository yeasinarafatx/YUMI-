"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Search, Phone, MessageSquare, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons/brand-icons";
import {
  SparkleAllIcon,
  EarringPairIcon,
  PendantNecklaceIcon,
  SolitaireRingIcon,
  BangleBraceletIcon,
} from "@/components/icons/luxury-icons";
import type { SocialLinks } from "@/types";
import { Logo } from "@/components/layout/logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  social: SocialLinks;
  pathname: string;
}

const categoriesWithMeta = [
  { label: "Shop All", subtitle: "Complete Collection", href: "/shop", Icon: SparkleAllIcon },
  { label: "Earrings", subtitle: "Hoops, Studs & Drops", href: "/category/earrings", Icon: EarringPairIcon },
  { label: "Necklaces", subtitle: "Chains & Pendants", href: "/category/necklaces", Icon: PendantNecklaceIcon },
  { label: "Rings", subtitle: "Stackable & Statement", href: "/category/rings", Icon: SolitaireRingIcon },
  { label: "Bracelets", subtitle: "Cuffs & Bangles", href: "/category/bracelets", Icon: BangleBraceletIcon },
];

export function MobileMenu({ open, onClose, social, pathname }: MobileMenuProps) {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Close when pathname changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const socials = [
    { href: social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: social.tiktok, label: "TikTok", Icon: TikTokIcon },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href));

  return (
    <div
      className={`fixed inset-0 z-[100] lg:hidden transition-visibility duration-300 ${
        open ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
      id="mobile-navigation-drawer"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header inside Drawer */}
        <div className="flex h-20 items-center justify-between border-b border-line px-5">
          <Logo size="md" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-line/40 active:scale-90"
            aria-label="Close menu"
            id="mobile-menu-close"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Quick Search inside menu */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              placeholder="Search jewellery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-line bg-white/70 py-2.5 pl-3.5 pr-10 text-xs text-ink placeholder:text-muted focus:border-accent focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-accent"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Special Feature Highlight Banner */}
          <div className="rounded border border-accent/20 bg-accent/5 p-3.5">
            <div className="flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-accent">
              <Sparkles size={14} />
              <span>Fine Demi-Fine Jewellery</span>
            </div>
            <p className="mt-1 text-xs font-medium text-ink">
              18K Gold Plated Stainless Steel · Waterproof & Tarnish-Resistant
            </p>
          </div>

          {/* Category Navigation */}
          <div>
            <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-muted">
              Categories
            </p>
            <ul className="divide-y divide-line/60">
              {categoriesWithMeta.map((item) => {
                const active =
                  pathname === item.href || (item.href !== "/shop" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between py-3.5 transition-colors ${
                        active ? "text-accent font-semibold" : "text-ink hover:text-accent"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 shadow-xs ${
                          active
                            ? "bg-accent text-cream border border-accent"
                            : "bg-sand/80 border border-line/70 text-accent group-hover:bg-accent group-hover:text-cream"
                        }`}>
                          <item.Icon size={19} />
                        </span>
                        <div>
                          <p className="font-serif text-lg leading-tight transition-colors group-hover:text-accent">{item.label}</p>
                          <p className="text-[0.6875rem] text-muted">{item.subtitle}</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-muted/60 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Customer Support Links */}
          <div className="rounded border border-line bg-white/50 p-4 space-y-2.5">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Direct Support
            </p>
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-xs font-medium text-emerald-800 hover:underline"
            >
              <MessageSquare size={16} className="text-[#25D366]" />
              WhatsApp Support (Chat Now)
            </a>
            <a
              href="tel:01700000000"
              className="flex items-center gap-2.5 text-xs font-medium text-ink hover:text-accent"
            >
              <Phone size={16} className="text-accent" />
              Helpline: 01700-000000
            </a>
          </div>

          {/* Secondary Pages */}
          <ul className="space-y-2.5 pt-2">
            {[
              { label: "About YUME", href: "/about" },
              { label: "Contact Us", href: "/contact" },
              { label: "Shipping & Returns Policy", href: "/shipping-returns" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block text-xs font-medium text-muted transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer inside Drawer */}
        <div className="border-t border-line px-5 py-4 bg-cream/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-ink">
              <ShieldCheck size={16} className="text-accent" />
              <span>Cash on Delivery & Secure Payments</span>
            </div>
            {socials.length > 0 && (
              <div className="flex items-center gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`YUME on ${label}`}
                    title={`Follow on ${label}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/80 text-ink transition-all hover:border-accent hover:text-accent active:scale-95 shadow-xs"
                  >
                    <Icon size={16} colored={false} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
