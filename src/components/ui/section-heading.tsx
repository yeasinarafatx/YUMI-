import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  link?: { label: string; href: string };
  className?: string;
  /** Use h1 only for the page's primary heading; sections default to h2. */
  as?: "h1" | "h2";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  link,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 md:mb-14",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-2.5", centered && "items-center")}>
        {eyebrow && <span className="eyebrow text-accent font-semibold tracking-widest">{eyebrow}</span>}
        <Tag className="font-serif font-bold text-[2.2rem] leading-[1.05] text-ink sm:text-[2.7rem] md:text-5xl">{title}</Tag>
        {description && (
          <p className={cn("max-w-xl text-[0.9375rem] leading-relaxed text-muted font-normal", centered && "mx-auto")}>
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className={cn(
            "link-underline shrink-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-accent",
            centered && "mt-1",
          )}
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
