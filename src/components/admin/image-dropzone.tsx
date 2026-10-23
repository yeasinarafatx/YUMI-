"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, CheckCircle2, Loader2, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ImageDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: "16/9" | "1/1" | "4/5";
  label?: string;
  hint?: string;
}

export function ImageDropzone({
  value,
  onChange,
  aspectRatio = "16/9",
  label = "Upload Image (Drag & Drop or Select)",
  hint = "JPG, PNG, WebP (Maximum 5MB)",
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size cannot exceed 5MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const aspectClass =
    aspectRatio === "16/9"
      ? "aspect-[16/9]"
      : aspectRatio === "1/1"
        ? "aspect-square"
        : "aspect-[4/5]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-ink">
          {label}
        </label>
        {value && (
          <span className="inline-flex items-center gap-1 text-[0.6875rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 size={12} /> Uploaded
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        /* Preview with Action Overlay */
        <div className={`relative ${aspectClass} w-full max-w-xl overflow-hidden rounded border border-line bg-sand shadow-sm group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded Preview"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn btn-primary h-9 px-4 text-xs font-bold gap-1.5 shadow-md cursor-pointer"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Change Image
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="btn btn-outline h-9 px-3 text-xs bg-white text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Area */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex ${aspectClass} max-w-xl flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-accent bg-accent/10 scale-[1.01]"
              : "border-line bg-sand/40 hover:border-accent/60 hover:bg-sand/70"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-accent">
              <Loader2 size={32} className="animate-spin" />
              <p className="text-xs font-bold">Uploading image, please wait...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted">
              <div className="rounded-full bg-white p-3 shadow-sm text-accent">
                <UploadCloud size={28} />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-ink">
                  Drag and drop image here, or <span className="text-accent underline">browse file</span>
                </p>
                <p className="text-[0.6875rem] text-muted">{hint}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
