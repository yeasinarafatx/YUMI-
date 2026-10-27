"use client";

import { Suspense, type ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { Toaster } from "sonner";
import { NavigationProgress } from "@/components/ui/navigation-progress";

/**
 * Global client providers.
 * - LazyMotion keeps the Framer Motion bundle small (only DOM animation features).
 * - MotionConfig reducedMotion="user" honours the OS "reduce motion" setting.
 * - Toaster provides luxury feedback notifications for cart additions.
 * - NavigationProgress gives 0ms immediate touch and route progress feedback.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#F6EFE2",
              border: "1px solid rgba(42, 10, 14, 0.18)",
              color: "#2A0A0E",
              borderRadius: "0px",
            },
          }}
        />
      </MotionConfig>
    </LazyMotion>
  );
}
