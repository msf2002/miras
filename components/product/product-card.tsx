"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { addToCart } from "@/actions/cart";
import { toggleWishlist } from "@/actions/wishlist";
import { toast } from "sonner";
import type { ProductCardData } from "@/types";

interface ProductCardProps {
  product: ProductCardData;
  wishlistIds?: string[];
}

export function ProductCard({ product, wishlistIds = [] }: ProductCardProps) {
  const [selectedColorId, setSelectedColorId] = useState(
    product.variants[0]?.colorId || ""
  );
  const [selectedSizeId, setSelectedSizeId] = useState(
    product.variants[0]?.sizeId || ""
  );
  const [isPending, startTransition] = useTransition();

  const primaryImage =
    product.images.find((i) => i.isPrimary) || product.images[0];

  // Get unique colors and sizes
  const colors = Array.from(
    new Map(product.variants.map((v) => [v.colorId, v.color])).values()
  );
  const sizes = Array.from(
    new Map(product.variants.map((v) => [v.sizeId, v.size])).values()
  );

  // Find current variant
  const currentVariant = product.variants.find(
    (v) => v.colorId === selectedColorId && v.sizeId === selectedSizeId
  );

  const isInWishlist = currentVariant
    ? wishlistIds.includes(currentVariant.id)
    : false;

  const handleAddToCart = () => {
    if (!currentVariant) return;
    startTransition(async () => {
      const result = await addToCart(currentVariant.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });
  };

  const handleWishlist = () => {
    if (!currentVariant) return;
    startTransition(async () => {
      const result = await toggleWishlist(currentVariant.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          result.added
            ? "به علاقه‌مندی‌ها اضافه شد"
            : "از علاقه‌مندی‌ها حذف شد"
        );
      }
    });
  };

  return (
    <div className="group relative bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image — نسبت پرتره شد */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-[3/4] overflow-hidden bg-beige"
      >
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-warm-gray">
            <ShoppingBag className="h-12 w-12" />
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleWishlist();
          }}
          className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
          aria-label={
            isInWishlist ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"
          }
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isInWishlist ? "fill-red-500 text-red-500" : "text-warm-gray"
            )}
          />
        </button>

        {/* Out of stock overlay */}
        {currentVariant && currentVariant.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 px-4 py-2 rounded-card text-sm font-medium text-brand-black">
              ناموجود
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-brand-black mb-2 hover:text-brand-green transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-lg font-bold text-brand-green mb-3">
          {currentVariant
            ? formatPrice(currentVariant.price)
            : formatPrice(product.variants[0]?.price || 0)}
        </p>

        {/* Colors */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColorId(color.id)}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-all",
                selectedColorId === color.id
                  ? "border-brand-green scale-110"
                  : "border-warm-gray/20 hover:border-warm-gray/50"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`رنگ ${color.name}`}
            />
          ))}
        </div>

        {/* Sizes — flex-wrap شد */}
        <div className="flex flex-wrap items-center gap-1 mb-4">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setSelectedSizeId(size.id)}
              className={cn(
                "px-2 py-1 text-xs rounded-md border transition-all whitespace-nowrap",
                selectedSizeId === size.id
                  ? "border-brand-green bg-brand-green/10 text-brand-green"
                  : "border-warm-gray/20 text-warm-gray hover:border-warm-gray/50"
              )}
            >
              {size.name}
            </button>
          ))}
        </div>

        {/* Add to Cart — mt-auto برای چسبیدن به پایین */}
        <button
          onClick={handleAddToCart}
          disabled={isPending || !currentVariant || currentVariant.stock === 0}
          className="w-full mt-auto flex items-center justify-center gap-2 bg-brand-green text-white py-2.5 rounded-card text-sm font-medium hover:bg-brand-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              افزودن به سبد
            </>
          )}
        </button>
      </div>
    </div>
  );
}