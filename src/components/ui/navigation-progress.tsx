"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Instant top navigation progress bar.
 * Fires IMMEDIATELY upon any link tap/click so the user gets
 * 0ms instant feedback that their touch worked and the page is loading.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress whenever the route finishes transitioning
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept any internal link click for instant feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Only handle internal navigation
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("//") &&
        (!targetAttr || targetAttr === "_self") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // If clicking the current path, don't start loading bar
        const currentUrl = window.location.pathname + window.location.search;
        if (href === currentUrl) return;

        setLoading(true);
        setProgress(35);
        setTimeout(() => setProgress((p) => (p > 0 && p < 80 ? 75 : p)), 180);
        setTimeout(() => setProgress((p) => (p > 0 && p < 90 ? 88 : p)), 450);
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[9999] h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-accent via-gold to-accent shadow-[0_0_12px_rgba(176,141,87,0.85)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "150ms" : "300ms",
        }}
      />
    </div>
  );
}
