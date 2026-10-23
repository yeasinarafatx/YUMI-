import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** "dark" = maroon on cream (header), "light" = cream on maroon (footer). */
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl";
  asLink?: boolean;
}

const sizes = {
  sm: { word: "text-[1.5rem]", sub: "text-[0.48rem]" },
  md: { word: "text-[2rem] md:text-[2.4rem]", sub: "text-[0.55rem] md:text-[0.62rem]" },
  lg: { word: "text-[2.8rem] md:text-[3.2rem]", sub: "text-[0.68rem] md:text-[0.75rem]" },
  xl: { word: "text-[3.6rem] md:text-[4.2rem]", sub: "text-[0.8rem] md:text-[0.9rem]" },
};

/**
 * YUME wordmark. Uses /public/logo.png with increased visibility.
 */
export function Logo({ className, tone = "dark", size = "md", asLink = true }: LogoProps) {
  const color = tone === "dark" ? "text-accent" : "text-cream";

  const mark = siteConfig.logo.useImage ? (
    <Image
      src={siteConfig.logo.src}
      alt={siteConfig.name}
      width={siteConfig.logo.width}
      height={siteConfig.logo.height}
      loading="eager"
      priority={false}
      className={cn(
        "w-auto object-contain transition-transform duration-300 hover:scale-[1.03]",
        tone === "light" && "brightness-0 invert sepia-[0.35] drop-shadow-sm",
        size === "sm" && "h-10 md:h-12",
        size === "md" && "h-14 md:h-18 lg:h-20",
        size === "lg" && "h-18 md:h-24 lg:h-28",
        size === "xl" && "h-24 md:h-32 lg:h-36",
      )}
    />
  ) : (
    <span className={cn("flex flex-col items-center leading-none", color)}>
      <span
        className={cn(
          "font-serif font-medium tracking-[0.28em] pl-[0.28em]",
          sizes[size].word,
        )}
      >
        YUME
      </span>
      <span
        className={cn(
          "mt-1 font-sans font-medium tracking-[0.55em] pl-[0.55em] opacity-80",
          sizes[size].sub,
        )}
      >
        JEWELLERY
      </span>
    </span>
  );

  if (!asLink) return <span className={className}>{mark}</span>;

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — Home`}
      className={cn("inline-flex items-center", className)}
    >
      {mark}
    </Link>
  );
}
