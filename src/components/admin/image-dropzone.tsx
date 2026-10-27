"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, Loader2, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

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
  hint = "JPG, PNG, WebP (Auto-compressed to WebP under 100KB)",
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "compressing" | "uploading">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("Image file size cannot exceed 25MB.");
      return;
    }

    try {
      // 1. Show 'Compressing...' loading state
      setStatus("compressing");

      // Requirements: Max 100KB (0.1MB), max width/height 1080px, strictly image/webp format
      const compressionOptions = {
        maxSizeMB: 0.1, // 100KB limit
        maxWidthOrHeight: 1080, // max 1080px width or height
        useWebWorker: true,
        fileType: "image/webp", // strictly convert to 'image/webp'
      };

      const compressedBlob = await imageCompression(file, compressionOptions);

      // Strictly ensure output File object carries 'image/webp' mime type & .webp extension
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const webpFile = new File([compressedBlob], `${baseName}.webp`, {
        type: "image/webp",
        lastModified: Date.now(),
      });

      // 2. Show 'Uploading...' loading state
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", webpFile);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      const originalKB = (file.size / 1024).toFixed(0);
      const compressedKB = (webpFile.size / 1024).toFixed(0);
      toast.success(`Image compressed (${originalKB}KB → ${compressedKB}KB WebP) & uploaded!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to process and upload image.");
    } finally {
      setStatus("idle");
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

  const isBusy = status !== "idle";

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
              disabled={isBusy}
              className="btn btn-primary h-9 px-4 text-xs font-bold gap-1.5 shadow-md cursor-pointer disabled:opacity-75"
            >
              {isBusy ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>{status === "compressing" ? "Compressing..." : "Uploading..."}</span>
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  <span>Change Image</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isBusy}
              className="btn btn-outline h-9 px-3 text-xs bg-white text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer disabled:opacity-50"
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
          onClick={() => {
            if (!isBusy) fileInputRef.current?.click();
          }}
          className={`flex ${aspectClass} max-w-xl flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-accent bg-accent/10 scale-[1.01]"
              : "border-line bg-sand/40 hover:border-accent/60 hover:bg-sand/70"
          } ${isBusy ? "cursor-wait opacity-90" : ""}`}
        >
          {isBusy ? (
            <div className="flex flex-col items-center gap-2 text-accent">
              <Loader2 size={32} className="animate-spin" />
              <p className="text-xs font-bold">
                {status === "compressing" ? "Compressing..." : "Uploading..."}
              </p>
              <p className="text-[0.6875rem] text-muted">
                {status === "compressing"
                  ? "Converting strictly to WebP (max 100KB, 1080px)..."
                  : "Uploading to storage..."}
              </p>
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
