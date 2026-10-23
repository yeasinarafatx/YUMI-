"use client";

import { m, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  /** Vertical offset in px the element slides up from. */
  y?: number;
}

/**
 * Gentle fade + slide-up when the element scrolls into view (once).
 * Do NOT wrap above-the-fold/LCP content in this — use the CSS
 * `animate-fade-up` utility there so it paints without waiting for JS.
 */
export function Reveal({ children, delay = 0, y = 22, ...rest }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
