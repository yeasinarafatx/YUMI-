/**
 * Re-mounts on every navigation → gives each page a subtle CSS fade/slide-in
 * (zero JS, automatically disabled for prefers-reduced-motion).
 */
export default function StoreTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
