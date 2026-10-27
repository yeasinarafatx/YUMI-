import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login | YUME",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-sand/40 px-4 py-10">
      <div className="w-full max-w-sm border border-line bg-cream p-6 shadow-xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <Logo size="md" asLink={false} />
          <span className="mt-4 inline-flex items-center gap-1.5 rounded bg-accent px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider text-cream">
            <ShieldCheck size={12} /> Admin CMS
          </span>
          <h1 className="mt-4 font-serif text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-xs text-muted">Sign in to manage orders, products and stock.</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
