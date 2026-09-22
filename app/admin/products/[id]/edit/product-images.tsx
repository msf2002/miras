"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2, Star, X, Loader2 } from "lucide-react";
import {
  adminAddProductImage,
  adminDeleteProductImage,
  adminSetPrimaryImage,
} from "@/actions/admin";
import { toast } from "sonner";

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
  order: number;
}

interface Props {
  productId: string;
  images: ProductImage[];
}

export function ProductImages({ productId, images }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "خطا در آپلود");
          continue;
        }

        const result = await adminAddProductImage({
          productId,
          url: data.url,
          alt: file.name,
        });

        if (!result.success) { toast.error('خطا در آپلود تصویر'); }
      }
      toast.success("عکس(ها) اضافه شد");
      router.refresh();
    } catch {
      toast.error("خطا در آپلود عکس");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("این عکس حذف شود؟")) return;
    setBusyId(imageId);
    try {
      const result = await adminDeleteProductImage(imageId);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("عکس حذف شد");
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    setBusyId(imageId);
    try {
      await adminSetPrimaryImage(imageId, productId);
      toast.success("عکس اصلی تغییر کرد");
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-brand-black">
          گالری عکس ({images.length})
        </h2>
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-card hover:bg-brand-green/90 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "در حال آپلود..." : "افزودن عکس"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-warm-gray/30 rounded-card p-12 text-center">
          <Upload className="h-10 w-10 text-warm-gray/50 mx-auto mb-3" />
          <p className="text-sm text-warm-gray">
            هنوز عکسی اضافه نشده. روی «افزودن عکس» کلیک کن.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-card overflow-hidden border border-warm-gray/10 bg-beige/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || ""}
                className="w-full h-full object-cover"
              />

              {img.isPrimary && (
                <span className="absolute top-2 right-2 bg-brand-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  اصلی
                </span>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img.id)}
                    disabled={busyId === img.id}
                    className="p-2 bg-white rounded-full hover:bg-gold/20 transition-colors"
                    title="انتخاب به عنوان عکس اصلی"
                  >
                    <Star className="h-4 w-4 text-gold" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  disabled={busyId === img.id}
                  className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}