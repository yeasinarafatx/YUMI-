import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  focusable: false as const,
});

/**
 * 1. "Shop All" / All Jewelry:
 * Faceted 8-point brilliance star with micro-sparkles.
 */
export function SparkleAllIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      {/* Central 8-point brilliance star */}
      <path d="M12 2.5C12 7.2 15.8 11 20.5 11C15.8 11 12 14.8 12 19.5C12 14.8 8.2 11 3.5 11C8.2 11 12 7.2 12 2.5Z" fill="currentColor" fillOpacity={0.12} />
      {/* Corner secondary sparkle */}
      <path d="M19 16C19 17.7 20.3 19 22 19C20.3 19 19 20.3 19 22C19 20.3 17.7 19 16 19C17.7 19 19 17.7 19 16Z" fill="currentColor" fillOpacity={0.25} />
      {/* Top micro sparkle */}
      <circle cx="5" cy="5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * 2. "Earrings":
 * Elegant pair of hoop & drop pearl/crystal earrings.
 */
export function EarringPairIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      {/* Left Earring: Huggie hoop + drop pearl */}
      <path d="M8.5 4C6.5 4 5 5.5 5 7.5C5 9.5 6.5 11 8.5 11C9.6 11 10.6 10.5 11.2 9.7" />
      <path d="M8.5 11V13.5" />
      <path d="M8.5 13.5C7.2 14.8 6.5 16.5 6.5 18C6.5 19.4 7.4 20.5 8.5 20.5C9.6 20.5 10.5 19.4 10.5 18C10.5 16.5 9.8 14.8 8.5 13.5Z" fill="currentColor" fillOpacity={0.15} />
      
      {/* Right Earring: Matching drop */}
      <path d="M16 4C14.2 4 12.8 5.4 12.8 7.2C12.8 9 14.2 10.4 16 10.4C17 10.4 17.9 9.9 18.5 9.1" />
      <path d="M16 10.4V12.8" />
      <path d="M16 12.8C14.8 14 14.2 15.5 14.2 16.8C14.2 18 15 19 16 19C17 19 17.8 18 17.8 16.8C17.8 15.5 17.2 14 16 12.8Z" fill="currentColor" fillOpacity={0.15} />
    </svg>
  );
}

/**
 * 3. "Necklaces":
 * Draped fine chain necklace with brilliant cut pendant.
 */
export function PendantNecklaceIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      {/* Delicate draped chain curve */}
      <path d="M4 4.5C4.5 11.5 7.5 15.5 12 15.5C16.5 15.5 19.5 11.5 20 4.5" />
      {/* Bail ring */}
      <circle cx="12" cy="16.5" r="1.2" />
      {/* Faceted pear/drop solitaire pendant */}
      <path d="M12 17.7L9.5 20.5C9.5 22 10.6 23 12 23C13.4 23 14.5 22 14.5 20.5L12 17.7Z" fill="currentColor" fillOpacity={0.18} />
      {/* Internal gem facet line */}
      <path d="M12 17.7V22" strokeWidth={1} />
    </svg>
  );
}

/**
 * 4. "Rings":
 * Solitaire engagement ring with crown prongs and diamond facet.
 */
export function SolitaireRingIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      {/* Ring Band */}
      <ellipse cx="12" cy="14.5" rx="7.5" ry="6.5" />
      <ellipse cx="12" cy="14.5" rx="5.5" ry="4.8" fill="currentColor" fillOpacity={0.06} />
      {/* Prongs setting */}
      <path d="M9 8L10 6.5H14L15 8" />
      {/* Solitaire diamond top */}
      <path d="M10 6.5L12 2.5L14 6.5H10Z" fill="currentColor" fillOpacity={0.25} />
      <path d="M10 6.5L8.5 4L12 2.5L15.5 4L14 6.5" />
    </svg>
  );
}

/**
 * 5. "Bracelets":
 * Open luxury bangle cuff with jewel terminals.
 */
export function BangleBraceletIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      {/* Curved cuff bangle */}
      <path d="M8.5 5.2C5.5 6.8 3.5 10 3.5 13.8C3.5 18.8 7.3 22.5 12 22.5C16.7 22.5 20.5 18.8 20.5 13.8C20.5 10 18.5 6.8 15.5 5.2" />
      {/* Left terminal gemstone */}
      <circle cx="8.5" cy="5.2" r="2.2" fill="currentColor" fillOpacity={0.2} />
      <circle cx="8.5" cy="5.2" r="0.8" fill="currentColor" stroke="none" />
      {/* Right terminal gemstone */}
      <circle cx="15.5" cy="5.2" r="2.2" fill="currentColor" fillOpacity={0.2} />
      <circle cx="15.5" cy="5.2" r="0.8" fill="currentColor" stroke="none" />
      {/* Accent inner gleam */}
      <path d="M7 16C8 18 10 19.5 12 19.5" strokeWidth={1} strokeOpacity={0.6} />
    </svg>
  );
}

