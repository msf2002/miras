"use client";

import { useState, useTransition } from "react";
import { ShoppingBag, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariantSelector } from "@/components/product/variant-selector";
import { addToCart } from "@/actions/cart";
import { toggleWishlist } from "@/actions/wishlist";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { ProductWithDetails } from "@/types";

interface ProductDetailClientProps {
  product: ProductWithDetails;
  wishlistIds: string[];
}

export function ProductDetailClient({
  product,
  wishlistIds,
}: ProductDetailClientProps) {
  const [selectedColorId, setSelectedColorId] = useState(
    product.variants[0]?.colorId || ""
  );
  const [selectedSizeId, setSelectedSizeId] = useState(
    product.variants[0]?.sizeId || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const currentVariant = product.variants.find(
    (v) => v.colorId === selectedColorId && v.sizeId === selectedSizeId
  );

  const isInWishlist = currentVariant
    ? wishlistIds.includes(currentVariant.id)
    : false;

  const handleAddToCart = () => {
    if (!currentVariant) return;
    startTransition(async () => {
      const result = await addToCart(currentVariant.id, quantity);
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
        toast.success(result.added ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد");
      }
    });
  };

  return (
    <div className="space-y-6">
      <VariantSelector
        variants={product.variants}
        selectedColorId={selectedColorId}
        selectedSizeId={selectedSizeId}
        onColorChange={setSelectedColorId}
        onSizeChange={setSelectedSizeId}
      />

      {/* Quantity */}
      <div>
        <h3 className="text-sm font-medium text-brand-black mb-3">تعداد</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-10 w-10 rounded-card border border-warm-gray/20 flex items-center justify-center hover:bg-beige transition-colors"
          >
            -
          </button>
          <span className="text-lg font-medium w-8 text-center">{quantity}</span>
          <button
            onClick={() =>
              setQuantity(
                Math.min(currentVariant?.stock || 1, quantity + 1)
              )
            }
            className="h-10 w-10 rounded-card border border-warm-gray/20 flex items-center justify-center hover:bg-beige transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={
            isPending || !currentVariant || currentVariant.stock === 0
          }
          isLoading={isPending}
        >
          <ShoppingBag className="h-5 w-5" />
          {currentVariant && currentVariant.stock === 0
            ? "ناموجود"
            : "افزودن به سبد خرید"}
        </Button>

        <button
          onClick={handleWishlist}
          disabled={isPending}
          className={cn(
            "h-12 w-12 rounded-card border-2 flex items-center justify-center transition-all",
            isInWishlist
              ? "border-red-500 bg-red-50"
              : "border-warm-gray/20 hover:border-warm-gray/50"
          )}
          aria-label={isInWishlist ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isInWishlist ? "fill-red-500 text-red-500" : "text-warm-gray"
            )}
          />
        </button>
      </div>
    </div>
  );
}
