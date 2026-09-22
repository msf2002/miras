import { getProducts } from "@/actions/products";
import { getUserWishlistIds } from "@/actions/wishlist";
import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/common/empty-state";
import { Search as SearchIcon } from "lucide-react";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "جستجو" };

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";

  const result = query
    ? await getProducts({ search: query, limit: 20 })
    : { items: [], total: 0 };

  const wishlistIds = await getUserWishlistIds();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl font-bold text-brand-black mb-2">جستجو</h1>
      {query && (
        <p className="text-warm-gray mb-8">
          نتایج جستجو برای «{query}»: {result.total} مورد
        </p>
      )}

      {/* Search form */}
      <form action="/search" className="mb-8">
        <div className="relative max-w-xl">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="نام تندیس، توضیحات..."
            className="w-full rounded-card border border-warm-gray/30 bg-white px-4 py-3 pr-12 text-brand-black placeholder:text-warm-gray/50 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green/30"
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray" />
        </div>
      </form>

      {result.items.length > 0 ? (
        <ProductGrid products={result.items} wishlistIds={wishlistIds} />
      ) : query ? (
        <EmptyState
          icon={SearchIcon}
          title="نتیجه‌ای یافت نشد"
          description="عبارت دیگری را جستجو کنید یا فروشگاه را مرور کنید."
          actionLabel="مشاهده فروشگاه"
          actionHref="/shop"
        />
      ) : null}
    </div>
  );
}
