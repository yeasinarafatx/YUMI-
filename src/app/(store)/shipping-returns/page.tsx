import type { Metadata } from "next";
import { Truck, RotateCcw, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Returns Policy",
  description: "Information regarding YUME Jewellery delivery timelines, charges, and hassle-free return policy across Bangladesh.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="container-luxe py-16 md:py-24 max-w-3xl">
      <div className="text-center mb-12">
        <span className="eyebrow mb-2">Our Promise</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink">Shipping & Returns</h1>
        <p className="mt-3 text-sm text-muted">
          Transparent, dependable delivery and easy exchanges across Bangladesh.
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-ink/85">
        {/* Shipping Section */}
        <section className="border border-line bg-cream p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-accent">
            <Truck size={24} />
            <h2 className="font-serif text-2xl font-bold text-ink">Delivery Times & Charges</h2>
          </div>
          <ul className="space-y-2.5 list-disc list-inside text-muted">
            <li>
              <strong className="text-ink font-semibold">Inside Dhaka:</strong> ৳70 delivery fee. Estimated arrival within <strong className="text-ink">24 to 48 hours</strong>.
            </li>
            <li>
              <strong className="text-ink font-semibold">Outside Dhaka:</strong> ৳130 delivery fee. Express courier delivery within <strong className="text-ink">2 to 3 business days</strong>.
            </li>
            <li>
              <strong className="text-ink font-semibold">Cash on Delivery:</strong> Available across all 64 districts in Bangladesh. Pay securely when your parcel arrives.
            </li>
            <li>
              <strong className="text-ink font-semibold">Secure Packaging:</strong> All items are securely packaged in protective presentation boxes to ensure safe transit.
            </li>
          </ul>
        </section>

        {/* Returns & Replacement Section */}
        <section className="border border-line bg-cream p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-accent">
            <RotateCcw size={24} />
            <h2 className="font-serif text-2xl font-bold text-ink">3-Day Replacement Guarantee</h2>
          </div>
          <p className="text-ink/90">
            We inspect each piece before dispatch to ensure immaculate quality. If your jewellery arrives damaged, broken, or defective, we provide an immediate free replacement.
          </p>
          <ul className="space-y-2 list-disc list-inside text-muted">
            <li>Notify us via WhatsApp or phone within <strong className="text-ink">3 days</strong> of receiving your delivery.</li>
            <li>Please share a clear photo or short video showing the damaged or defective item.</li>
            <li>Once verified, a fresh replacement piece will be dispatched promptly at no extra charge.</li>
          </ul>
        </section>

        {/* Payment Verification */}
        <section className="border border-line bg-cream p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-accent">
            <ShieldCheck size={24} />
            <h2 className="font-serif text-2xl text-ink">Payment Methods</h2>
          </div>
          <p>
            We accept verified payments through <strong>bKash</strong>, <strong>Nagad</strong>, and <strong>Cash on Delivery (COD)</strong> throughout Bangladesh.
          </p>
        </section>
      </div>
    </div>
  );
}
