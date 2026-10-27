"use client";

import Link from "next/link";
import type { Ref } from "react";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

interface BottomNavProps {
  pathname: string;
  cartCount: number;
  menuOpen: boolean;
  onShop: () => void;
  shopButtonRef?: Ref<HTMLButtonElement>;
}

const itemBase =
  "relative flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-[0.625rem] font-medium tracking-wide transition-colors active:scale-95 cursor-pointer";

/**
 * Mobile-only (below lg) fixed bottom navigation.
 * Shop opens the existing category drawer (MobileMenu); Cart opens the existing cart drawer.
 * There is no customer-account feature, so Account links to the existing Contact page.
 */
export function BottomNav({ pathname, cartCount, menuOpen, onShop, shopButtonRef }: BottomNavProps) {
  const color = (active: boolean) => (active ? "text-accent" : "text-muted hover:text-accent");
  const homeActive = pathname === "/";
  const shopActive = pathname.startsWith("/shop") || pathname.startsWith("/category");
  const accountActive = pathname.startsWith("/contact");

  return (
    <nav
      aria-label="Mobile"
      id="mobile-bottom-nav"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="flex h-14 items-stretch">
        <Link
          href="/"
          id="bottom-nav-home"
          aria-current={homeActive ? "page" : undefined}
          className={cn(itemBase, color(homeActive))}
        >
          <Home size={20} strokeWidth={1.5} />
          Home
        </Link>

        <button
          ref={shopButtonRef}
          type="button"
          onClick={onShop}
          id="bottom-nav-shop"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation-drawer"
          className={cn(itemBase, color(shopActive || menuOpen))}
        >
          <LayoutGrid size={20} strokeWidth={1.5} />
          Shop
        </button>

        <button
          type="button"
          onClick={useCartStore.getState().open}
          id="bottom-nav-cart"
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          className={cn(itemBase, color(false))}
        >
          <span className="relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span
              className={cn(
                "absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.575rem] font-semibold leading-none text-on-accent transition-transform duration-300",
                cartCount > 0 ? "scale-100" : "scale-0",
              )}
              aria-hidden="true"
            >
              {cartCount}
            </span>
          </span>
          Cart
        </button>

        <Link
          href="/contact"
          id="bottom-nav-account"
          aria-current={accountActive ? "page" : undefined}
          className={cn(itemBase, color(accountActive))}
        >
          <User size={20} strokeWidth={1.5} />
          Account
        </Link>
      </div>
    </nav>
  );
}
