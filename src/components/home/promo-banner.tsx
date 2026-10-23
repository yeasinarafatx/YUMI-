"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, ArrowRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export interface PromoBannerProps {
  is_active?: boolean;
  title?: string;
  eyebrow?: string;
  discount_text?: string;
  discountText?: string;
  subtitle?: string;
  coupon_code?: string;
  couponCode?: string;
  cta_text?: string;
  ctaText?: string;
  cta_link?: string;
  ctaLink?: string;
}

export function PromoBanner(props: PromoBannerProps) {
  // If explicitly disabled or undefined in active flag, do not render
  if (props.is_active === false) {
    return null;
  }

  const title = props.title || "Exclusive Jewellery Collection";
  const eyebrow = props.eyebrow || "Limited Edition · Seasonal Special";
  const discountText = props.discount_text || props.discountText || "UP TO 30% OFF";
  const subtitle =
    props.subtitle ||
    "Premium waterproof & anti-tarnish stainless steel jewellery pieces (18K gold plated). Complimentary gift box packaging & Cash on Delivery.";
  const couponCode = props.coupon_code || props.couponCode || "YUME2026";
  const ctaText = props.cta_text || props.ctaText || "Explore Offers";
  const ctaLink = props.cta_link || props.ctaLink || "/shop";

  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast.success(`Coupon code ${couponCode} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-accent text-cream py-14 md:py-18 border-y border-white/10 isolate">
      {/* Background ambient gold & maroon glows */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-luxe relative">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold shadow-sm">
            <Sparkles size={14} className="animate-spin text-gold" style={{ animationDuration: "8s" }} />
            <span>{eyebrow}</span>
          </div>

          {/* Big Offer Headline */}
          <div className="space-y-1">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {title}
            </h2>
            <p className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-gold">
              {discountText}
            </p>
          </div>

          {/* Subtitle */}
          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-cream/90 font-light">
            {subtitle}
          </p>

          {/* Coupon Code Pill & Copy Button */}
          {couponCode && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <span className="text-xs uppercase tracking-wider text-cream/70">Coupon Code:</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="group flex items-center gap-2 rounded-full border border-gold/50 bg-black/30 px-4 py-1.5 text-xs font-bold tracking-widest text-gold transition-colors hover:border-gold hover:bg-black/50 active:scale-95 cursor-pointer"
                title="Click to copy coupon code"
              >
                <span>{couponCode}</span>
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="opacity-70 group-hover:opacity-100" />}
              </button>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              href={ctaLink}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-none bg-cream px-8 text-xs font-semibold uppercase tracking-[0.2em] text-accent transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-lg"
            >
              <span>{ctaText}</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href="https://wa.me/8801700000000?text=Hello%20YUME!%20I%20am%20interested%20in%20your%20Special%20Offers."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-none border border-cream/30 bg-white/5 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-cream transition-all hover:border-cream hover:bg-white/10 active:scale-95"
            >
              <span>Order via WhatsApp</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-5 text-[0.6875rem] font-medium uppercase tracking-widest text-cream/70 border-t border-white/10">
            <span>✓ Cash on Delivery (COD)</span>
            <span>✓ Nationwide Fast Delivery</span>
            <span>✓ 3-Day Easy Replacement</span>
          </div>
        </div>
      </div>
    </section>
  );
}
