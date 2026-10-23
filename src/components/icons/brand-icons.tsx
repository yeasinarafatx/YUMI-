import type { SVGProps } from "react";

/**
 * Brand/social icons as inline SVGs.
 * Supports both official brand color variants and monochrome luxury currentColor variants.
 */
export type BrandIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  colored?: boolean;
};

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  "aria-hidden": true as const,
  focusable: false as const,
});

export function InstagramIcon({ size = 20, colored = false, className, ...props }: BrandIconProps) {
  if (colored) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className={className}
        {...props}
      >
        <defs>
          <radialGradient id="ig-rad-icon" cx="15%" cy="105%" r="115%">
            <stop offset="0%" stopColor="#FFDD55" />
            <stop offset="10%" stopColor="#FFDD55" />
            <stop offset="50%" stopColor="#FF543E" />
            <stop offset="100%" stopColor="#C837AB" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ig-lin-icon" x1="10%" y1="100%" x2="90%" y2="0%">
            <stop offset="0%" stopColor="#3771C8" />
            <stop offset="35%" stopColor="#60F" />
            <stop offset="65%" stopColor="#C837AB" />
            <stop offset="90%" stopColor="#FF543E" />
            <stop offset="100%" stopColor="#FFDD55" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="url(#ig-lin-icon)" />
        <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="url(#ig-rad-icon)" />
        <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="3.8" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.4" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
        <circle cx="16.2" cy="7.8" r="1.1" fill="#FFFFFF" />
      </svg>
    );
  }

  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth={1.5} className={className} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 20, colored = false, className, ...props }: BrandIconProps) {
  if (colored) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className={className}
        {...props}
      >
        <circle cx="12" cy="12" r="11" fill="#1877F2" />
        <path
          d="M16.5 12h-3v8.5h-3.8V12H8v-3.2h1.7V6.8c0-2 1.2-3.3 3.4-3.3 1 0 2.1.2 2.1.2v2.3h-1.2c-1 0-1.3.6-1.3 1.3v1.5h2.6l-.4 3.2z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  return (
    <svg {...base(size)} fill="currentColor" className={className} {...props}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 5 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 17.001 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 20, colored = false, className, ...props }: BrandIconProps) {
  if (colored) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className={className}
        {...props}
      >
        <circle cx="12" cy="12" r="11" fill="#25D366" />
        <path
          d="M12.04 4.5a7.5 7.5 0 0 0-6.4 11.4l-1.1 3.8 3.9-1a7.5 7.5 0 1 0 3.6-14.2Zm3.4 10.7c-.2.4-.9.7-1.3.8-.4 0-.8.1-2.4-.5a8.9 8.9 0 0 1-3.4-3 3.9 3.9 0 0 1-.8-2.1c0-1.1.6-1.7.8-1.9.2-.2.4-.3.6-.3h.4c.2 0 .3 0 .4.3.2.4.6 1.4.6 1.5.1.2 0 .4-.1.5l-.3.4c-.1.1-.2.3-.1.4.3.5.7 1 1.2 1.4.5.4 1 .7 1.5.9.2.1.3 0 .4-.1l.5-.6c.2-.2.3-.2.5-.1.2.1 1.1.5 1.3.6.2.1.3.2.3.3 0 .5-.2 1.1-.4 1.3Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  return (
    <svg {...base(size)} fill="currentColor" className={className} {...props}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.5 5 5.2-1.4A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7 3.9Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.2Z" />
    </svg>
  );
}

export function TikTokIcon({ size = 20, className, ...props }: BrandIconProps) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth={1.5} className={className} {...props}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" />
    </svg>
  );
}
