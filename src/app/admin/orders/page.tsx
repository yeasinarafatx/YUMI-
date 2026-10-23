import { connection } from "next/server";
import { OrdersManager } from "@/components/admin/orders-manager";
import { getOrders } from "@/lib/orders";

export const metadata = {
  title: "Manage Orders | YUME Admin",
};

export const instant = false;

export default async function AdminOrdersPage() {
  await connection();
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-ink">Orders Management</h1>
        <p className="mt-1 text-xs text-muted">
          Review, confirm, and update shipping progress for your store orders.
        </p>
      </div>

      <OrdersManager initialOrders={orders} />
    </div>
  );
}
