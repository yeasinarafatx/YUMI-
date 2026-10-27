import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Package, Settings, ExternalLink } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = {
  title: "YUME Admin Panel",
  robots: { index: false },
};

const navItems = [
  { label: "Dashboard", short: "Home", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", short: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", short: "Products", href: "/admin/products", icon: Package },
  { label: "Customizer & Settings", short: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand/30 text-ink pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-cream px-4 md:px-8">
        <div className="flex items-center gap-3">
          <Logo size="sm" asLink={false} />
          <span className="rounded bg-accent px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-cream">
            Admin CMS
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
          >
            <span>View Store</span>
            <ExternalLink size={13} />
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl md:grid md:grid-cols-[240px_minmax(0,1fr)]">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden border-r border-line bg-cream/50 p-6 md:block min-h-[calc(100vh-4rem)]">
          <nav className="space-y-1">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-sand/60 hover:text-accent"
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Page Content */}
        <main className="min-w-0 p-4 sm:p-6 md:p-8">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar (Phone-first for easy one-thumb control) */}
      <nav
        aria-label="Admin Navigation"
        className="fixed bottom-0 inset-x-0 z-40 flex items-stretch border-t border-line bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur shadow-lg md:hidden"
      >
        {navItems.map(({ short, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-ink transition-colors hover:text-accent active:scale-95"
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="w-full truncate text-center text-[0.625rem] font-medium tracking-wide">{short}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
