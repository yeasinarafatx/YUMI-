import { connection } from "next/server";
import { ProductsManager } from "@/components/admin/products-manager";
import { getAllProducts, getCategories } from "@/lib/data";

export const metadata = {
  title: "Products CMS | YUME Admin",
};

export const instant = false;

export default async function AdminProductsPage() {
  await connection();
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return <ProductsManager initialProducts={products} categories={categories} />;
}
