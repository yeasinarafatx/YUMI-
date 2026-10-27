"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.assign("/admin-login");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      id="admin-logout-btn"
      className="flex h-9 items-center gap-1.5 rounded border border-line px-3 text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-60 cursor-pointer"
      aria-label="Log out"
    >
      <LogOut size={14} />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}
