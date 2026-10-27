import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  PRODUCT_SELECT,
  ProductInputSchema,
  friendlyProductError,
  refreshStorefront,
  slugify,
} from "@/lib/admin-products";

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
    }

    const parsed = ProductInputSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid product" }, { status: 400 });
    }
    const p = parsed.data;

    const track = p.track_stock ?? false;
    const id = `p-${Date.now()}`;
    const { error } = await supabase.from("products").insert({
      id,
      name: p.name,
      slug: p.slug || slugify(p.name) || id,
      description: p.description ?? "",
      price: p.price,
      compare_at_price: p.compare_at_price || null,
      category_id: p.category_id || null,
      track_stock: track,
      stock_quantity: track ? (p.stock_quantity ?? 0) : 0,
      is_active: p.is_active ?? true,
      is_featured: p.is_featured ?? false,
    });
    if (error) {
      return NextResponse.json({ error: friendlyProductError(error.message) }, { status: 400 });
    }

    if (p.image_url) {
      await supabase.from("product_images").insert({
        id: `img-${Date.now()}`,
        product_id: id,
        url: p.image_url,
        alt: p.name,
        sort_order: 0,
      });
    }

    const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).single();
    refreshStorefront();
    return NextResponse.json({ success: true, product: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
