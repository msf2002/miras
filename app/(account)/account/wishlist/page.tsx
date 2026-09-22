import { getWishlist } from "@/actions/wishlist";
import { WishlistClient } from "./wishlist-client";
import { EmptyState } from "@/components/common/empty-state";
import { Heart } from "lucide-react";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "علاقه‌مندی‌ها" };

export default async function WishlistPage() {
  const wishlist = await getWishlist();

  if (wishlist.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="لیست علاقه‌مندی خالی است"
        description="محصولات مورد علاقه خود را با کلیک روی آیکون قلب ذخیره کنید."
        actionLabel="مشاهده فروشگاه"
        actionHref="/shop"
      />
    );
  }

  return <WishlistClient wishlist={wishlist} />;
}
