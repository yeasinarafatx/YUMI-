import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | YUME Jewellery",
  description: "Terms and conditions of service for YUME Jewellery.",
};

export default function TermsPage() {
  return (
    <div className="container-luxe py-16 md:py-24 max-w-3xl">
      <div className="mb-10 text-center">
        <span className="eyebrow mb-2">Legal</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink">Terms & Conditions</h1>
        <p className="mt-2 text-xs text-muted">Last updated: October 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-ink/85 border border-line bg-cream p-8 shadow-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink">1. Orders & Pricing</h2>
          <p>
            All prices are quoted in Bangladeshi Taka (BDT ৳) and are inclusive of standard local taxes. We reserve the right to correct any typographical pricing errors prior to dispatching your order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink">2. Payments & Order Confirmation</h2>
          <p>
            Orders placed with bKash or Nagad are considered confirmed once the transaction ID is verified. Cash on Delivery orders may be confirmed via a brief telephone verification before dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink">3. Product Craftsmanship & Colors</h2>
          <p>
            Because genuine freshwater pearls and artisanal gold plating have organic qualities, subtle variations in luster, shape, and tone are natural attributes that make each piece unique.
          </p>
        </section>
      </div>
    </div>
  );
}
