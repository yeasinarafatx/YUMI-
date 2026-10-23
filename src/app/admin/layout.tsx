import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Package, Settings, ExternalLink } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: "YUME Admin Panel",
  robots: { index: false },
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Customizer & Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand/30 text-ink pb-20 md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-cream px-4 md:px-8">
        <div className="flex items-center gap-3">
          <Logo size="sm" asLink={false} />
          <span className="rounded bg-accent px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-cream">
            Admin CMS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
          >
            <span>View Store</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl md:grid md:grid-cols-[240px_1fr]">
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
        <main className="p-4 sm:p-6 md:p-8">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar (Phone-first for easy one-thumb control) */}
      <nav
        aria-label="Admin Navigation"
        className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-line bg-cream/95 backdrop-blur shadow-lg md:hidden"
      >
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-1 py-1 text-ink transition-colors hover:text-accent active:scale-95"
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="text-[0.625rem] font-medium uppercase tracking-wider">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
