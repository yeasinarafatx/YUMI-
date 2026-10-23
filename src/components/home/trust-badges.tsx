import { Reveal } from "@/components/motion/reveal";
import {
  TrustWaterproofGemIcon,
  TrustExpressVanIcon,
  TrustReplacementIcon,
} from "@/components/icons/luxury-icons";

interface TrustBadgesProps {
  freeDeliveryThreshold?: number | null;
}

export function TrustBadges({}: TrustBadgesProps = {}) {
  const badges = [
    {
      Icon: TrustWaterproofGemIcon,
      title: "18K Gold Plated Stainless Steel",
      text: "Waterproof, sweatproof & anti-tarnish. Hypoallergenic fine jewellery crafted for everyday elegance.",
    },
    {
      Icon: TrustExpressVanIcon,
      title: "Nationwide Express Delivery",
      text: "Fast, reliable door-to-door courier dispatch across Dhaka and all 64 districts in Bangladesh.",
    },
    {
      Icon: TrustReplacementIcon,
      title: "3-Day Replacement Guarantee",
      text: "Hassle-free replacement within 3 days for any damaged, defective, or incorrect piece upon arrival.",
    },
  ];

  return (
    <section aria-label="Why shop with YUME" className="border-y border-line bg-cream">
      <ul className="container-luxe grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {badges.map(({ Icon, title, text }, i) => (
          <li key={title}>
            <Reveal delay={i * 0.08} className="flex items-start gap-5 py-8 md:flex-col md:items-center md:px-8 md:py-14 md:text-center">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sand/70 border border-accent/25 text-accent shadow-xs transition-transform duration-300 hover:scale-110">
                <Icon size={28} />
              </span>
              <div>
                <h3 className="font-serif text-[1.35rem] sm:text-[1.45rem] font-bold leading-tight text-ink">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted md:mx-auto">{text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
