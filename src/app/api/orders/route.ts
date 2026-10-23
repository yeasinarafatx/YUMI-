import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/orders";

const OrderSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Please enter a valid 11-digit Bangladeshi phone number (e.g. 01712345678)"),
  email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  address: z.string().min(5, "Please enter your full delivery address"),
  district: z.string().min(2, "Please enter your district/area"),
  delivery_zone: z.enum(["inside_dhaka", "outside_dhaka"]),
  payment_method: z.enum(["bkash", "nagad", "cod"]),
  payment_number_used: z.string().optional().nullable(),
  transaction_id: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  coupon_code: z.string().optional().nullable(),
  honeypot: z.string().optional(), // spam prevention
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "Your cart cannot be empty"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Spam honeypot check
    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    const validated = OrderSchema.parse(body);

    // Conditional payment validation
    if (validated.payment_method === "bkash" || validated.payment_method === "nagad") {
      if (!validated.transaction_id || validated.transaction_id.trim().length < 4) {
        return NextResponse.json(
          { error: "Please enter your Transaction ID (TrxID)" },
          { status: 400 },
        );
      }
      if (!validated.payment_number_used || validated.payment_number_used.trim().length < 11) {
        return NextResponse.json(
          { error: "Please enter the sender phone number used for payment" },
          { status: 400 },
        );
      }
    }

    const order = await createOrder({
      customer_name: validated.customer_name,
      phone: validated.phone,
      email: validated.email,
      address: validated.address,
      district: validated.district,
      delivery_zone: validated.delivery_zone,
      payment_method: validated.payment_method,
      payment_number_used: validated.payment_number_used,
      transaction_id: validated.transaction_id,
      notes: validated.notes,
      coupon_code: validated.coupon_code,
      items: validated.items,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || "Validation failed" },
        { status: 400 },
      );
    }
    console.error("Order error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process order" },
      { status: 500 },
    );
  }
}
