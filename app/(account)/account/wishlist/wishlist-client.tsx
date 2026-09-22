"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toggleWishlist } from "@/actions/wishlist";
import { addToCart } from "@/actions/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  variantId: string;
  variant: {
    id: string;
    price: number;
    stock: number;
    size: { name: string };
    color: { name: string; hex: string };
    product: {
      name: string;
      slug: string;
      images: { url: string; alt: string | null }[];
    };
  };
}

export function WishlistClient({ wishlist }: { wishlist: WishlistItem[] }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = (variantId: string) => {
    startTransition(async () => {
      await toggleWishlist(variantId);
      toast.success("از علاقه‌مندی‌ها حذف شد");
    });
  };

  const handleAddToCart = (variantId: string) => {
    startTransition(async () => {
      const result = await addToCart(variantId);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-brand-black mb-4">
        علاقه‌مندی‌ها ({wishlist.length})
      </h2>
      {wishlist.map((item) => (
        <div key={item.id} className="bg-white rounded-card shadow-card p-4 flex gap-4">
          <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-beige flex-shrink-0">
            {item.variant.product.images[0] ? (
              <Image
                src={item.variant.product.images[0].url}
                alt={item.variant.product.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Heart className="h-6 w-6 text-warm-gray" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <Link
              href={`/product/${item.variant.product.slug}`}
              className="font-bold text-brand-black hover:text-brand-green transition-colors"
            >
              {item.variant.product.name}
            </Link>
            <p className="text-xs text-warm-gray mt-1">
              {item.variant.size.name} / {item.variant.color.name}
            </p>
            <p className="text-sm font-bold text-brand-green mt-1">
              {formatPrice(item.variant.price)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleAddToCart(item.variantId)}
              disabled={isPending || item.variant.stock === 0}
              className="p-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-colors disabled:opacity-50"
              title="افزودن به سبد"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleRemove(item.variantId)}
              disabled={isPending}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
