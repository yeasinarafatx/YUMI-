"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { toWhatsAppNumber } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/brand-icons";

interface WhatsAppFloatProps {
  whatsappNumber?: string;
}

export function WhatsAppFloat({ whatsappNumber = "01700000000" }: WhatsAppFloatProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Show tooltip briefly after 3 seconds, or after user starts scrolling
    const timer = setTimeout(() => setShowTooltip(true), 3200);
    const onScroll = () => {
      if (!hasScrolled && window.scrollY > 150) {
        setHasScrolled(true);
        setShowTooltip(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasScrolled]);

  const cleanNum = toWhatsAppNumber(whatsappNumber || "01700000000");
  const waUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(
    "Hello YUME Jewellery! I am interested in your collection and would like to know more.",
  )}`;

  return (
    <aside aria-label="Customer Support" className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-5 lg:bottom-6 z-40 flex items-center gap-3">
      <AnimatePresence>
        {showTooltip && (
          <m.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="hidden items-center gap-2 rounded-full border border-line bg-cream px-4 py-2 shadow-lg sm:flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-ink">Chat on WhatsApp</span>
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="ml-1 text-muted hover:text-ink cursor-pointer"
              aria-label="Close tooltip"
            >
              ×
            </button>
          </m.div>
        )}
      </AnimatePresence>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with YUME Jewellery on WhatsApp"
        id="floating-whatsapp-btn"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 cursor-pointer"
      >
        <span
          className="absolute -inset-1 -z-10 animate-ping rounded-full bg-[#25D366] opacity-35"
          aria-hidden="true"
        />
        <WhatsAppIcon size={32} className="text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
      </a>
    </aside>
  );
}
