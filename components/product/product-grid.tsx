import { ProductCard } from "./product-card";
import type { ProductCardData } from "@/types";

interface ProductGridProps {
  products: ProductCardData[];
  wishlistIds?: string[];
}

export function ProductGrid({ products, wishlistIds = [] }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          wishlistIds={wishlistIds}
        />
      ))}
    </div>
  );
}
