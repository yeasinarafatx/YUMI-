"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

export function LoginForm() {
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-login from query param or saved password
  useEffect(() => {
    const queryKey = params.get("key") || params.get("password") || params.get("pwd");
    const saved = localStorage.getItem("yume_admin_pw");

    const candidate = queryKey || saved;
    if (candidate) {
      setPassword(candidate);
      if (queryKey) {
        // Auto submit if URL parameter provided
        loginWith(candidate);
      }
    }
  }, [params]);

  const loginWith = async (pwd: string) => {
    if (!pwd || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      if (remember) {
        localStorage.setItem("yume_admin_pw", pwd);
      } else {
        localStorage.removeItem("yume_admin_pw");
      }
      const next = params.get("next");
      const target = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
      window.location.assign(target);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWith(password);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      {/* Hidden username lets phone/Mac password managers save & auto-fill the login */}
      <input
        type="text"
        name="username"
        autoComplete="username"
        defaultValue="yume-admin"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div>
        <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider text-ink">
          Admin Password
        </label>
        <div className="relative mt-1.5">
          <input
            id="admin-password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line bg-white/80 py-3 pl-4 pr-12 text-base text-ink focus:border-accent focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-muted hover:text-accent"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-muted hover:text-ink">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          <span>Remember on this phone / device</span>
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        id="admin-login-btn"
        className="btn btn-primary h-12 w-full gap-2 text-xs font-bold"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
