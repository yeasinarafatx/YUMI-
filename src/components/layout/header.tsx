"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useCartStore, selectCartCount } from "@/stores/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Logo } from "@/components/layout/logo";
import { InstagramIcon, FacebookIcon } from "@/components/icons/brand-icons";
import type { SocialLinks } from "@/types";

interface HeaderProps {
  social: SocialLinks;
}

export function Header({ social }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const hydrated = useHydrated();
  const count = useCartStore(selectCartCount);
  const cartCount = hydrated ? count : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-500",
          scrolled
            ? "border-line bg-cream/90 shadow-[0_8px_30px_-20px_rgba(42,10,14,0.25)] backdrop-blur-md"
            : "border-transparent bg-cream",
        )}
      >
        <div className="container-luxe grid h-20 grid-cols-[1fr_auto_1fr] items-center md:h-24">
          {/* Left: menu (mobile) / nav (desktop) */}
          <div className="flex items-center">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="-ml-2 inline-flex h-12 w-12 items-center justify-center rounded-full text-ink transition-all hover:bg-line/40 active:scale-90 lg:hidden cursor-pointer"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-drawer"
              id="header-menu-button"
            >
              <Menu size={26} strokeWidth={1.5} />
            </button>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-7 xl:gap-9">
                {siteConfig.nav.map((item) => {
                  const active =
                    pathname === item.href || (item.href !== "/shop" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className="link-luxe text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink/85 transition-colors hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Center: logo */}
          <div className="flex justify-center">
            <Logo />
          </div>

          {/* Right: social links + search + cart */}
          <div className="flex items-center justify-end gap-1 md:gap-2">
            {social.instagram && (
              <a
                href={social.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Follow YUME on Instagram"
                className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:text-accent active:scale-95"
              >
                <InstagramIcon size={19} colored={false} />
              </a>
            )}
            {social.facebook && (
              <a
                href={social.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Connect with YUME on Facebook"
                className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:text-accent active:scale-95"
              >
                <FacebookIcon size={19} colored={false} />
              </a>
            )}
            <Link
              href="/search"
              id="header-search-link"
              className="inline-flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-accent"
              aria-label="Search products"
            >
              <Search size={20} strokeWidth={1.25} />
            </Link>
            <button
              type="button"
              onClick={useCartStore.getState().open}
              id="header-cart-link"
              className="relative -mr-2.5 inline-flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-accent"
              aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            >
              <ShoppingBag size={20} strokeWidth={1.25} />
              <span
                className={cn(
                  "absolute right-1 top-1.5 flex h-[1.05rem] min-w-[1.05rem] items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold leading-none text-on-accent transition-transform duration-300",
                  cartCount > 0 ? "scale-100" : "scale-0",
                )}
                aria-hidden="true"
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} social={social} pathname={pathname} />
    </>
  );
}
