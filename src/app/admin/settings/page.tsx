import { connection } from "next/server";
import { SettingsManager } from "@/components/admin/settings-manager";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "Store Settings | YUME Admin",
};

export const instant = false;

export default async function AdminSettingsPage() {
  await connection();
  const settings = await getSiteSettings();

  return <SettingsManager initialSettings={settings} />;
}
