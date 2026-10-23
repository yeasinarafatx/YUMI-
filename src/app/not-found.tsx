import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <span
        aria-hidden="true"
        className="pointer-events-none select-none font-serif text-[40vw] md:text-[22rem] font-bold leading-none text-accent/10 absolute -z-0"
      >
        404
      </span>
      <div className="relative z-10 max-w-md space-y-4">
        <p className="eyebrow text-accent font-semibold text-xs uppercase tracking-widest">Error 404</p>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ink">
          This piece has <span className="italic text-accent">slipped away</span>
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let us guide you back to something beautiful.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary h-11 px-6 text-xs uppercase font-bold tracking-wider" id="notfound-home">
            Back to Home
          </Link>
          <Link href="/shop" className="btn btn-outline h-11 px-6 text-xs uppercase font-bold tracking-wider bg-white/70" id="notfound-shop">
            Browse Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
