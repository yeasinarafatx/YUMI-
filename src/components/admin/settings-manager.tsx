"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Save,
  Sparkles,
  Megaphone,
  Image as ImageIcon,
  CreditCard,
  Truck,
  Loader2,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Bell,
  Ticket,
  Trash2,
  Plus,
  Tag,
} from "lucide-react";
import type { ExtendedSiteSettings } from "@/lib/settings-storage";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { InstagramIcon, FacebookIcon } from "@/components/icons/brand-icons";

export function SettingsManager({ initialSettings }: { initialSettings: ExtendedSiteSettings }) {
  const [settings, setSettings] = useState<ExtendedSiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [testingDb, setTestingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponPercent, setNewCouponPercent] = useState<number>(20);

  const handleAddCoupon = () => {
    if (!newCouponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    const code = newCouponCode.trim().toUpperCase();
    const existing = settings.coupons || [];
    if (existing.some((c) => c.code.toUpperCase() === code)) {
      toast.error("This coupon code already exists!");
      return;
    }
    const updated = [...existing, { code, discount_percent: newCouponPercent, is_active: true }];
    setSettings({ ...settings, coupons: updated });
    setNewCouponCode("");
    toast.success(`Coupon "${code}" added successfully!`);
  };

  const handleToggleCoupon = (code: string) => {
    const updated = (settings.coupons || []).map((c) =>
      c.code === code ? { ...c, is_active: !c.is_active } : c
    );
    setSettings({ ...settings, coupons: updated });
  };

  const handleDeleteCoupon = (code: string) => {
    const updated = (settings.coupons || []).filter((c) => c.code !== code);
    setSettings({ ...settings, coupons: updated });
    toast.success(`Coupon "${code}" deleted successfully!`);
  };

  const checkSupabaseStatus = async () => {
    setTestingDb(true);
    try {
      const res = await fetch("/api/admin/supabase-status");
      const data = await res.json();
      setDbStatus(data);
      if (data.connected) {
        toast.success("Supabase database connected successfully!");
      } else {
        toast.warning(data.message || "Connection incomplete.");
      }
    } catch {
      toast.error("Failed to check database status.");
    } finally {
      setTestingDb(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      const data = await res.json();
      setSettings(data.settings);
      toast.success("All store settings, offers, and banners saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-10 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Store & Offer Customizer</h1>
          <p className="mt-1 text-xs text-muted">
            Customize announcements, hero banners, special offers, payment details, and shipping rates.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary h-12 px-7 gap-2 shadow-md cursor-pointer self-start sm:self-auto font-bold"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      {/* 1. Scrolling Marquee Offer Ticker */}
      <section className="border border-line bg-cream p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-line pb-3 gap-3">
          <div className="flex items-center gap-2.5">
            <Megaphone className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-xl font-bold text-ink">
              1. Top Announcement Marquee Ticker
            </h2>
          </div>
          {/* Active / Hide Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.marquee_ticker?.is_active ?? false}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  marquee_ticker: {
                    ...(settings.marquee_ticker || {
                      primary_text: "",
                      secondary_text: "",
                      speed_seconds: 25,
                    }),
                    is_active: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 accent-accent"
            />
            <span className="text-xs font-bold text-ink">
              {settings.marquee_ticker?.is_active ? "Ticker Active (Visible)" : "Ticker Inactive (Hidden)"}
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Primary Announcement Text
            </label>
            <input
              type="text"
              value={settings.marquee_ticker?.primary_text ?? settings.announcement_text ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement_text: e.target.value,
                  marquee_ticker: {
                    ...(settings.marquee_ticker || {
                      is_active: true,
                      secondary_text: "",
                      speed_seconds: 25,
                    }),
                    primary_text: e.target.value,
                  },
                })
              }
              placeholder="e.g. 18K Gold Plated Stainless Steel · Nationwide Express Delivery"
              className="mt-1.5 w-full border border-line bg-white/70 p-3 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Secondary Announcement Text (Optional)
            </label>
            <input
              type="text"
              value={settings.marquee_ticker?.secondary_text ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  marquee_ticker: {
                    ...(settings.marquee_ticker || {
                      is_active: true,
                      primary_text: settings.announcement_text || "",
                      speed_seconds: 25,
                    }),
                    secondary_text: e.target.value,
                  },
                })
              }
              placeholder="e.g. 3-Day Replacement Guarantee on Defective Items"
              className="mt-1.5 w-full border border-line bg-white/70 p-3 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div className="rounded bg-sand/60 p-3 text-xs text-muted">
            💡 <strong>Pro Tip:</strong> Anything written here will smoothly scroll across the very top bar of the website. Uncheck the box above to hide the ticker completely.
          </div>
        </div>
      </section>

      {/* 2. Hero Banner & Texts */}
      <section className="border border-line bg-cream p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-line pb-3">
          <ImageIcon className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-xl font-bold text-ink">
            2. Hero Banner & Headline (Hero Section)
          </h2>
        </div>

        <div className="space-y-6">
          {/* Direct Drag & Drop Image Uploader */}
          <div className="border-b border-line/60 pb-6">
            <ImageDropzone
              value={settings.hero.image_url}
              onChange={(url) =>
                setSettings({
                  ...settings,
                  hero: { ...settings.hero, image_url: url },
                })
              }
              aspectRatio="16/9"
              label="Hero Banner Image (Drag & Drop or Tap to Upload)"
              hint="16:9 widescreen image (1920×1080 px). Drag and drop or browse from computer/phone."
            />

            <div className="mt-3 rounded border border-line/70 bg-sand/50 p-3 text-[0.6875rem] text-muted space-y-1">
              <p className="font-bold text-accent">📐 Recommended Specifications:</p>
              <p>• <strong>16:9 Widescreen (1920 × 1080 px)</strong> offers the crispest luxury presentation.</p>
              <p>• Keep focal jewellery piece in the center 60% safe area for responsive mobile viewing.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={settings.hero.eyebrow}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, eyebrow: e.target.value },
                  })
                }
                placeholder="e.g. The Autumn Edit · 2026 / Fine Jewellery"
                className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Primary Button Label
              </label>
              <input
                type="text"
                value={settings.hero.primary_cta.label}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: {
                      ...settings.hero,
                      primary_cta: { ...settings.hero.primary_cta, label: e.target.value },
                    },
                  })
                }
                placeholder="Shop the collection"
                className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Main Headline (Use \n for line breaks)
              </label>
              <input
                type="text"
                value={settings.hero.title}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, title: e.target.value },
                  })
                }
                placeholder="Dreamt in gold,\nmade for you."
                className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Special Offer & Flash Sale Banner */}
      <section className="border border-line bg-cream p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-line pb-3 gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-xl font-bold text-ink">
              3. Special Offer & Promo Banner
            </h2>
          </div>
          {/* Active / Hide Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.promo_banner?.is_active ?? false}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  promo_banner: {
                    ...(settings.promo_banner || {
                      title: "Festive Collection",
                      eyebrow: "Special Offer",
                      discount_text: "UP TO 30% OFF",
                      subtitle: "",
                      coupon_code: "YUME2026",
                      cta_text: "Shop Now",
                      cta_link: "/shop",
                    }),
                    is_active: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 accent-accent"
            />
            <span className="text-xs font-bold text-ink">
              {settings.promo_banner?.is_active ? "Banner Active (Visible on Home)" : "Banner Inactive (Hidden)"}
            </span>
          </label>
        </div>

        {/* Banner Details (shows warning if inactive) */}
        {!settings.promo_banner?.is_active && (
          <div className="rounded bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
            ℹ️ <strong>Currently Hidden:</strong> This banner is hidden on the storefront homepage. Check the box above anytime to display it.
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Offer Headline
            </label>
            <input
              type="text"
              value={settings.promo_banner?.title || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  promo_banner: {
                    ...(settings.promo_banner || {
                      is_active: false,
                      eyebrow: "",
                      discount_text: "",
                      subtitle: "",
                      coupon_code: "",
                      cta_text: "",
                      cta_link: "/shop",
                    }),
                    title: e.target.value,
                  },
                })
              }
              placeholder="e.g. Exclusive Autumn Edit"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Discount Tag
            </label>
            <input
              type="text"
              value={settings.promo_banner?.discount_text || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  promo_banner: {
                    ...(settings.promo_banner || {
                      is_active: true,
                      title: "",
                      eyebrow: "",
                      subtitle: "",
                      coupon_code: "",
                      cta_text: "",
                      cta_link: "/shop",
                    }),
                    discount_text: e.target.value,
                  },
                })
              }
              placeholder="e.g. UP TO 30% OFF"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-bold text-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Coupon Code
            </label>
            <input
              type="text"
              value={settings.promo_banner?.coupon_code || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  promo_banner: {
                    ...(settings.promo_banner || {
                      is_active: true,
                      title: "",
                      eyebrow: "",
                      discount_text: "",
                      subtitle: "",
                      cta_text: "",
                      cta_link: "/shop",
                    }),
                    coupon_code: e.target.value,
                  },
                })
              }
              placeholder="e.g. YUME20 / AUTUMN"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Button Label (CTA)
            </label>
            <input
              type="text"
              value={settings.promo_banner?.cta_text || "Shop Special Offers"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  promo_banner: {
                    ...(settings.promo_banner || {
                      is_active: true,
                      title: "",
                      eyebrow: "",
                      discount_text: "",
                      subtitle: "",
                      coupon_code: "",
                      cta_link: "/shop",
                    }),
                    cta_text: e.target.value,
                  },
                })
              }
              placeholder="Shop Special Offers"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Offer Description (Subtitle)
            </label>
            <textarea
              rows={2}
              value={settings.promo_banner?.subtitle || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  promo_banner: {
                    ...(settings.promo_banner || {
                      is_active: true,
                      title: "",
                      eyebrow: "",
                      discount_text: "",
                      coupon_code: "",
                      cta_text: "",
                      cta_link: "/shop",
                    }),
                    subtitle: e.target.value,
                  },
                })
              }
              placeholder="Delicate pieces designed for everyday elegance and enduring luster..."
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 4. Payment & Contact Numbers */}
      <section className="border border-line bg-cream p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-line pb-3">
          <CreditCard className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-xl font-bold text-ink">
            4. Verified Payments & Concierge Numbers
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              bKash Number
            </label>
            <input
              type="text"
              value={settings.bkash_number}
              onChange={(e) => setSettings({ ...settings, bkash_number: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Nagad Number
            </label>
            <input
              type="text"
              value={settings.nagad_number}
              onChange={(e) => setSettings({ ...settings, nagad_number: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              WhatsApp Concierge Number
            </label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Social Links Customization */}
        <div className="grid gap-5 sm:grid-cols-2 pt-4 border-t border-line/60">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink">
              <InstagramIcon size={16} colored={false} className="text-accent" />
              Instagram Profile URL
            </label>
            <input
              type="url"
              value={settings.social?.instagram || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  social: { ...settings.social, instagram: e.target.value },
                })
              }
              placeholder="https://instagram.com/yume.jewellery"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink">
              <FacebookIcon size={16} colored={false} className="text-accent" />
              Facebook Page URL
            </label>
            <input
              type="url"
              value={settings.social?.facebook || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  social: { ...settings.social, facebook: e.target.value },
                })
              }
              placeholder="https://facebook.com/yumejewellery"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 5. Delivery Rates */}
      <section className="border border-line bg-cream p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-line pb-3">
          <Truck className="h-5 w-5 text-accent" />
          <h2 className="font-serif text-xl font-bold text-ink">
            5. Delivery Rates & Free Shipping Limit
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Inside Dhaka Delivery Fee (৳)
            </label>
            <input
              type="number"
              value={settings.delivery_inside_dhaka}
              onChange={(e) =>
                setSettings({ ...settings, delivery_inside_dhaka: Number(e.target.value) })
              }
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Outside Dhaka Delivery Fee (৳)
            </label>
            <input
              type="number"
              value={settings.delivery_outside_dhaka}
              onChange={(e) =>
                setSettings({ ...settings, delivery_outside_dhaka: Number(e.target.value) })
              }
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Free Delivery Threshold (৳)
            </label>
            <input
              type="number"
              value={settings.free_delivery_threshold ?? 3000}
              onChange={(e) =>
                setSettings({ ...settings, free_delivery_threshold: Number(e.target.value) })
              }
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-medium"
            />
          </div>
        </div>
      </section>

      {/* 6. Announcement Welcome Popup Modal */}
      <section className="border border-line bg-cream p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-line pb-3 gap-3">
          <div className="flex items-center gap-2.5">
            <Bell className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-xl font-bold text-ink">
              6. Announcement, Offer & News Poster Modal
            </h2>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.announcement_popup?.is_active ?? true}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement_popup: {
                    ...(settings.announcement_popup || {
                      is_active: true,
                      badge_text: "✨ EXCLUSIVE OFFER",
                      title: "Waterproof Jewellery Special",
                      subtitle: "Get flat 20% OFF on all 18K gold plated waterproof stainless steel pieces! Use coupon code below at checkout.",
                      image_url: "/images/sample/cat-necklaces.jpg",
                      coupon_code: "YUME20",
                      cta_label: "Shop Special Offers",
                      cta_href: "/shop",
                    }),
                    is_active: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-ink">
              {settings.announcement_popup?.is_active ? "Active" : "Hidden"}
            </span>
          </label>
        </div>

        <p className="text-xs text-muted">
          First-time visitors see this premium card poster modal. You can upload an offer banner, festival announcement, or brand news. Can be used with or without a discount coupon.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Top Badge Text (Optional)
            </label>
            <input
              type="text"
              value={settings.announcement_popup?.badge_text || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement_popup: {
                    ...(settings.announcement_popup || {
                      is_active: true,
                      title: "Special Offer",
                      subtitle: "",
                      image_url: "/images/sample/cat-necklaces.jpg",
                    }),
                    badge_text: e.target.value,
                  },
                })
              }
              placeholder="e.g. ✨ EXCLUSIVE OFFER / SPECIAL NOTICE"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Poster Headline / Title
            </label>
            <input
              type="text"
              value={settings.announcement_popup?.title || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement_popup: {
                    ...(settings.announcement_popup || {
                      is_active: true,
                      subtitle: "",
                      image_url: "/images/sample/cat-necklaces.jpg",
                    }),
                    title: e.target.value,
                  },
                })
              }
              placeholder="e.g. Waterproof Jewellery Special"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Subtitle / Description Message
            </label>
            <textarea
              rows={2}
              value={settings.announcement_popup?.subtitle || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement_popup: {
                    ...(settings.announcement_popup || {
                      is_active: true,
                      title: "",
                      image_url: "/images/sample/cat-necklaces.jpg",
                    }),
                    subtitle: e.target.value,
                  },
                })
              }
              placeholder="Get flat 20% OFF on all 18K gold plated waterproof stainless steel pieces! Use coupon code below at checkout."
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Coupon Code (Leave empty if no discount coupon)
            </label>
            <input
              type="text"
              value={settings.announcement_popup?.coupon_code || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement_popup: {
                    ...(settings.announcement_popup || {
                      is_active: true,
                      title: "",
                      subtitle: "",
                      image_url: "/images/sample/cat-necklaces.jpg",
                    }),
                    coupon_code: e.target.value.toUpperCase(),
                  },
                })
              }
              placeholder="YUME20 (Optional)"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs font-mono font-bold tracking-wider text-accent focus:border-accent focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Button Label (CTA)
            </label>
            <input
              type="text"
              value={settings.announcement_popup?.cta_label || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement_popup: {
                    ...(settings.announcement_popup || {
                      is_active: true,
                      title: "",
                      subtitle: "",
                      image_url: "/images/sample/cat-necklaces.jpg",
                    }),
                    cta_label: e.target.value,
                  },
                })
              }
              placeholder="Shop Special Offers"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs text-ink focus:border-accent focus:bg-white focus:outline-none font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Button Link (e.g. /shop, /category/earrings, or WhatsApp link)
            </label>
            <input
              type="text"
              value={settings.announcement_popup?.cta_href || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement_popup: {
                    ...(settings.announcement_popup || {
                      is_active: true,
                      title: "",
                      subtitle: "",
                      image_url: "/images/sample/cat-necklaces.jpg",
                    }),
                    cta_href: e.target.value,
                  },
                })
              }
              placeholder="/shop or https://wa.me/8801700000000"
              className="mt-1.5 w-full border border-line bg-white/70 p-2.5 text-xs font-mono text-ink focus:border-accent focus:bg-white focus:outline-none font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageDropzone
              label="Poster Banner Image (16:9 Aspect Ratio - Recommended 1200x675)"
              aspectRatio="16/9"
              value={settings.announcement_popup?.image_url}
              onChange={(url) =>
                setSettings({
                  ...settings,
                  announcement_popup: {
                    ...(settings.announcement_popup || {
                      is_active: true,
                      title: "",
                      subtitle: "",
                    }),
                    image_url: url,
                  },
                })
              }
            />
          </div>
        </div>
      </section>

      {/* 7. Coupon Codes & Discounts */}
      <section className="border border-line bg-cream p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-line pb-3 gap-3">
          <div className="flex items-center gap-2.5">
            <Ticket className="h-5 w-5 text-accent" />
            <h2 className="font-serif text-xl font-bold text-ink">
              7. Coupon & Discount Engine
            </h2>
          </div>
        </div>

        <p className="text-xs text-muted">
          Customers can apply these active coupon codes directly on the checkout page to receive instant percentage discounts.
        </p>

        {/* Existing Coupons Table */}
        <div className="overflow-x-auto border border-line bg-white/50">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line bg-sand/40 text-[0.6875rem] font-bold uppercase tracking-wider text-muted">
                <th className="p-3">Coupon Code</th>
                <th className="p-3">Discount (%)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(settings.coupons || []).map((coupon) => (
                <tr key={coupon.code} className="hover:bg-cream/50 transition-colors">
                  <td className="p-3 font-mono font-bold tracking-wider text-accent text-sm">
                    {coupon.code}
                  </td>
                  <td className="p-3 font-semibold text-ink">
                    {coupon.discount_percent}% OFF
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleToggleCoupon(coupon.code)}
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[0.625rem] font-bold cursor-pointer transition-colors ${
                        coupon.is_active
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon.code)}
                      className="text-muted hover:text-accent p-1 cursor-pointer transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {(settings.coupons || []).length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted">
                    No active coupons found. Create a new coupon code below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add New Coupon Row */}
        <div className="border border-line bg-sand/30 p-4 rounded space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <Plus size={14} className="text-accent" />
            Add New Coupon Code
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-[0.6875rem] font-semibold uppercase tracking-wider text-muted mb-1">
                Coupon Code (e.g. YUME25, FESTIVE30)
              </label>
              <input
                type="text"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                placeholder="YUME25"
                className="w-full border border-line bg-white p-2.5 text-xs font-mono font-bold tracking-wider text-accent focus:border-accent focus:outline-none"
              />
            </div>
            <div className="w-full sm:w-40">
              <label className="block text-[0.6875rem] font-semibold uppercase tracking-wider text-muted mb-1">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={newCouponPercent}
                onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                className="w-full border border-line bg-white p-2.5 text-xs font-semibold text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleAddCoupon}
              className="btn btn-outline h-10 px-5 text-xs font-bold gap-1.5 shrink-0 w-full sm:w-auto cursor-pointer"
            >
              <Plus size={14} />
              Add Coupon
            </button>
          </div>
        </div>
      </section>

      {/* 8. Supabase Cloud Database Status (Clean & Minimalist) */}
      <section className="border border-line bg-cream p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-600" />
                Supabase Cloud Database: Connected & Active
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Project: <strong>Yumestore</strong> (<span className="font-mono text-accent">nwofgzpqtkmqriichjiq</span>) · Products and customer orders persist live in PostgreSQL.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={checkSupabaseStatus}
            disabled={testingDb}
            className="btn btn-outline h-9 px-4 text-xs font-bold gap-1.5 shrink-0 cursor-pointer"
          >
            {testingDb ? <RefreshCw size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Test Connection
          </button>
        </div>
      </section>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary h-14 px-10 gap-2.5 text-sm uppercase tracking-widest shadow-xl cursor-pointer font-bold"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save All Settings
        </button>
      </div>
    </form>
  );
}
