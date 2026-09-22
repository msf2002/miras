"use client";

import { cn, formatPrice } from "@/lib/utils";
import type { ProductVariant, Size, Color } from "@prisma/client";

type VariantWithRelations = ProductVariant & { size: Size; color: Color };

interface VariantSelectorProps {
  variants: VariantWithRelations[];
  selectedColorId: string;
  selectedSizeId: string;
  onColorChange: (colorId: string) => void;
  onSizeChange: (sizeId: string) => void;
}

export function VariantSelector({
  variants,
  selectedColorId,
  selectedSizeId,
  onColorChange,
  onSizeChange,
}: VariantSelectorProps) {
  const colors = Array.from(
    new Map(variants.map((v) => [v.colorId, v.color])).values()
  );
  const sizes = Array.from(
    new Map(variants.map((v) => [v.sizeId, v.size])).values()
  ).sort((a, b) => a.order - b.order);

  const currentVariant = variants.find(
    (v) => v.colorId === selectedColorId && v.sizeId === selectedSizeId
  );

  return (
    <div className="space-y-6">
      {/* Color selector */}
      <div>
        <h3 className="text-sm font-medium text-brand-black mb-3">
          رنگ:{" "}
          <span className="text-warm-gray">
            {colors.find((c) => c.id === selectedColorId)?.name}
          </span>
        </h3>
        <div className="flex items-center gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => onColorChange(color.id)}
              className={cn(
                "relative h-10 w-10 rounded-full border-2 transition-all",
                selectedColorId === color.id
                  ? "border-brand-green scale-110 ring-2 ring-brand-green/20"
                  : "border-warm-gray/20 hover:border-warm-gray/50"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`انتخاب رنگ ${color.name}`}
            />
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div>
        <h3 className="text-sm font-medium text-brand-black mb-3">
          سایز:{" "}
          <span className="text-warm-gray">
            {sizes.find((s) => s.id === selectedSizeId)?.name}
          </span>
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {sizes.map((size) => {
            const variant = variants.find(
              (v) => v.sizeId === size.id && v.colorId === selectedColorId
            );
            const isOutOfStock = variant ? variant.stock === 0 : true;

            return (
              <button
                key={size.id}
                onClick={() => onSizeChange(size.id)}
                disabled={isOutOfStock}
                className={cn(
                  "px-4 py-2 rounded-card border text-sm font-medium transition-all",
                  selectedSizeId === size.id
                    ? "border-brand-green bg-brand-green/10 text-brand-green"
                    : "border-warm-gray/20 text-warm-gray hover:border-warm-gray/50",
                  isOutOfStock && "opacity-40 cursor-not-allowed line-through"
                )}
              >
                {size.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current variant info */}
      {currentVariant && (
        <div className="bg-beige/50 rounded-card p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-warm-gray">قیمت:</span>
            <span className="text-lg font-bold text-brand-green">
              {formatPrice(currentVariant.price)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-warm-gray">موجودی:</span>
            <span
              className={cn(
                "text-sm font-medium",
                currentVariant.stock > 5
                  ? "text-green-600"
                  : currentVariant.stock > 0
                    ? "text-yellow-600"
                    : "text-red-600"
              )}
            >
              {currentVariant.stock > 0
                ? `${currentVariant.stock} عدد`
                : "ناموجود"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-warm-gray">کد محصول:</span>
            <span className="text-sm font-mono text-brand-black">
              {currentVariant.sku}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
