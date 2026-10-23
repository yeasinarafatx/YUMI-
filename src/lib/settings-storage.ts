import fs from "fs";
import path from "path";
import type { SiteSettings } from "@/types";
import { sampleSettings } from "@/lib/sample-data";

const SETTINGS_FILE_PATH = path.join(process.cwd(), "src", "data", "site-settings.json");

export interface CouponItem {
  code: string;
  discount_percent: number;
  is_active: boolean;
}

export interface AnnouncementPopupSettings {
  is_active: boolean;
  badge_text?: string;
  title: string;
  subtitle: string;
  image_url: string;
  coupon_code?: string;
  cta_label?: string;
  cta_href?: string;
}

/**
 * Extended settings interface allowing dynamic banner, popup, ticker, and coupons
 */
export interface ExtendedSiteSettings extends SiteSettings {
  promo_banner?: {
    is_active: boolean;
    title: string;
    eyebrow: string;
    discount_text: string;
    subtitle: string;
    coupon_code: string;
    cta_text: string;
    cta_link: string;
  };
  marquee_ticker?: {
    is_active: boolean;
    primary_text: string;
    secondary_text: string;
    speed_seconds: number;
  };
  coupons?: CouponItem[];
  announcement_popup?: AnnouncementPopupSettings;
}

const defaultExtendedSettings: ExtendedSiteSettings = {
  ...sampleSettings,
  announcement_text: "Welcome to YUME Jewellery · Premium Waterproof Stainless Steel",
  promo_banner: {
    is_active: false,
    title: "Festive Season Exclusive Collection",
    eyebrow: "Special Offer",
    discount_text: "UP TO 30% OFF",
    subtitle: "Waterproof, anti-tarnish stainless steel pieces. 18K gold plated. Complimentary luxury gift box packaging & Cash on Delivery.",
    coupon_code: "YUME20",
    cta_text: "Explore Offers",
    cta_link: "/shop",
  },
  marquee_ticker: {
    is_active: false,
    primary_text: "",
    secondary_text: "",
    speed_seconds: 25,
  },
  coupons: [
    { code: "YUME10", discount_percent: 10, is_active: true },
    { code: "YUME20", discount_percent: 20, is_active: true },
    { code: "YUME30", discount_percent: 30, is_active: true },
    { code: "WELCOME15", discount_percent: 15, is_active: true },
  ],
  announcement_popup: {
    is_active: true,
    badge_text: "✨ EXCLUSIVE OFFER",
    title: "Waterproof Jewellery Special",
    subtitle: "Get flat 20% OFF on all 18K gold plated waterproof stainless steel pieces! Use coupon code below at checkout.",
    image_url: "/images/sample/cat-necklaces.jpg",
    coupon_code: "YUME20",
    cta_label: "Shop Special Offers",
    cta_href: "/shop",
  },
};

export async function getStoredSettings(): Promise<ExtendedSiteSettings> {
  try {
    if (!fs.existsSync(SETTINGS_FILE_PATH)) {
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(defaultExtendedSettings, null, 2), "utf8");
      return defaultExtendedSettings;
    }
    const data = fs.readFileSync(SETTINGS_FILE_PATH, "utf8");
    const parsed = JSON.parse(data);
    return { ...defaultExtendedSettings, ...parsed };
  } catch (error) {
    console.error("Error reading site settings:", error);
    return defaultExtendedSettings;
  }
}

export async function updateStoredSettings(
  updated: Partial<ExtendedSiteSettings>,
): Promise<ExtendedSiteSettings> {
  const current = await getStoredSettings();
  const merged: ExtendedSiteSettings = {
    ...current,
    ...updated,
    hero: {
      ...current.hero,
      ...(updated.hero || {}),
    },
    social: {
      ...current.social,
      ...(updated.social || {}),
    },
    features: {
      ...current.features,
      ...(updated.features || {}),
    },
    promo_banner: {
      ...(current.promo_banner || defaultExtendedSettings.promo_banner!),
      ...(updated.promo_banner || {}),
    },
    marquee_ticker: {
      ...(current.marquee_ticker || defaultExtendedSettings.marquee_ticker!),
      ...(updated.marquee_ticker || {}),
    },
    announcement_popup: {
      ...(current.announcement_popup || defaultExtendedSettings.announcement_popup!),
      ...(updated.announcement_popup || {}),
    },
    coupons: updated.coupons || current.coupons || defaultExtendedSettings.coupons!,
  };

  fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(merged, null, 2), "utf8");
  return merged;
}
