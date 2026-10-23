import { NextResponse } from "next/server";
import { getSupabaseServerClient, isServerSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isServerSupabaseConfigured) {
    return NextResponse.json({
      connected: false,
      configured: false,
      message: "Supabase keys are missing in .env.local",
      url: url || null,
      hasAnonKey: Boolean(anonKey),
      hasServiceKey: Boolean(serviceKey),
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({
      connected: false,
      configured: true,
      message: "Failed to initialize Supabase client",
    });
  }

  try {
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("id, name")
      .limit(5);

    if (catError) {
      return NextResponse.json({
        connected: false,
        configured: true,
        message: `Connected to Supabase, but tables are not created yet: ${catError.message}`,
        details: catError,
      });
    }

    const { count: productCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      connected: true,
      configured: true,
      message: "Supabase connected successfully!",
      categoriesFound: categories?.length ?? 0,
      productCount: productCount ?? 0,
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      configured: true,
      message: `Connection error: ${err.message}`,
    });
  }
}
