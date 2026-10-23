import { StoreShell } from "@/components/layout/store-shell";

export const instant = false;

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <StoreShell>{children}</StoreShell>;
}
