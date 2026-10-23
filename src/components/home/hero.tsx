import Image from "next/image";
import Link from "next/link";
import type { HeroContent } from "@/types";
import { IMAGE_PLACEHOLDER } from "@/lib/utils";

/**
 * Home hero. Server-rendered with CSS-only entrance animations so the LCP
 * image + headline paint immediately (no JS needed).
 */
export function Hero({ hero }: { hero: HeroContent }) {
  const lines = hero.title.split("\n");

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[62svh] sm:min-h-[70svh] md:min-h-[82vh] items-center overflow-hidden bg-sand"
    >
      <Image
        src={hero.image_url}
        alt={hero.image_alt}
        fill
        preload
        fetchPriority="high"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={IMAGE_PLACEHOLDER}
        className="-z-10 animate-slow-zoom object-cover object-center"
      />

      {/* Gentle legibility veil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-sand/90 via-sand/40 to-transparent md:bg-gradient-to-r md:from-sand/90 md:via-sand/40 md:to-transparent"
      />

      <div className="container-luxe relative py-12 sm:py-16 md:py-24">
        <div className="max-w-xl">
          <p
            className="eyebrow mb-3 md:mb-5 flex animate-fade-up items-center gap-3 text-accent font-semibold tracking-widest text-xs"
            style={{ animationDelay: "120ms" }}
          >
            <span className="h-0.5 w-7 bg-accent" aria-hidden="true" />
            {hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="animate-fade-up font-serif font-bold text-[2.5rem] leading-[1.05] text-ink sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-sm"
            style={{ animationDelay: "220ms" }}
          >
            {lines.map((line, i) => (
              <span
                key={i}
                className={i === lines.length - 1 && lines.length > 1 ? "block italic text-accent font-serif" : "block"}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            className="mt-4 md:mt-6 max-w-md animate-fade-up text-sm sm:text-base leading-relaxed text-ink/85 font-medium"
            style={{ animationDelay: "340ms" }}
          >
            {hero.subtitle}
          </p>

          <div
            className="mt-7 md:mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "460ms" }}
          >
            <Link href={hero.primary_cta.href} className="btn btn-primary h-12 px-7 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-md" id="hero-primary-cta">
              {hero.primary_cta.label}
            </Link>
            {hero.secondary_cta && (
              <Link href={hero.secondary_cta.href} className="btn btn-outline h-12 px-7 text-xs sm:text-sm font-bold uppercase tracking-widest bg-white/50 backdrop-blur-sm" id="hero-secondary-cta">
                {hero.secondary_cta.label}
              </Link>
            )}
          </div>

          {/* Quick Hero Trust Badges */}
          <div
            className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-ink/80 animate-fade-up"
            style={{ animationDelay: "540ms" }}
          >
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Cash on Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Nationwide Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              3-Day Easy Replacement
            </span>
          </div>
        </div>
      </div>

      {/* Scroll hint (desktop) */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[0.625rem] font-bold uppercase tracking-[0.3em] text-ink/60">Scroll to Explore</span>
        <span className="block h-10 w-0.5 animate-scroll-hint bg-accent/50" />
      </div>
    </section>
  );
}
