import Image from "next/image";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons/brand-icons";
import { getSiteSettings } from "@/lib/data";
import { toWhatsAppNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with YUME Jewellery support team via WhatsApp, phone, or email.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const cleanNum = toWhatsAppNumber(settings.whatsapp_number || "01700000000");

  return (
    <div className="container-luxe py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow mb-2">We Are Here For You</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink">Get in Touch</h1>
        <p className="mt-3 text-sm text-muted">
          Have a question about a piece, custom sizing, or delivery? Reach out to our concierge team anytime.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 md:mt-14 md:gap-8 md:grid-cols-2">
        {/* Contact Info Card */}
        <div className="border border-line bg-cream p-8 shadow-sm space-y-6">
          <h2 className="font-serif text-2xl text-ink">Customer Support</h2>

          <ul className="space-y-4 text-sm text-ink/80">
            <li className="flex items-start gap-3">
              <Phone size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-ink">Phone Support</p>
                <p className="text-muted">+880 1711-223344</p>
                <p className="text-xs text-muted">Sat – Thu: 10:00 AM – 8:00 PM</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Mail size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-ink">Email Support</p>
                <p className="text-muted">concierge@yumejewellery.com</p>
                <p className="text-xs text-muted">Response within 24 hours</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-ink">Studio & Dispatch Hub</p>
                <p className="text-muted">Gulshan 2, Dhaka, Bangladesh</p>
              </div>
            </li>
          </ul>

          <div className="border-t border-line pt-6">
            <a
              href={`https://wa.me/${cleanNum}?text=Hello%20YUME%20Jewellery!`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 rounded bg-[#25D366] text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#20ba59]"
            >
              <Image src="/images/whatsapp.png" alt="WhatsApp" width={22} height={22} className="h-5 w-5 object-contain" />
              Instant WhatsApp Support
            </a>
          </div>

          {/* Social Links on Contact Page */}
          <div className="border-t border-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
              Official Social Channels
            </p>
            <div className="flex flex-col gap-2.5">
              {settings.social.instagram && (
                <a
                  href={settings.social.instagram || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded border border-line bg-white/60 p-3 text-xs font-semibold text-ink transition-all hover:bg-white hover:border-accent hover:text-accent shadow-xs"
                >
                  <InstagramIcon size={18} colored={false} />
                  <span>Instagram: @{settings.instagram_handle || "yume.jewellery"}</span>
                </a>
              )}
              {settings.social.facebook && (
                <a
                  href={settings.social.facebook || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded border border-line bg-white/60 p-3 text-xs font-semibold text-ink transition-all hover:bg-white hover:border-accent hover:text-accent shadow-xs"
                >
                  <FacebookIcon size={18} colored={false} />
                  <span>Facebook: YUME Jewellery</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="border border-line bg-cream p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-ink">Send a Message</h2>
          <form className="mt-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-ink">Your Name *</label>
              <input
                required
                type="text"
                placeholder="Full name"
                className="mt-1 w-full border border-line bg-cream p-2.5 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-ink">Phone or Email *</label>
              <input
                required
                type="text"
                placeholder="017XXXXXXXX or email"
                className="mt-1 w-full border border-line bg-cream p-2.5 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-ink">Message *</label>
              <textarea
                required
                rows={4}
                placeholder="How can we assist you?"
                className="mt-1 w-full border border-line bg-cream p-2.5 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full h-11 text-xs">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
