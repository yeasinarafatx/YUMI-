import { Suspense, type ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";
import { AnnouncementPopup } from "@/components/ui/announcement-popup";
import { getCategories, getSiteSettings } from "@/lib/data";

/**
 * Storefront chrome (announcement bar, header, footer, cart drawer, whatsapp float).
 * Shared by the (store) route group layout and the global 404 page.
 */
export async function StoreShell({ children }: { children: ReactNode }) {
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()]);

  return (
    <>
      <AnnouncementBar ticker={settings.marquee_ticker} text={settings.announcement_text} />
      <Suspense fallback={<div className="h-20 md:h-24 border-b border-line bg-cream" />}>
        <Header social={settings.social} />
      </Suspense>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer categories={categories} settings={settings} />
      <CartDrawer />
      <WhatsAppFloat whatsappNumber={settings.whatsapp_number} />
      <AnnouncementPopup popup={settings.announcement_popup} />
    </>
  );
}
