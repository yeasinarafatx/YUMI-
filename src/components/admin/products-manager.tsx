"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Plus,
  Minus,
  Edit2,
  Trash2,
  X,
  Eye,
  EyeOff,
  Search,
  Loader2,
  Package,
  AlertTriangle,
  PackageX,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatBDT } from "@/lib/utils";
import type { Category, ProductWithRelations } from "@/types";
import { ImageDropzone } from "@/components/admin/image-dropzone";

const LOW_STOCK_LIMIT = 5;

interface ProductsManagerProps {
  initialProducts: ProductWithRelations[];
  categories: Category[];
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  trackStock: boolean;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl: string;
}

const emptyForm = (categoryId: string): FormState => ({
  name: "",
  slug: "",
  description: "",
  price: 1200,
  compareAtPrice: null,
  categoryId,
  trackStock: true,
  stockQuantity: 10,
  isActive: true,
  isFeatured: false,
  imageUrl: "/images/sample/cat-earrings.jpg",
});

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function callApi<T>(url: string, method: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      window.location.assign("/admin-login");
      return { ok: false, error: "Session expired. Please sign in again." };
    }
    if (!res.ok) return { ok: false, error: data.error || "Something went wrong" };
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

/** Stock −/+ control. Saves on every tap, or when you type a number and leave the field. */
function StockStepper({
  value,
  busy,
  onCommit,
}: {
  value: number;
  busy: boolean;
  onCommit: (next: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));

  const commitDraft = () => {
    const n = Math.floor(Number(draft));
    if (!Number.isFinite(n) || n < 0) {
      setDraft(String(value));
      return;
    }
    if (n !== value) onCommit(n);
  };

  const step = (delta: number) => {
    const next = Math.max(0, value + delta);
    if (next === value) return;
    setDraft(String(next));
    onCommit(next);
  };

  return (
    <div className="inline-flex h-10 items-stretch border border-line bg-white/80">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={busy || value <= 0}
        aria-label="Decrease stock"
        className="flex w-10 items-center justify-center text-ink hover:text-accent disabled:opacity-30 cursor-pointer active:scale-90"
      >
        <Minus size={15} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={draft}
        disabled={busy}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        aria-label="Stock quantity"
        className="w-14 border-x border-line bg-transparent text-center text-sm font-bold tabular-nums text-ink focus:bg-white focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => step(1)}
        disabled={busy}
        aria-label="Increase stock"
        className="flex w-10 items-center justify-center text-ink hover:text-accent disabled:opacity-30 cursor-pointer active:scale-90"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

export function ProductsManager({ initialProducts, categories }: ProductsManagerProps) {
  const [products, setProducts] = useState<ProductWithRelations[]>(initialProducts);
  const [allCategories, setAllCategories] = useState<Category[]>(categories);
  const [editingProduct, setEditingProduct] = useState<ProductWithRelations | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  // List filters
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out" | "hidden">("all");

  // Category modal
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState("/images/sample/cat-earrings.jpg");
  const [isSavingCat, setIsSavingCat] = useState(false);

  // Product form
  const [form, setForm] = useState<FormState>(emptyForm(categories[0]?.id || ""));
  const patchForm = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const modalOpen = isCreating || editingProduct !== null;

  const closeModal = () => {
    setEditingProduct(null);
    setIsCreating(false);
  };

  const setBusy = (id: string, on: boolean) =>
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const replaceProduct = (updated: ProductWithRelations) =>
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  // ── Stats ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const tracked = products.filter((p) => p.track_stock);
    return {
      total: products.length,
      active: products.filter((p) => p.is_active).length,
      low: tracked.filter((p) => (p.stock_quantity ?? 0) > 0 && (p.stock_quantity ?? 0) <= LOW_STOCK_LIMIT).length,
      out: tracked.filter((p) => (p.stock_quantity ?? 0) <= 0).length,
    };
  }, [products]);

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const qty = p.stock_quantity ?? 0;
      if (filter === "low" && !(p.track_stock && qty > 0 && qty <= LOW_STOCK_LIMIT)) return false;
      if (filter === "out" && !(p.track_stock && qty <= 0)) return false;
      if (filter === "hidden" && p.is_active) return false;
      if (q && !`${p.name} ${p.category?.name ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, filter]);

  // ── Category ──────────────────────────────────────────────────
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    setIsSavingCat(true);
    const result = await callApi<{ category: Category }>("/api/admin/categories", "POST", {
      name: newCatName.trim(),
      image_url: newCatImage,
    });
    setIsSavingCat(false);
    if (result.ok && result.data.category) {
      const cat = result.data.category;
      setAllCategories((prev) => [...prev, cat]);
      patchForm({ categoryId: cat.id });
      setShowNewCatModal(false);
      setNewCatName("");
      toast.success(`Category "${cat.name}" created successfully!`);
    } else if (!result.ok) {
      toast.error(result.error);
    }
  };

  // ── Product form open ─────────────────────────────────────────
  const openEdit = (p: ProductWithRelations) => {
    setEditingProduct(p);
    setIsCreating(false);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compare_at_price,
      categoryId: p.category_id || allCategories[0]?.id || "",
      trackStock: p.track_stock,
      stockQuantity: p.stock_quantity ?? 0,
      isActive: p.is_active,
      isFeatured: p.is_featured,
      imageUrl: p.images[0]?.url || "",
    });
  };

  const openNew = () => {
    setEditingProduct(null);
    setIsCreating(true);
    setForm(emptyForm(allCategories[0]?.id || ""));
  };

  // ── Save product (create / update) ────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (form.trackStock && form.stockQuantity < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description,
      price: form.price,
      compare_at_price: form.compareAtPrice || null,
      category_id: form.categoryId || null,
      track_stock: form.trackStock,
      stock_quantity: form.trackStock ? Math.floor(form.stockQuantity) : 0,
      is_active: form.isActive,
      is_featured: form.isFeatured,
      image_url: form.imageUrl || undefined,
    };

    setSaving(true);
    const result = isCreating
      ? await callApi<{ product: ProductWithRelations }>("/api/admin/products", "POST", payload)
      : await callApi<{ product: ProductWithRelations }>(`/api/admin/products/${editingProduct!.id}`, "PATCH", payload);
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    const saved = result.data.product;
    if (isCreating) {
      setProducts((prev) => [saved, ...prev]);
      toast.success("New product added!");
    } else {
      replaceProduct(saved);
      toast.success("Product updated!");
    }
    closeModal();
  };

  // ── Quick actions from the list ───────────────────────────────
  const updateStock = async (p: ProductWithRelations, quantity: number) => {
    setBusy(p.id, true);
    const result = await callApi<{ product: ProductWithRelations }>(`/api/admin/products/${p.id}`, "PATCH", {
      track_stock: true,
      stock_quantity: quantity,
    });
    setBusy(p.id, false);
    if (result.ok) {
      replaceProduct(result.data.product);
      toast.success(`${p.name}: stock set to ${quantity}`);
    } else {
      toast.error(result.error);
    }
  };

  const enableTracking = (p: ProductWithRelations) => updateStock(p, 10);

  const toggleActive = async (p: ProductWithRelations) => {
    setBusy(p.id, true);
    const result = await callApi<{ product: ProductWithRelations }>(`/api/admin/products/${p.id}`, "PATCH", {
      is_active: !p.is_active,
    });
    setBusy(p.id, false);
    if (result.ok) {
      replaceProduct(result.data.product);
      toast.success(`${p.name} is now ${result.data.product.is_active ? "visible in store" : "hidden"}`);
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (p: ProductWithRelations) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setBusy(p.id, true);
    const result = await callApi<{ success: boolean }>(`/api/admin/products/${p.id}`, "DELETE");
    setBusy(p.id, false);
    if (result.ok) {
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      toast.success(`Deleted ${p.name}`);
    } else {
      toast.error(result.error);
    }
  };

  const filterChips: { value: typeof filter; label: string; count?: number }[] = [
    { value: "all", label: "All", count: stats.total },
    { value: "low", label: "Low stock", count: stats.low },
    { value: "out", label: "Out of stock", count: stats.out },
    { value: "hidden", label: "Hidden", count: stats.total - stats.active },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">Products &amp; Stock</h1>
          <p className="mt-1 text-xs text-muted">
            Add products, set prices and keep your inventory up to date. Changes go live instantly.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button
            type="button"
            onClick={() => setShowNewCatModal(true)}
            className="btn btn-outline h-11 px-4 text-xs gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            Category
          </button>
          <button
            type="button"
            onClick={openNew}
            id="admin-add-product-btn"
            className="btn btn-primary h-11 px-4 text-xs gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            Product
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Products", value: stats.total, icon: Package, tone: "text-accent bg-accent/10" },
          { label: "Live in store", value: stats.active, icon: CheckCircle2, tone: "text-emerald-800 bg-emerald-100" },
          { label: "Low stock", value: stats.low, icon: AlertTriangle, tone: "text-amber-800 bg-amber-100" },
          { label: "Out of stock", value: stats.out, icon: PackageX, tone: "text-rose-800 bg-rose-100" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="flex items-center gap-3 border border-line bg-cream p-3 shadow-sm sm:p-4">
            <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", tone)}>
              <Icon size={17} />
            </span>
            <div className="min-w-0">
              <p className="font-serif text-2xl font-bold leading-none text-ink">{value}</p>
              <p className="mt-1 truncate text-[0.6875rem] font-medium text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search products or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full border border-line bg-cream pl-10 pr-3 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {filterChips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => setFilter(chip.value)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 border px-3.5 text-xs font-semibold transition-colors cursor-pointer",
                filter === chip.value
                  ? "border-accent bg-accent text-cream"
                  : "border-line bg-cream text-ink hover:border-accent/50",
              )}
            >
              {chip.label}
              <span className={cn("tabular-nums", filter === chip.value ? "text-cream/80" : "text-muted")}>
                {chip.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Product list */}
      <div className="space-y-3">
        {visibleProducts.length === 0 && (
          <div className="border border-dashed border-line bg-cream/60 p-10 text-center text-sm text-muted">
            No products match your filters.
          </div>
        )}

        {visibleProducts.map((p) => {
          const qty = p.stock_quantity ?? 0;
          const isSoldOut = p.track_stock && qty <= 0;
          const isLow = p.track_stock && qty > 0 && qty <= LOW_STOCK_LIMIT;
          const busy = busyIds.has(p.id);

          return (
            <div
              key={p.id}
              className={cn(
                "border p-3 shadow-sm transition-all sm:p-4",
                p.is_active ? "border-line bg-cream" : "border-line/40 bg-sand/30",
              )}
            >
              <div className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-sand">
                  {p.images[0]?.url && (
                    <Image src={p.images[0].url} alt={p.name} fill sizes="64px" className="object-cover" />
                  )}
                  {!p.is_active && (
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-[0.5625rem] font-bold uppercase tracking-wider text-cream">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h3 className="font-serif text-base font-bold leading-tight text-ink">{p.name}</h3>
                    {p.is_featured && (
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-accent">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {p.category?.name ?? "No category"} ·{" "}
                    <strong className="text-accent">{formatBDT(p.price)}</strong>
                    {p.compare_at_price ? (
                      <span className="ml-1 line-through">{formatBDT(p.compare_at_price)}</span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-[0.6875rem] font-semibold">
                    {!p.track_stock ? (
                      <span className="text-muted">Stock tracking off · always available</span>
                    ) : isSoldOut ? (
                      <span className="text-rose-700">Sold out</span>
                    ) : isLow ? (
                      <span className="text-amber-700">Low stock · {qty} left</span>
                    ) : (
                      <span className="text-emerald-800">In stock · {qty} units</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3">
                {/* Stock control */}
                <div className="flex items-center gap-2">
                  {p.track_stock ? (
                    <StockStepper
                      key={`${p.id}-${qty}`}
                      value={qty}
                      busy={busy}
                      onCommit={(next) => updateStock(p, next)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => enableTracking(p)}
                      disabled={busy}
                      className="h-10 border border-dashed border-accent/60 px-3 text-xs font-semibold text-accent hover:bg-accent/5 cursor-pointer disabled:opacity-50"
                    >
                      Track stock
                    </button>
                  )}
                  {busy && <Loader2 size={16} className="animate-spin text-muted" />}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(p)}
                    disabled={busy}
                    title={p.is_active ? "Hide from store" : "Publish to store"}
                    aria-label={p.is_active ? "Hide from store" : "Publish to store"}
                    className="flex h-10 w-10 items-center justify-center border border-line text-ink hover:text-accent cursor-pointer disabled:opacity-50"
                  >
                    {p.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="flex h-10 items-center gap-1.5 border border-line bg-cream px-3.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent cursor-pointer"
                  >
                    <Edit2 size={13} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p)}
                    disabled={busy}
                    aria-label={`Delete ${p.name}`}
                    className="flex h-10 w-10 items-center justify-center border border-line text-muted hover:text-rose-600 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create sheet (bottom sheet on phones, centered modal on larger screens) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="flex max-h-[92svh] w-full max-w-xl flex-col border border-line bg-cream shadow-2xl sm:max-h-[90vh]">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-6">
              <h2 className="min-w-0 truncate font-serif text-xl font-bold text-ink">
                {isCreating ? "Add New Piece" : `Edit: ${editingProduct?.name}`}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="-mr-2 flex h-10 w-10 shrink-0 items-center justify-center text-muted hover:text-ink cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-xs sm:px-6">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-ink">Product Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      patchForm(
                        isCreating
                          ? { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }
                          : { name },
                      );
                    }}
                    className="mt-1 w-full border border-line bg-white/70 p-3 text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-ink">URL Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => patchForm({ slug: e.target.value })}
                    className="mt-1 w-full border border-line bg-white/70 p-3 font-mono text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-ink">Price (BDT ৳) *</label>
                    <input
                      required
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={form.price}
                      onChange={(e) => patchForm({ price: Number(e.target.value) })}
                      className="mt-1 w-full border border-line bg-white/70 p-3 font-semibold text-accent focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-ink">
                      Old Price (৳) <span className="font-normal normal-case text-muted">— shows discount</span>
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      placeholder="Optional"
                      value={form.compareAtPrice ?? ""}
                      onChange={(e) => patchForm({ compareAtPrice: e.target.value ? Number(e.target.value) : null })}
                      className="mt-1 w-full border border-line bg-white/70 p-3 text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <label className="block font-semibold uppercase tracking-wider text-ink">Category *</label>
                    <button
                      type="button"
                      onClick={() => setShowNewCatModal(true)}
                      className="flex items-center gap-1 text-[0.6875rem] font-bold text-accent hover:underline cursor-pointer"
                    >
                      <Plus size={12} /> New Category
                    </button>
                  </div>
                  <select
                    value={form.categoryId}
                    onChange={(e) => patchForm({ categoryId: e.target.value })}
                    className="mt-1 w-full border border-line bg-white/70 p-3 text-ink focus:border-accent focus:outline-none"
                  >
                    {allCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <ImageDropzone
                  value={form.imageUrl}
                  onChange={(url) => patchForm({ imageUrl: url })}
                  aspectRatio="1/1"
                  label="Product Photo (Drag & Drop or Tap to Upload)"
                  hint="Square (1:1) photo. Pick from your phone or Mac."
                />

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-ink">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => patchForm({ description: e.target.value })}
                    className="mt-1 w-full border border-line bg-white/70 p-3 text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Inventory */}
                <div className="space-y-3 border border-line bg-sand/40 p-4">
                  <label className="flex cursor-pointer items-start justify-between gap-4">
                    <span>
                      <span className="block font-semibold text-ink">Track stock for this product</span>
                      <span className="mt-0.5 block text-[0.6875rem] text-muted">
                        ON: customers can&apos;t order more than you have, and it shows &ldquo;sold out&rdquo; at 0.
                        OFF: always available.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={form.trackStock}
                      onChange={(e) => patchForm({ trackStock: e.target.checked })}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-accent"
                    />
                  </label>

                  {form.trackStock && (
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-ink">
                        Units in stock *
                      </label>
                      <div className="mt-1 inline-flex h-11 items-stretch border border-line bg-white/80">
                        <button
                          type="button"
                          onClick={() => patchForm({ stockQuantity: Math.max(0, form.stockQuantity - 1) })}
                          aria-label="Decrease"
                          className="flex w-11 items-center justify-center text-ink hover:text-accent cursor-pointer"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          value={form.stockQuantity}
                          onChange={(e) => patchForm({ stockQuantity: Math.max(0, Math.floor(Number(e.target.value) || 0)) })}
                          className="w-20 border-x border-line bg-transparent text-center font-bold tabular-nums text-ink focus:bg-white focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => patchForm({ stockQuantity: form.stockQuantity + 1 })}
                          aria-label="Increase"
                          className="flex w-11 items-center justify-center text-ink hover:text-accent cursor-pointer"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => patchForm({ isFeatured: e.target.checked })}
                      className="h-4 w-4 accent-accent"
                    />
                    <span className="font-semibold text-ink">Featured on Homepage</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => patchForm({ isActive: e.target.checked })}
                      className="h-4 w-4 accent-accent"
                    />
                    <span className="font-semibold text-ink">Active (visible in store)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 border-t border-line bg-cream px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:justify-end sm:px-6">
                <button type="button" onClick={closeModal} className="btn btn-outline h-11 flex-1 px-4 text-xs sm:flex-none">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  id="admin-save-product-btn"
                  className="btn btn-primary h-11 flex-[2] gap-2 px-6 text-xs sm:flex-none"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category creation modal */}
      {showNewCatModal && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[92svh] w-full max-w-md overflow-y-auto border border-line bg-cream p-5 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h2 className="font-serif text-xl font-bold text-ink">Add New Category</h2>
              <button
                type="button"
                onClick={() => setShowNewCatModal(false)}
                aria-label="Close"
                className="-mr-2 flex h-10 w-10 items-center justify-center text-muted hover:text-ink cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-ink">Category Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Anklets, Chokers, Brooches"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="mt-1 w-full border border-line bg-white/70 p-3 text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <ImageDropzone
                label="Category Cover Image (1:1 Square)"
                aspectRatio="1/1"
                value={newCatImage}
                onChange={(url) => setNewCatImage(url)}
              />

              <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewCatModal(false)}
                  className="btn btn-outline h-11 px-4 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCat}
                  className="btn btn-primary h-11 gap-1.5 px-5 text-xs font-bold cursor-pointer"
                >
                  {isSavingCat ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
