"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCartItemQuantity, removeFromCart } from "@/actions/cart";
import { formatPrice } from "@/lib/utils";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { toast } from "sonner";
import type { CartWithItems } from "@/types";

interface CartPageClientProps {
  cart: CartWithItems;
}

export function CartPageClient({ cart }: CartPageClientProps) {
  const [isPending, startTransition] = useTransition();

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    startTransition(async () => {
      const result = await updateCartItemQuantity(cartItemId, newQuantity);
      if (result.error) toast.error(result.error);
    });
  };

  const handleRemove = (cartItemId: string) => {
    startTransition(async () => {
      const result = await removeFromCart(cartItemId);
      if (result.error) toast.error(result.error);
      else toast.success("از سبد خرید حذف شد");
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl font-bold text-brand-black mb-8">سبد خرید</h1>

      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
        {/* Cart Items */}
        <div className="space-y-4">
          {cart.items.map((item) => {
            const primaryImage = item.variant.product.images[0];
            return (
              <div
                key={item.id}
                className="bg-white rounded-card shadow-card p-4 flex gap-4"
              >
                {/* Image */}
                <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-beige flex-shrink-0">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={item.variant.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-warm-gray" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.variant.product.slug}`}
                    className="font-bold text-brand-black hover:text-brand-green transition-colors line-clamp-1"
                  >
                    {item.variant.product.name}
                  </Link>
                  <p className="text-xs text-warm-gray mt-1">
                    {item.variant.size.name} / {item.variant.color.name}
                  </p>
                  <p className="text-sm font-bold text-brand-green mt-2">
                    {formatPrice(item.variant.price)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={isPending}
                        className="h-8 w-8 rounded-md border border-warm-gray/20 flex items-center justify-center hover:bg-beige transition-colors disabled:opacity-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={isPending || item.quantity >= item.variant.stock}
                        className="h-8 w-8 rounded-md border border-warm-gray/20 flex items-center justify-center hover:bg-beige transition-colors disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={isPending}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-white rounded-card shadow-card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-brand-black mb-6">
              خلاصه سفارش
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray">جمع محصولات</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">هزینه ارسال</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">رایگان</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-warm-gray/70">
                  برای ارسال رایگان {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} دیگر خرید کنید
                </p>
              )}
              <hr className="border-warm-gray/10" />
              <div className="flex justify-between text-lg font-bold text-brand-black">
                <span>مبلغ نهایی</span>
                <span className="text-brand-green">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button className="w-full" size="lg">
                ادامه خرید
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
