import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { IMAGE_PLACEHOLDER } from "@/lib/utils";

/** Brand story strip — DRAFT COPY for your review. */
export function BrandStory() {
  return (
    <section aria-labelledby="story-heading" className="bg-sand">
      <div className="container-luxe grid items-center gap-8 py-12 md:grid-cols-2 md:gap-16 md:py-28 lg:gap-24">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded shadow-sm">
            <Image
              src="/images/sample/brand-story.jpg"
              alt="A woman wearing layered fine gold necklaces and delicate rings in warm light"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={IMAGE_PLACEHOLDER}
              className="object-cover"
            />
          </div>
          {/* Offset hairline frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 -right-4 hidden h-full w-full border border-accent/25 md:block"
          />
        </Reveal>

        <Reveal delay={0.1} className="md:py-10">
          <p className="eyebrow mb-3 text-accent font-semibold tracking-widest text-xs">Our Story</p>
          <h2 id="story-heading" className="font-serif font-bold text-[2.2rem] leading-[1.05] text-ink sm:text-5xl lg:text-[3.6rem]">
            <span className="italic text-accent">Yume</span> means
            <br /> &ldquo;dream&rdquo;.
          </h2>
          <div className="mt-7 max-w-md space-y-4 text-[0.975rem] leading-relaxed text-ink/75">
            <p>
              YUME began with a simple dream: jewellery that feels as precious as the moments it marks — thoughtfully
              designed, beautifully finished, and made for the women of Bangladesh.
            </p>
            <p>
              Every piece is chosen for the way it catches the light and the way it makes you feel: quietly confident,
              effortlessly you.
            </p>
          </div>
          <div className="ornament my-8" aria-hidden="true">
            <svg width="8" height="8" viewBox="0 0 8 8" className="fill-current">
              <path d="M4 0 8 4 4 8 0 4Z" />
            </svg>
          </div>
          <Link href="/about" className="btn btn-outline" id="brand-story-cta">
            Discover our story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
