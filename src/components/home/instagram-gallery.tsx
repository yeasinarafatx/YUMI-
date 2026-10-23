import Image from "next/image";
import { InstagramIcon } from "@/components/icons/brand-icons";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { IMAGE_PLACEHOLDER } from "@/lib/utils";

interface InstagramGalleryProps {
  images: { url: string; alt: string }[];
  handle: string | null;
  profileUrl: string | null;
}

export function InstagramGallery({ images, handle, profileUrl }: InstagramGalleryProps) {
  if (images.length === 0) return null;
  const href = profileUrl ?? "#";

  return (
    <section aria-labelledby="gallery-heading" className="py-20 md:py-28">
      <div className="container-luxe">
        <Reveal>
          <SectionHeading
            eyebrow={handle ? `@${handle}` : "Instagram"}
            title="Worn by you"
            description="Tag us to be featured — we love seeing how you style your YUME pieces."
          />
        </Reveal>
      </div>

      <ul className="grid grid-cols-3 gap-1 md:grid-cols-6 md:gap-1.5">
        {images.map((img, i) => (
          <li key={img.url + i}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-sand"
              aria-label={`View on Instagram: ${img.alt}`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 17vw, 33vw"
                placeholder="blur"
                blurDataURL={IMAGE_PLACEHOLDER}
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-accent/0 text-cream opacity-0 transition-all duration-500 group-hover:bg-accent/45 group-hover:opacity-100"
              >
                <InstagramIcon size={26} />
              </span>
            </a>
          </li>
        ))}
      </ul>

      {profileUrl && (
        <div className="mt-10 flex justify-center">
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" id="instagram-follow-cta">
            <InstagramIcon size={16} />
            Follow us
          </a>
        </div>
      )}
    </section>
  );
}
