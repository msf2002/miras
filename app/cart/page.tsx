import { getCart } from "@/actions/cart";
import { CartPageClient } from "./cart-client";
import { EmptyState } from "@/components/common/empty-state";
import { ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "سبد خرید" };

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-brand-black mb-8">سبد خرید</h1>
        <EmptyState
          icon={ShoppingBag}
          title="سبد خرید خالی است"
          description="هنوز محصولی به سبد خرید اضافه نکرده‌اید."
          actionLabel="مشاهده فروشگاه"
          actionHref="/shop"
        />
      </div>
    );
  }

  return <CartPageClient cart={cart} />;
}
