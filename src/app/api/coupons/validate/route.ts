import { NextRequest, NextResponse } from "next/server";
import { getStoredSettings } from "@/lib/settings-storage";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal = 0 } = await req.json();

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { valid: false, message: "Please enter a coupon code." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const settings = await getStoredSettings();
    const coupons = settings.coupons || [];

    // Find coupon
    const matched = coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.is_active
    );

    // Also support promo_banner coupon code if active
    let discountPercent = matched?.discount_percent;
    if (!matched && settings.promo_banner?.coupon_code?.toUpperCase() === cleanCode) {
      discountPercent = 20; // fallback standard 20%
    }

    if (!discountPercent) {
      return NextResponse.json(
        { valid: false, message: `Coupon code "${cleanCode}" is invalid or expired.` },
        { status: 400 }
      );
    }

    const discountAmount = Math.round((subtotal * discountPercent) / 100);

    return NextResponse.json({
      valid: true,
      code: cleanCode,
      discount_percent: discountPercent,
      discount_amount: discountAmount,
      message: `Congratulations! ${discountPercent}% discount applied successfully!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, message: err.message || "Failed to validate coupon code." },
      { status: 500 }
    );
  }
}
