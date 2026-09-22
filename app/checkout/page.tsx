import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCart } from "@/actions/cart";
import { getUserAddresses } from "@/actions/address";
import { CheckoutClient } from "./checkout-client";
import { EmptyState } from "@/components/common/empty-state";
import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "تکمیل خرید" };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [cart, addresses] = await Promise.all([
    getCart(),
    getUserAddresses(),
  ]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={ShoppingBag}
          title="سبد خرید خالی است"
          description="ابتدا محصولی به سبد خرید اضافه کنید."
          actionLabel="مشاهده فروشگاه"
          actionHref="/shop"
        />
      </div>
    );
  }

  return <CheckoutClient cart={cart} addresses={addresses} />;
}
