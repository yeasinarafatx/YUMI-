import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order with Cash on Delivery, bKash, or Nagad.",
};

export const instant = false;

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="mb-10 text-center">
        <span className="eyebrow mb-2">Secure Order</span>
        <h1 className="font-serif text-4xl text-ink">Checkout</h1>
        <p className="mt-2 text-sm text-muted">Complete your details below to place your order with YUME Jewellery.</p>
      </div>

      <CheckoutForm settings={settings} />
    </div>
  );
}
