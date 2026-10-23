import fs from "fs";
import path from "path";
import type { ProductWithRelations } from "@/types";
import { sampleProducts, sampleSettings } from "@/lib/sample-data";
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

export async function getOrders(): Promise<Order[]> {
  return ensureStore().sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = ensureStore();
  return orders.find((o) => o.id === id || o.order_number === id) ?? null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  adminNotes?: string,
): Promise<Order | null> {
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

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const orders = ensureStore();

  // Next order number
  const nextNum = orders.length + 1;
  const orderNumber = `YUME-${String(nextNum).padStart(4, "0")}`;
  const orderId = `ord-${Date.now()}`;

  // Recalculate totals server-side from product catalogue (never trust client prices)
  const productMap = new Map<string, ProductWithRelations>(sampleProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItems: OrderItem[] = [];

  for (const item of input.items) {
    const p = productMap.get(item.productId);
    if (!p) throw new Error(`Product not found: ${item.productId}`);

    const itemPrice = p.price;
    const itemSubtotal = itemPrice * item.quantity;
    subtotal += itemSubtotal;

    orderItems.push({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
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

  const newOrder: Order = {
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
    admin_notes: null,
    created_at: new Date().toISOString(),
    items: orderItems,
  };

  orders.unshift(newOrder);
  saveStore(orders);

  // Sync to Supabase in background if configured
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      await supabase.from("orders").insert({
        id: newOrder.id,
        order_number: newOrder.order_number,
        customer_name: newOrder.customer_name,
        phone: newOrder.phone,
        email: newOrder.email,
        address: newOrder.address,
        district: newOrder.district,
        delivery_zone: newOrder.delivery_zone,
        delivery_charge: newOrder.delivery_charge,
        subtotal: newOrder.subtotal,
        total: newOrder.total,
        payment_method: newOrder.payment_method,
        payment_number_used: newOrder.payment_number_used,
        transaction_id: newOrder.transaction_id,
        status: newOrder.status,
        notes: newOrder.notes,
        admin_notes: newOrder.admin_notes,
        created_at: newOrder.created_at,
      });

      if (newOrder.items.length > 0) {
        await supabase.from("order_items").insert(
          newOrder.items.map((item) => ({
            id: item.id,
            order_id: newOrder.id,
            product_id: item.product_id,
            product_name_snapshot: item.product_name_snapshot,
            price_snapshot: item.price_snapshot,
            quantity: item.quantity,
            image_snapshot: item.image_snapshot,
          }))
        );
      }
    }
  } catch (err) {
    console.error("Supabase order sync notice:", err);
  }

  return newOrder;
}
