import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { Metadata } from "next";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { getOrderById } from "@/lib/orders";
import { getSiteSettings } from "@/lib/data";
import { formatBDT, toWhatsAppNumber } from "@/lib/utils";

export const instant = false;

interface OrderSuccessPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: OrderSuccessPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order Confirmed: ${orderNumber}`,
    robots: { index: false },
  };
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  await connection();
  const { orderNumber } = await params;
  const order = await getOrderById(orderNumber);

  if (!order) {
    notFound();
  }

  const settings = await getSiteSettings();
  const waNumber = toWhatsAppNumber(settings.whatsapp_number || "01700000000");

  // Format pre-filled WhatsApp message
  const itemsText = order.items
    .map((i) => `• ${i.product_name_snapshot} (x${i.quantity}) - ${formatBDT(i.price_snapshot * i.quantity)}`)
    .join("\n");

  const waMessage = `*NEW ORDER CONFIRMATION* ✨
Order Number: *${order.order_number}*

*Customer Details:*
• Name: ${order.customer_name}
• Phone: ${order.phone}
• Address: ${order.address}, ${order.district}

*Items Ordered:*
${itemsText}

• Subtotal: ${formatBDT(order.subtotal)}
• Delivery Fee: ${formatBDT(order.delivery_charge)}
• Total Payable: *${formatBDT(order.total)}*

*Payment Method:* ${order.payment_method.toUpperCase()}
${order.payment_number_used ? `• Sender Number: ${order.payment_number_used}` : ""}
${order.transaction_id ? `• TrxID: ${order.transaction_id}` : ""}

Please confirm my order!`;

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="mx-auto max-w-2xl border border-line bg-cream p-6 sm:p-12 shadow-sm">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
            <CheckCircle2 size={36} strokeWidth={1.5} />
          </div>
          <span className="eyebrow mt-4 block text-accent font-semibold">Order Received · Confirmation</span>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-ink font-bold">Thank You! Your Order is Confirmed ✨</h1>
          <p className="mt-2 text-sm font-medium text-muted">
            Order Reference: <strong className="text-accent font-mono text-base font-bold">{order.order_number}</strong>
          </p>
          <p className="mt-1 text-xs text-muted font-medium">
            Our concierge team will verify and dispatch your parcel shortly.
          </p>
        </div>

        {/* Prominent WhatsApp Confirmation Button */}
        <div className="mt-8 rounded-lg border-2 border-emerald-500/40 bg-emerald-500/5 p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
            1-Tap WhatsApp Fast-Track Confirmation
          </p>
          <p className="mt-1.5 text-xs text-muted leading-relaxed font-medium">
            Tap the button below to send your pre-filled receipt to our team for immediate order dispatch priority!
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="success-whatsapp-confirm-btn"
            className="mt-4 inline-flex h-13 w-full items-center justify-center gap-2.5 rounded bg-[#25D366] px-6 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#20ba59] hover:shadow-lg active:scale-95"
          >
            <Image src="/images/whatsapp.png" alt="WhatsApp" width={22} height={22} className="h-5 w-5 object-contain" />
            Confirm on WhatsApp
          </a>
        </div>

        {/* Order Details Summary */}
        <div className="mt-10 border-t border-line pt-8">
          <h2 className="font-serif text-xl font-bold text-ink">Ordered Jewellery</h2>
          <ul className="mt-4 divide-y divide-line/70">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-sand border border-line">
                  {item.image_snapshot && (
                    <Image
                      src={item.image_snapshot}
                      alt={item.product_name_snapshot}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm font-semibold text-ink truncate">
                    {item.product_name_snapshot}
                  </p>
                  <p className="text-xs font-medium text-muted">Quantity: {item.quantity}</p>
                </div>
                <span className="text-sm font-bold text-ink tabular-nums">
                  {formatBDT(item.price_snapshot * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2.5 border-t border-line pt-4 text-xs">
            <div className="flex justify-between">
              <dt className="text-muted font-medium">Subtotal</dt>
              <dd className="font-semibold text-ink">{formatBDT(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted font-medium">
                Delivery ({order.delivery_zone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"})
              </dt>
              <dd className="font-semibold text-ink">{formatBDT(order.delivery_charge)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 font-serif text-base font-bold text-ink">
              <dt>Total Payable</dt>
              <dd className="text-accent text-lg font-bold">{formatBDT(order.total)}</dd>
            </div>
          </dl>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="mt-8 rounded border border-line bg-sand/40 p-4 text-xs space-y-2">
          <h3 className="font-bold uppercase tracking-wider text-ink">Delivery Destination & Customer Info:</h3>
          <p className="text-ink font-medium">
            <strong>{order.customer_name}</strong> • {order.phone}
          </p>
          <p className="text-muted font-medium">{order.address}, {order.district}</p>
          <p className="pt-2 text-ink border-t border-line/60 font-medium">
            <strong>Payment Method:</strong> {order.payment_method.toUpperCase()}
            {order.payment_number_used && ` (Account: ${order.payment_number_used})`}
            {order.transaction_id && ` • (TrxID: ${order.transaction_id})`}
          </p>
        </div>

        {/* Continue Shopping CTA */}
        <div className="mt-8 flex justify-center">
          <Link href="/shop" className="btn btn-outline gap-2 font-semibold">
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
