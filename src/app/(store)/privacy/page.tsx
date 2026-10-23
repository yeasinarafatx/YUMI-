import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | YUME Jewellery",
  description: "Privacy policy and data protection at YUME Jewellery.",
};

export default function PrivacyPage() {
  return (
    <div className="container-luxe py-16 md:py-24 max-w-3xl">
      <div className="mb-10 text-center">
        <span className="eyebrow mb-2">Legal</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink">Privacy Policy</h1>
        <p className="mt-2 text-xs text-muted">Last updated: October 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-ink/85 border border-line bg-cream p-8 shadow-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink">1. Information We Collect</h2>
          <p>
            When you place an order on YUME Jewellery, we collect information required to fulfill your delivery: your full name, phone number, delivery address, and payment confirmation details (such as Transaction ID).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink">2. How We Use Your Information</h2>
          <p>
            Your information is strictly used for order processing, courier dispatch, customer care via WhatsApp or phone, and transaction verification. We never sell, rent, or trade your personal data to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-ink">3. Data Security</h2>
          <p>
            We implement modern encryption and secure server practices to safeguard your personal details and order records against unauthorized access.
          </p>
        </section>
      </div>
    </div>
  );
}
