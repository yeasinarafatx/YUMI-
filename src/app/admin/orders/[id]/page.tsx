import { notFound } from "next/navigation";
import { connection } from "next/server";
import { OrderDetailView } from "@/components/admin/order-detail-view";
import { getOrderById } from "@/lib/orders";

export const instant = false;

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps) {
  const { id } = await params;
  return {
    title: `Order ${id} | YUME Admin`,
  };
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  await connection();
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailView initialOrder={order} />;
}
