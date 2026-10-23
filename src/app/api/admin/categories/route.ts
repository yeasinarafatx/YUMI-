import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/data";
import { sampleCategories } from "@/lib/sample-data";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, image_url, sort_order, is_active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const calculatedSlug =
      slug?.trim() ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: calculatedSlug,
      image_url: image_url || "/images/sample/cat-earrings.jpg",
      sort_order: typeof sort_order === "number" ? sort_order : 10,
      is_active: is_active ?? true,
    };

    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: newCategory.name,
          slug: newCategory.slug,
          image_url: newCategory.image_url,
          sort_order: newCategory.sort_order,
          is_active: newCategory.is_active,
        })
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, category: data });
      }
    }

    // In-memory fallback
    sampleCategories.push(newCategory);
    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