/**
 * Trust Badge 1: Cash on Delivery & 100% Safe Pay
 * Fine luxury shield with padlock & currency seal.
 */
export function TrustSecureShieldIcon({ size = 32, ...props }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 32 32" strokeWidth={1.4} {...props}>
      {/* Shield boundary */}
      <path
        d="M16 3L6 7V15C6 22 10.3 27.5 16 29C21.7 27.5 26 22 26 15V7L16 3Z"
        fill="currentColor"
        fillOpacity={0.08}
      />
      {/* Internal lock shackle */}
      <path d="M12.5 14V11.5C12.5 9.6 14.1 8 16 8C17.9 8 19.5 9.6 19.5 11.5V14" />
      {/* Lock body */}
      <rect x="11" y="14" width="10" height="8" rx="2" fill="currentColor" fillOpacity={0.2} />
      {/* Keyhole */}
      <circle cx="16" cy="17.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M16 18.5V20" strokeWidth={1.5} />
    </svg>
  );
}

/**
 * Trust Badge 2: Fast Nationwide Delivery
 * Express shipping van with speed route and check mark.
 */
export function TrustExpressVanIcon({ size = 32, ...props }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 32 32" strokeWidth={1.4} {...props}>
      {/* Speed lines */}
      <path d="M2 11H7" strokeWidth={1.4} />
      <path d="M3 15H8" strokeWidth={1.4} />
      <path d="M2 19H6" strokeWidth={1.4} />
      {/* Vehicle body */}
      <path
        d="M8 8H21V23H8V8Z"
        fill="currentColor"
        fillOpacity={0.08}
      />
      <path d="M21 12H26.5L29 16.5V23H21V12Z" fill="currentColor" fillOpacity={0.08} />
      {/* Cabin window */}
      <path d="M21 13H25.5L27.5 16.5H21V13Z" fill="currentColor" fillOpacity={0.18} />
      {/* Wheels */}
      <circle cx="12.5" cy="23.5" r="3" fill="#FAF6F0" />
      <circle cx="12.5" cy="23.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="24.5" cy="23.5" r="3" fill="#FAF6F0" />
      <circle cx="24.5" cy="23.5" r="1.2" fill="currentColor" stroke="none" />
      {/* Roof dispatch beacon */}
      <path d="M13 5L16 8" strokeWidth={1.2} />
    </svg>
  );
}

/**
/**
 * Trust Badge: Waterproof 18K Gold Stainless Steel
 * Brilliant faceted gemstone with water-repellent droplet.
 */
export function TrustWaterproofGemIcon({ size = 32, ...props }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 32 32" strokeWidth={1.4} {...props}>
      {/* Gem facet crown */}
      <path
        d="M6 10L11 4H21L26 10L16 28L6 10Z"
        fill="currentColor"
        fillOpacity={0.08}
      />
      <path d="M6 10H26" />
      <path d="M11 4L16 10L21 4" />
      <path d="M16 10V28" />
      <path d="M11 10L16 28L21 10" />
      {/* Waterproof droplet sparkle accent */}
      <circle cx="25" cy="5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Trust Badge: 3-Day Replacement Guarantee
 * Circular security guarantee shield with curved refresh arrows.
 */
export function TrustReplacementIcon({ size = 32, ...props }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 32 32" strokeWidth={1.4} {...props}>
      {/* Circular guarantee frame */}
      <circle cx="16" cy="16" r="13" strokeDasharray="3 2" strokeOpacity={0.4} />
      {/* Inner shield */}
      <path
        d="M16 6L8 10V17C8 22.5 11.5 25.5 16 27C20.5 25.5 24 22.5 24 17V10L16 6Z"
        fill="currentColor"
        fillOpacity={0.1}
      />
      {/* Refresh / Exchange loop */}
      <path d="M12.5 14.5A4.5 4.5 0 0 1 19.5 13M19.5 10.5V13H17" />
      <path d="M19.5 17.5A4.5 4.5 0 0 1 12.5 19M12.5 21.5V19H15" />
    </svg>
  );
}
