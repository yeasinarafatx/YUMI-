import fs from "fs";
import path from "path";
import type { ProductWithRelations } from "@/types";
import { sampleSettings } from "@/lib/sample-data";
import { getAllProducts } from "@/lib/data";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getStoredSettings } from "@/lib/settings-storage";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  price_snapshot: number;
  quantity: number;
  image_snapshot: string | null;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "bkash" | "nagad" | "cod";

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  district: string;
  delivery_zone: "inside_dhaka" | "outside_dhaka";
  delivery_charge: number;
  subtotal: number;
  discount_amount?: number;
  coupon_code?: string | null;
  total: number;
  payment_method: PaymentMethod;
  payment_number_used: string | null;
  transaction_id: string | null;
  status: OrderStatus;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  items: OrderItem[];
}

const ORDERS_FILE = path.join(process.cwd(), "scratch", "orders-store.json");

function ensureStore(): Order[] {
  try {
    const dir = path.dirname(ORDERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(ORDERS_FILE)) {
      // Seed with 2 sample orders for admin demo
      const initial: Order[] = [
        {
          id: "ord-001",
          order_number: "YUME-0001",
          customer_name: "Tasnim Rahman",
          phone: "01712345678",
          email: "tasnim@example.com",
          address: "House 42, Road 11, Banani",
          district: "Dhaka",
          delivery_zone: "inside_dhaka",
          delivery_charge: 70,
          subtotal: 2250,
          total: 2320,
          payment_method: "bkash",
          payment_number_used: "01712345678",
          transaction_id: "9K48FL72P",
          status: "pending",
          notes: "Please deliver after 4 PM",
          admin_notes: "Call before dispatch",
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          items: [
            {
              id: "item-001",
              order_id: "ord-001",
              product_id: "p-02",
              product_name_snapshot: "Garnet Heart Pendant",
              price_snapshot: 2250,
              quantity: 1,
              image_snapshot: "/images/sample/cat-necklaces.jpg",
            },
          ],
        },
        {
          id: "ord-002",
          order_number: "YUME-0002",
          customer_name: "Nusrat Jahan",
          phone: "01898765432",
          email: null,
          address: "GEC Circle, Nasirabad",
          district: "Chattogram",
          delivery_zone: "outside_dhaka",
          delivery_charge: 130,
          subtotal: 3300,
          total: 3300, // free shipping over 3000
          payment_method: "cod",
          payment_number_used: null,
          transaction_id: null,
          status: "confirmed",
          notes: null,
          admin_notes: null,
          created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
          items: [
            {
              id: "item-002",
              order_id: "ord-002",
              product_id: "p-01",
              product_name_snapshot: "Pearl Cascade Earrings",
              price_snapshot: 1450,
              quantity: 1,
              image_snapshot: "/images/sample/cat-earrings.jpg",
            },
            {
              id: "item-003",
              order_id: "ord-002",
              product_id: "p-06",
              product_name_snapshot: "Mini Pearl Jhumka",
              price_snapshot: 1850,
              quantity: 1,
              image_snapshot: "/images/sample/prod-jhumka.jpg",
            },
          ],
        },
      ];
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading orders:", err);
    return [];
  }
}

function saveStore(orders: Order[]) {
  try {
    const dir = path.dirname(ORDERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error("Error writing orders:", err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase mapping helpers
// ─────────────────────────────────────────────────────────────────────────────

interface DbOrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  price_snapshot: number | string;
  quantity: number;
  image_snapshot: string | null;
}

interface DbOrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  district: string;
  delivery_zone: string;
  delivery_charge: number | string;
  subtotal: number | string;
  total: number | string;
  payment_method: string;
  payment_number_used: string | null;
  transaction_id: string | null;
  status: string;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  order_items?: DbOrderItemRow[];
}

function rowToOrder(r: DbOrderRow): Order {
  const subtotal = Number(r.subtotal);
  const deliveryCharge = Number(r.delivery_charge);
  const total = Number(r.total);
  // The orders table has no discount columns: derive the discount from the totals
  // and read the coupon code from the note we write at checkout ("Coupon CODE applied").
  const discount = Math.max(0, Math.round(subtotal + deliveryCharge - total));
  const couponMatch = r.admin_notes?.match(/Coupon\s+([A-Z0-9_-]+)\s+applied/i);

  return {
    id: r.id,
    order_number: r.order_number,
    customer_name: r.customer_name,
    phone: r.phone,
    email: r.email,
    address: r.address,
    district: r.district,
    delivery_zone: r.delivery_zone === "outside_dhaka" ? "outside_dhaka" : "inside_dhaka",
    delivery_charge: deliveryCharge,
    subtotal,
    discount_amount: discount,
    coupon_code: couponMatch ? couponMatch[1].toUpperCase() : null,
    total,
    payment_method: (r.payment_method as PaymentMethod) ?? "cod",
    payment_number_used: r.payment_number_used,
    transaction_id: r.transaction_id,
    status: (r.status as OrderStatus) ?? "pending",
    notes: r.notes,
    admin_notes: r.admin_notes,
    created_at: r.created_at,
    items: (r.order_items ?? []).map((i) => ({
      id: i.id,
      order_id: i.order_id,
      product_id: i.product_id,
      product_name_snapshot: i.product_name_snapshot,
      price_snapshot: Number(i.price_snapshot),
      quantity: i.quantity,
      image_snapshot: i.image_snapshot,
    })),
  };
}

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

/** Adds (+1) or removes (-1) the ordered quantities from tracked-stock products. */
async function adjustStock(items: OrderItem[], direction: 1 | -1) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  for (const item of items) {
    const { data: product } = await supabase
      .from("products")
      .select("id, track_stock, stock_quantity")
      .eq("id", item.product_id)
      .maybeSingle();
    if (!product || !product.track_stock) continue;
    const next = Math.max(0, Number(product.stock_quantity ?? 0) + direction * item.quantity);
    await supabase.from("products").update({ stock_quantity: next }).eq("id", product.id);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reads / updates
// ─────────────────────────────────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (!error && data) return (data as DbOrderRow[]).map(rowToOrder);
    console.error("Supabase getOrders failed:", error?.message);
  }
  return ensureStore().sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    for (const column of ["id", "order_number"] as const) {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq(column, id)
        .maybeSingle();
      if (data) return rowToOrder(data as DbOrderRow);
    }
    return null;
  }
  const orders = ensureStore();
  return orders.find((o) => o.id === id || o.order_number === id) ?? null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  adminNotes?: string,
): Promise<Order | null> {
  if (!VALID_STATUSES.includes(status)) throw new Error("Invalid order status");

  const supabase = getSupabaseServerClient();
  if (supabase) {
    const existing = await getOrderById(id);
    if (!existing) return null;

    const update: Record<string, unknown> = { status };
    if (adminNotes !== undefined) update.admin_notes = adminNotes;
    const { error } = await supabase.from("orders").update(update).eq("id", existing.id);
    if (error) throw new Error(error.message);

    // Keep inventory honest: cancelling returns stock, reviving an order takes it again.
    if (status === "cancelled" && existing.status !== "cancelled") {
      await adjustStock(existing.items, 1);
    } else if (status !== "cancelled" && existing.status === "cancelled") {
      await adjustStock(existing.items, -1);
    }

    return getOrderById(existing.id);
  }

  const orders = ensureStore();
  const index = orders.findIndex((o) => o.id === id || o.order_number === id);
  if (index === -1) return null;

  orders[index].status = status;
  if (adminNotes !== undefined) {
    orders[index].admin_notes = adminNotes;
  }
  saveStore(orders);
  return orders[index];
}

export interface CreateOrderInput {
  customer_name: string;
  phone: string;
  email?: string | null;
  address: string;
  district: string;
  delivery_zone: "inside_dhaka" | "outside_dhaka";
  payment_method: PaymentMethod;
  payment_number_used?: string | null;
  transaction_id?: string | null;
  notes?: string | null;
  coupon_code?: string | null;
  items: { productId: string; quantity: number }[];
}

/** Next sequential order number (YUME-0005 …) based on what is really in the database. */
async function nextOrderNumber(): Promise<string> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase.from("orders").select("order_number");
    const max = (data ?? []).reduce((acc, row) => {
      const n = parseInt(String(row.order_number).replace(/\D/g, ""), 10);
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
    return `YUME-${String(max + 1).padStart(4, "0")}`;
  }
  return `YUME-${String(ensureStore().length + 1).padStart(4, "0")}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const supabase = getSupabaseServerClient();
  const orderId = `ord-${Date.now()}`;

  // Recalculate totals server-side from the live catalogue (never trust client prices)
  const catalogue = await getAllProducts();
  const productMap = new Map<string, ProductWithRelations>(catalogue.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItems: OrderItem[] = [];

  for (const item of input.items) {
    const p = productMap.get(item.productId);
    if (!p) throw new Error("One of the items in your cart is no longer available. Please refresh your cart.");

    // Stock enforcement for tracked products
    if (p.track_stock) {
      const available = p.stock_quantity ?? 0;
      if (available <= 0) throw new Error(`Sorry, "${p.name}" is sold out.`);
      if (item.quantity > available) {
        throw new Error(`Only ${available} of "${p.name}" left in stock. Please reduce the quantity.`);
      }
    }

    const itemPrice = p.price;
    subtotal += itemPrice * item.quantity;

    orderItems.push({
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      order_id: orderId,
      product_id: p.id,
      product_name_snapshot: p.name,
      price_snapshot: itemPrice,
      quantity: item.quantity,
      image_snapshot: p.images[0]?.url ?? null,
    });
  }

  // Calculate delivery charge
  const threshold = sampleSettings.free_delivery_threshold ?? 3000;
  let deliveryCharge =
    input.delivery_zone === "inside_dhaka"
      ? sampleSettings.delivery_inside_dhaka
      : sampleSettings.delivery_outside_dhaka;

  if (threshold && subtotal >= threshold) {
    deliveryCharge = 0;
  }

  // Coupon discount calculation
  let discountAmount = 0;
  let appliedCoupon: string | null = null;
  if (input.coupon_code && input.coupon_code.trim()) {
    const clean = input.coupon_code.trim().toUpperCase();
    try {
      const stored = await getStoredSettings();
      const match = (stored.coupons || []).find((c) => c.code.toUpperCase() === clean && c.is_active);
      if (match) {
        discountAmount = Math.round((subtotal * match.discount_percent) / 100);
        appliedCoupon = clean;
      } else if (stored.promo_banner?.coupon_code?.toUpperCase() === clean) {
        discountAmount = Math.round((subtotal * 20) / 100);
        appliedCoupon = clean;
      }
    } catch {
      // fallback
    }
  }

  const total = Math.max(0, subtotal - discountAmount) + deliveryCharge;
  const couponNote = appliedCoupon ? `Coupon ${appliedCoupon} applied (-${discountAmount} BDT)` : null;

  const buildOrder = (orderNumber: string): Order => ({
    id: orderId,
    order_number: orderNumber,
    customer_name: input.customer_name.trim(),
    phone: input.phone.trim(),
    email: input.email ? input.email.trim() : null,
    address: input.address.trim(),
    district: input.district.trim(),
    delivery_zone: input.delivery_zone,
    delivery_charge: deliveryCharge,
    subtotal,
    discount_amount: discountAmount,
    coupon_code: appliedCoupon,
    total,
    payment_method: input.payment_method,
    payment_number_used: input.payment_number_used ? input.payment_number_used.trim() : null,
    transaction_id: input.transaction_id ? input.transaction_id.trim() : null,
    status: "pending",
    notes: input.notes ? input.notes.trim() : null,
    admin_notes: couponNote,
    created_at: new Date().toISOString(),
    items: orderItems,
  });

  // ── Production path: Supabase is the single source of truth ──
  if (supabase) {
    let saved: Order | null = null;
    let lastError = "";

    // Retry a couple of times in case two customers grab the same order number.
    for (let attempt = 0; attempt < 4 && !saved; attempt++) {
      const order = buildOrder(await nextOrderNumber());
      const { error } = await supabase.from("orders").insert({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        phone: order.phone,
        email: order.email,
        address: order.address,
        district: order.district,
        delivery_zone: order.delivery_zone,
        delivery_charge: order.delivery_charge,
        subtotal: order.subtotal,
        total: order.total,
        payment_method: order.payment_method,
        payment_number_used: order.payment_number_used,
        transaction_id: order.transaction_id,
        status: order.status,
        notes: order.notes,
        admin_notes: order.admin_notes,
        created_at: order.created_at,
      });
      if (!error) {
        saved = order;
      } else {
        lastError = error.message;
        if (error.code !== "23505") break; // not an order-number clash: don't retry
      }
    }

    if (!saved) {
      console.error("Order insert failed:", lastError);
      throw new Error("We could not save your order right now. Please try again or order on WhatsApp.");
    }

    if (saved.items.length > 0) {
      const { error: itemsError } = await supabase.from("order_items").insert(
        saved.items.map((item) => ({
          id: item.id,
          order_id: saved.id,
          product_id: item.product_id,
          product_name_snapshot: item.product_name_snapshot,
          price_snapshot: item.price_snapshot,
          quantity: item.quantity,
          image_snapshot: item.image_snapshot,
        })),
      );
      if (itemsError) {
        // Don't leave a headless order behind.
        await supabase.from("orders").delete().eq("id", saved.id);
        console.error("Order items insert failed:", itemsError.message);
        throw new Error("We could not save your order right now. Please try again or order on WhatsApp.");
      }
    }

    // Reduce stock for tracked products
    await adjustStock(saved.items, -1);
    return saved;
  }

  // ── Local development fallback (no Supabase configured) ──
  const orders = ensureStore();
  const newOrder = buildOrder(await nextOrderNumber());
  orders.unshift(newOrder);
  saveStore(orders);
  return newOrder;
}
