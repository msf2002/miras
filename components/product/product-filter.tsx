"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PRODUCT_NAMES, SIZE_NAMES, COLOR_NAMES } from "@/lib/constants";

export function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const selectedNames = searchParams.getAll("name");
  const selectedSizes = searchParams.getAll("size");
  const selectedColors = searchParams.getAll("color");
  const sort = searchParams.get("sort") || "newest";

  const updateFilters = (key: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.append(key, value);
    } else {
      const values = params.getAll(key).filter((v) => v !== value);
      params.delete(key);
      values.forEach((v) => params.append(key, v));
    }
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/shop");
  };

  const hasActiveFilters =
    selectedNames.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0;

  return (
    <div>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 border border-warm-gray/30 rounded-card text-sm mb-4"
      >
        <Filter className="h-4 w-4" />
        فیلترها
        {hasActiveFilters && (
          <span className="bg-brand-green text-white text-xs px-2 py-0.5 rounded-full">
            {selectedNames.length + selectedSizes.length + selectedColors.length}
          </span>
        )}
      </button>

      <div className={cn("lg:block", isOpen ? "block" : "hidden")}>
        <div className="bg-white rounded-card shadow-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-brand-black">فیلترها</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                پاک کردن
              </button>
            )}
          </div>

          {/* Product Names */}
          <div>
            <h4 className="text-sm font-medium text-brand-black mb-3 flex items-center gap-1">
              <ChevronDown className="h-4 w-4" />
              نام تندیس
            </h4>
            <div className="space-y-2">
              {PRODUCT_NAMES.map((name) => (
                <label key={name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNames.includes(name)}
                    onChange={(e) =>
                      updateFilters("name", name, e.target.checked)
                    }
                    className="rounded border-warm-gray/30 text-brand-green focus:ring-brand-green/30"
                  />
                  <span className="text-sm text-warm-gray">{name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-sm font-medium text-brand-black mb-3 flex items-center gap-1">
              <ChevronDown className="h-4 w-4" />
              سایز
            </h4>
            <div className="space-y-2">
              {SIZE_NAMES.map((size) => (
                <label key={size} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={(e) =>
                      updateFilters("size", size, e.target.checked)
                    }
                    className="rounded border-warm-gray/30 text-brand-green focus:ring-brand-green/30"
                  />
                  <span className="text-sm text-warm-gray">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h4 className="text-sm font-medium text-brand-black mb-3 flex items-center gap-1">
              <ChevronDown className="h-4 w-4" />
              رنگ
            </h4>
            <div className="space-y-2">
              {COLOR_NAMES.map((color) => (
                <label key={color.name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.name)}
                    onChange={(e) =>
                      updateFilters("color", color.name, e.target.checked)
                    }
                    className="rounded border-warm-gray/30 text-brand-green focus:ring-brand-green/30"
                  />
                  <span
                    className="h-4 w-4 rounded-full border border-warm-gray/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm text-warm-gray">{color.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h4 className="text-sm font-medium text-brand-black mb-3">مرتب‌سازی</h4>
            <select
              value={sort}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("sort", e.target.value);
                router.push(`/shop?${params.toString()}`);
              }}
              className="w-full rounded-card border border-warm-gray/30 bg-white px-3 py-2 text-sm"
            >
              <option value="newest">جدیدترین</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="popular">محبوب‌ترین</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
