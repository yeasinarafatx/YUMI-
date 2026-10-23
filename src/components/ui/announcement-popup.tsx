"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { X, Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { AnnouncementPopupSettings } from "@/lib/settings-storage";

interface AnnouncementPopupProps {
  popup?: AnnouncementPopupSettings;
}

export function AnnouncementPopup({ popup }: AnnouncementPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!popup || !popup.is_active) return;

    // Check if dismissed for THIS specific poster version
    const versionKey = `yume_popup_seen_${(popup.title || "").slice(0, 20)}_${(popup.image_url || "").slice(-20)}`;
    const seen = sessionStorage.getItem(versionKey);
    if (!seen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  if (!popup || !popup.is_active) return null;

  const handleClose = () => {
    setIsOpen(false);
    const versionKey = `yume_popup_seen_${(popup.title || "").slice(0, 20)}_${(popup.image_url || "").slice(-20)}`;
    sessionStorage.setItem(versionKey, "true");
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`Coupon code ${code} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const ctaHref = popup.cta_href?.trim() || "/shop";
  const isExternal = ctaHref.startsWith("http://") || ctaHref.startsWith("https://");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <m.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-xl border border-line bg-cream shadow-2xl z-10 my-auto"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              aria-label="Close Announcement"
            >
              <X size={16} />
            </button>

            {/* Banner / Poster Image */}
            {popup.image_url && (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-sand border-b border-line/60">
                {isExternal ? (
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="block h-full w-full relative"
                  >
                    <Image
                      src={popup.image_url}
                      alt={popup.title || "Announcement Poster"}
                      fill
                      sizes="(max-width: 640px) 90vw, 450px"
                      className="object-cover"
                      priority
                    />
                  </a>
                ) : (
                  <Link href={ctaHref} onClick={handleClose} className="block h-full w-full relative">
                    <Image
                      src={popup.image_url}
                      alt={popup.title || "Announcement Poster"}
                      fill
                      sizes="(max-width: 640px) 90vw, 450px"
                      className="object-cover"
                      priority
                    />
                  </Link>
                )}
              </div>
            )}

            {/* Content Body */}
            <div className="p-6 text-center space-y-3.5">
              {popup.badge_text && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-widest text-accent">
                  <Sparkles size={11} className="text-gold" />
                  <span>{popup.badge_text}</span>
                </div>
              )}

              {popup.title && (
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink leading-tight">
                  {popup.title}
                </h2>
              )}

              {popup.subtitle && (
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-normal">
                  {popup.subtitle}
                </p>
              )}

              {/* Optional Coupon Pill */}
              {popup.coupon_code && (
                <div className="pt-1">
                  <span className="block text-[0.625rem] font-semibold uppercase tracking-wider text-muted mb-1.5">
                    Use Coupon Code At Checkout:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(popup.coupon_code!)}
                    className="group inline-flex items-center gap-2 rounded-full border-2 border-dashed border-accent bg-sand/80 px-4 py-1.5 text-xs font-mono font-bold tracking-widest text-accent transition-all hover:bg-sand active:scale-95 cursor-pointer"
                    title="Click to copy coupon code"
                  >
                    <span>{popup.coupon_code}</span>
                    {copied ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-sans font-bold text-[0.6875rem]">
                        <Check size={13} /> Copied!
                      </span>
                    ) : (
                      <Copy size={13} className="text-muted group-hover:text-accent" />
                    )}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                {isExternal ? (
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="btn btn-primary h-12 w-full gap-2 text-xs font-bold uppercase tracking-widest shadow-md"
                  >
                    {popup.cta_label || "Explore Collection"}
                    <ArrowRight size={14} />
                  </a>
                ) : (
                  <Link
                    href={ctaHref}
                    onClick={handleClose}
                    className="btn btn-primary h-12 w-full gap-2 text-xs font-bold uppercase tracking-widest shadow-md"
                  >
                    {popup.cta_label || "Explore Collection"}
                    <ArrowRight size={14} />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[0.6875rem] text-muted hover:text-ink font-medium tracking-wide cursor-pointer py-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
