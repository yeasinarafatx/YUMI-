"use client";

import Image from "next/image";
import { useState } from "react";
import { cn, IMAGE_PLACEHOLDER } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const activeImage = images[selectedIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  if (!activeImage) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
        <div className="flex h-full items-center justify-center text-muted">No Image Available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails (desktop vertical rail, mobile horizontal rail) */}
      {images.length > 1 && (
        <div className="no-scrollbar flex shrink-0 gap-3 overflow-x-auto md:w-20 md:flex-col md:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative aspect-square w-16 shrink-0 overflow-hidden border-2 transition-all md:w-20",
                selectedIndex === i
                  ? "border-accent shadow-md scale-102"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={`${title} - view ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image with Interactive Zoom */}
      <div
        className="group relative aspect-[4/5] flex-1 cursor-crosshair overflow-hidden bg-sand"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.alt || title}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={IMAGE_PLACEHOLDER}
          className={cn(
            "object-cover transition-transform duration-300 ease-out",
            isZoomed && "scale-[1.8] pointer-events-none",
          )}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />

        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-cream/80 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-widest text-ink/70 backdrop-blur sm:block">
          {isZoomed ? "Zoom active" : "Hover to zoom"}
        </div>
      </div>
    </div>
  );
}
