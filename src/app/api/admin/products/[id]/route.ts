import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  PRODUCT_SELECT,
  ProductPatchSchema,
  friendlyProductError,
  refreshStorefront,
} from "@/lib/admin-products";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
    }

    const parsed = ProductPatchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
    }
    const { image_url, ...fields } = parsed.data;

    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) update[k] = v;
    }
    if ("compare_at_price" in update) update.compare_at_price = update.compare_at_price || null;
    if ("category_id" in update) update.category_id = update.category_id || null;
    if (update.track_stock === false) update.stock_quantity = 0;

    if (Object.keys(update).length > 0) {
      const { error } = await supabase.from("products").update(update).eq("id", id);
      if (error) {
        return NextResponse.json({ error: friendlyProductError(error.message) }, { status: 400 });
      }
    }

    if (image_url) {
      const { data: existing } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", id)
        .order("sort_order", { ascending: true })
        .limit(1);
      if (existing && existing.length > 0) {
        await supabase.from("product_images").update({ url: image_url }).eq("id", existing[0].id);
      } else {
        await supabase.from("product_images").insert({
          id: `img-${Date.now()}`,
          product_id: id,
          url: image_url,
          sort_order: 0,
        });
      }
    }

    const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).single();
    refreshStorefront();
    return NextResponse.json({ success: true, product: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
    }
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    refreshStorefront();
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
