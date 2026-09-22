"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
  order: number;
}

interface Props {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-beige rounded-card flex items-center justify-center text-warm-gray">
        <ShoppingBag className="h-16 w-16" />
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  const goNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
                <div className="relative aspect-[3/4] bg-white rounded-card overflow-hidden border border-warm-gray/10">
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt || productName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

        {/* Navigation Arrows (اگه بیش از یک عکس باشه) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-card"
              aria-label="عکس قبلی"
            >
              <ChevronLeft className="h-5 w-5 text-brand-black" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-card"
              aria-label="عکس بعدی"
            >
              <ChevronRight className="h-5 w-5 text-brand-black" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 text-white text-xs rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative aspect-square rounded-card overflow-hidden border-2 transition-all",
                selectedIndex === i
                  ? "border-brand-green"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} - عکس ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}