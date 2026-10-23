import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About YUME — Our Story",
  description: "Learn about YUME Jewellery — thoughtful design, modern minimalism, and timeless craftsmanship in Bangladesh.",
};

export default function AboutPage() {
  return (
    <div className="container-luxe py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow mb-2">Our Heritage</span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink">
          <span className="italic text-accent">Yume</span> means &ldquo;Dream&rdquo;
        </h1>
        <p className="mt-4 font-serif text-xl italic text-muted">
          Dreamt in gold, made for you.
        </p>
      </div>

      <div className="mx-auto my-14 aspect-[16/9] max-w-4xl overflow-hidden bg-sand">
        <Image
          src="/images/sample/hero-banner.jpg"
          alt="YUME Jewellery craftsmanship"
          width={1200}
          height={675}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mx-auto max-w-2xl space-y-6 text-sm leading-relaxed text-ink/80">
        <p>
          Founded in Bangladesh, YUME Jewellery was born out of a desire for everyday elegance. We believe fine jewellery shouldn&apos;t just be kept away in vault boxes for rare grand occasions—it should be lived in, layered, and worn with quiet pride every single day.
        </p>
        <p>
          Each piece in our collection is crafted from 316L medical-grade stainless steel and coated with 18K real gold PVD plating. They are 100% waterproof, sweatproof, hypoallergenic, and anti-tarnish—made to never fade, whether you&apos;re showering, swimming, or caught in the monsoon rain.
        </p>
        <p>
          Whether you are treating yourself to an everyday signature or gifting a loved one something truly special, YUME pieces are packaged in luxury custom boxes, ready to create unforgettable memories.
        </p>

        <div className="mt-12 flex justify-center pt-8 border-t border-line">
          <Link href="/shop" className="btn btn-primary">
            Explore the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
