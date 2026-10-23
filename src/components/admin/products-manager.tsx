"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, Eye, EyeOff, Package } from "lucide-react";
import { toast } from "sonner";
import { formatBDT } from "@/lib/utils";
import type { Category, ProductWithRelations } from "@/types";
import { ImageDropzone } from "@/components/admin/image-dropzone";

interface ProductsManagerProps {
  initialProducts: ProductWithRelations[];
  categories: Category[];
}

export function ProductsManager({ initialProducts, categories }: ProductsManagerProps) {
  const [products, setProducts] = useState<ProductWithRelations[]>(initialProducts);
  const [allCategories, setAllCategories] = useState<Category[]>(categories);
  const [editingProduct, setEditingProduct] = useState<ProductWithRelations | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Category Modal State
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState("/images/sample/cat-earrings.jpg");
  const [isSavingCat, setIsSavingCat] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(1000);
  const [compareAtPrice, setCompareAtPrice] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || "");
  const [trackStock, setTrackStock] = useState(false);
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    setIsSavingCat(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          image_url: newCatImage,
        }),
      });
      const data = await res.json();
      if (data.category) {
        setAllCategories((prev) => [...prev, data.category]);
        setCategoryId(data.category.id);
        setShowNewCatModal(false);
        setNewCatName("");
        toast.success(`Category "${data.category.name}" created successfully!`);
      } else {
        toast.error(data.error || "Failed to create category");
      }
    } catch {
      toast.error("Network or server error occurred");
    } finally {
      setIsSavingCat(false);
    }
  };

  const openEdit = (p: ProductWithRelations) => {
    setEditingProduct(p);
    setIsCreating(false);
    setName(p.name);
    setSlug(p.slug);
    setDescription(p.description);
    setPrice(p.price);
    setCompareAtPrice(p.compare_at_price);
    setCategoryId(p.category_id || allCategories[0]?.id || "");
    setTrackStock(p.track_stock);
    setStockQuantity(p.stock_quantity ?? 10);
    setIsActive(p.is_active);
    setIsFeatured(p.is_featured);
    setImageUrl(p.images[0]?.url || "");
  };

  const openNew = () => {
    setEditingProduct(null);
    setIsCreating(true);
    setName("");
    setSlug("");
    setDescription("");
    setPrice(1200);
    setCompareAtPrice(null);
    setCategoryId(allCategories[0]?.id || "");
    setTrackStock(false);
    setStockQuantity(10);
    setIsActive(true);
    setIsFeatured(false);
    setImageUrl("/images/sample/cat-earrings.jpg");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    const calculatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = categories.find((c) => c.id === categoryId) || null;

    if (isCreating) {
      const newProduct: ProductWithRelations = {
        id: `p-${Date.now()}`,
        name,
        slug: calculatedSlug,
        description,
        price,
        compare_at_price: compareAtPrice || null,
        category_id: categoryId || null,
        track_stock: trackStock,
        stock_quantity: trackStock ? stockQuantity : null,
        is_active: isActive,
        is_featured: isFeatured,
        created_at: new Date().toISOString(),
        category,
        images: [{ id: `img-${Date.now()}`, product_id: `p-${Date.now()}`, url: imageUrl, sort_order: 0 }],
      };
      setProducts([newProduct, ...products]);
      toast.success("New product added successfully!");
    } else if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name,
              slug: calculatedSlug,
              description,
              price,
              compare_at_price: compareAtPrice || null,
              category_id: categoryId || null,
              track_stock: trackStock,
              stock_quantity: trackStock ? stockQuantity : null,
              is_active: isActive,
              is_featured: isFeatured,
              category,
              images: [{ id: p.images[0]?.id || `img-${Date.now()}`, product_id: p.id, url: imageUrl, sort_order: 0 }],
            }
          : p,
      );
      setProducts(updated);
      toast.success("Product updated successfully!");
    }

    setEditingProduct(null);
    setIsCreating(false);
  };

  const toggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newState = !p.is_active;
          toast.success(`${p.name} is now ${newState ? "Active" : "Hidden"}`);
          return { ...p, is_active: newState };
        }
        return p;
      }),
    );
  };

  const handleDelete = (id: string, prodName: string) => {
    if (confirm(`Are you sure you want to delete "${prodName}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Deleted ${prodName}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Products CMS</h1>
          <p className="mt-1 text-xs text-muted">
            Manage your jewellery items, pricing, images, and inventory stock tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewCatModal(true)}
            className="btn btn-outline h-10 px-4 text-xs gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            Add Category
          </button>
          <button
            type="button"
            onClick={openNew}
            className="btn btn-primary h-10 px-4 text-xs gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Edit / Create Modal or Slide-in */}
      {(isCreating || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto border border-line bg-cream p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h2 className="font-serif text-2xl font-bold text-ink">
                {isCreating ? "Add New Piece" : `Edit: ${editingProduct?.name}`}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreating(false);
                }}
                className="text-muted hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-ink">
                  Product Name *
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (isCreating) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  className="mt-1 w-full border border-line bg-cream p-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-ink">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-1 w-full border border-line bg-cream p-2.5 text-xs font-mono text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-ink">
                    Price (BDT ৳) *
                  </label>
                  <input
                    required
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-1 w-full border border-line bg-cream p-2.5 text-sm font-semibold text-accent focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-ink">
                    Compare-At / Sale Price (৳)
                  </label>
                  <input
                    type="number"
                    placeholder="Optional (shows discount)"
                    value={compareAtPrice ?? ""}
                    onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : null)}
                    className="mt-1 w-full border border-line bg-cream p-2.5 text-sm text-muted focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold uppercase tracking-wider text-ink">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewCatModal(true)}
                      className="text-[0.6875rem] font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> New Category
                    </button>
                  </div>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mt-1 w-full border border-line bg-cream p-2.5 text-xs text-ink focus:border-accent focus:outline-none"
                  >
                    {allCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <ImageDropzone
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url)}
                  aspectRatio="1/1"
                  label="Product Photo (Drag & Drop or Click to Upload)"
                  hint="Square (1:1) photo. Drag & drop or select from your phone/Mac."
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-ink">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full border border-line bg-cream p-2.5 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>

              {/* Inventory Stock Tracking Toggle */}
              <div className="rounded border border-line bg-sand/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-ink">Track Stock for this Product</span>
                    <p className="text-[0.6875rem] text-muted">
                      If turned OFF, stock is infinite and not shown. If ON, enables inventory enforcement.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={trackStock}
                    onChange={(e) => setTrackStock(e.target.checked)}
                    className="h-5 w-5 accent-accent"
                  />
                </div>

                {trackStock && (
                  <div className="pt-2">
                    <label className="block font-semibold uppercase tracking-wider text-ink">
                      Available Stock Quantity *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(Number(e.target.value))}
                      className="mt-1 w-32 border border-line bg-cream p-2 text-sm font-semibold text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Featured & Active Toggles */}
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-accent"
                  />
                  <span className="font-semibold text-ink">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-accent"
                  />
                  <span className="font-semibold text-ink">Active (Visible in Store)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreating(false);
                  }}
                  className="btn btn-outline h-10 px-4 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary h-10 px-6 text-xs">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products List Table / Cards */}
      <div className="space-y-3">
        {products.map((p) => {
          const isSoldOut = p.track_stock && (p.stock_quantity ?? 0) <= 0;
          return (
            <div
              key={p.id}
              className={`flex flex-col gap-3 border p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm transition-all ${
                !p.is_active ? "border-line/40 bg-sand/20 opacity-70" : "border-line bg-cream"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-sand">
                  {p.images[0]?.url && (
                    <Image src={p.images[0].url} alt={p.name} fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-ink">{p.name}</h3>
                    {p.is_featured && (
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-accent">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    {p.category?.name} •{" "}
                    <strong className="text-accent">{formatBDT(p.price)}</strong>
                    {p.compare_at_price && (
                      <span className="ml-1 line-through text-muted">{formatBDT(p.compare_at_price)}</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[0.6875rem]">
                    {p.track_stock ? (
                      isSoldOut ? (
                        <span className="font-semibold text-rose-700">Out of Stock (0)</span>
                      ) : (
                        <span className="font-medium text-emerald-800">
                          Stock: {p.stock_quantity} units
                        </span>
                      )
                    ) : (
                      <span className="text-muted">Stock Tracking: OFF (Always available)</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-line/60 pt-2 sm:border-0 sm:pt-0">
                <button
                  type="button"
                  onClick={() => toggleActive(p.id)}
                  title={p.is_active ? "Hide from store" : "Publish to store"}
                  className="flex h-9 w-9 items-center justify-center rounded border border-line text-ink hover:text-accent"
                >
                  {p.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="flex h-9 items-center gap-1.5 rounded border border-line bg-cream px-3 text-xs font-semibold text-ink hover:border-accent hover:text-accent"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  className="flex h-9 w-9 items-center justify-center rounded border border-line text-muted hover:text-rose-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Creation Modal */}
      {showNewCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-line bg-cream p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h2 className="font-serif text-xl font-bold text-ink">
                Add New Category
              </h2>
              <button
                type="button"
                onClick={() => setShowNewCatModal(false)}
                className="text-muted hover:text-ink cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-ink">
                  Category Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Anklets, Chokers, Brooches"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="mt-1 w-full border border-line bg-cream p-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <ImageDropzone
                  label="Category Cover Image (1:1 Square Aspect Ratio)"
                  aspectRatio="1/1"
                  value={newCatImage}
                  onChange={(url) => setNewCatImage(url)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowNewCatModal(false)}
                  className="btn btn-outline h-9 px-4 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCat}
                  className="btn btn-primary h-9 px-5 text-xs font-bold gap-1.5 cursor-pointer"
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
