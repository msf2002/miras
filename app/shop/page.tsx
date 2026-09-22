import { Suspense } from "react";
import { getProducts } from "@/actions/products";
import { getUserWishlistIds } from "@/actions/wishlist";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilter } from "@/components/product/product-filter";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingState } from "@/components/common/loading-state";
import { Package } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = {
  title: "فروشگاه",
  description: "مجموعه تندیس‌های مذهبی میراث نور",
};

interface ShopPageProps {
  searchParams: Promise<{
    name?: string | string[];
    size?: string | string[];
    color?: string | string[];
    sort?: string;
    page?: string;
  }>;
}

export default async function ShopPage(props: ShopPageProps) {
  const searchParams = await props.searchParams;
  const names = Array.isArray(searchParams.name)
    ? searchParams.name
    : searchParams.name
      ? [searchParams.name]
      : undefined;
  const sizes = Array.isArray(searchParams.size)
    ? searchParams.size
    : searchParams.size
      ? [searchParams.size]
      : undefined;
  const colors = Array.isArray(searchParams.color)
    ? searchParams.color
    : searchParams.color
      ? [searchParams.color]
      : undefined;

  const page = parseInt(searchParams.page || "1", 10);
  const sort = (searchParams.sort as "newest" | "price-asc" | "price-desc" | "popular") || "newest";

  const result = await getProducts({
    productNames: names,
    sizes,
    colors,
    sort,
    page,
    limit: 12,
  });

  const wishlistIds = await getUserWishlistIds();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-brand-black">تندیس‌ها</h1>
        <p className="text-warm-gray mt-2">
          {result.total} محصول
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* Sidebar Filters */}
        <aside>
          <Suspense fallback={<LoadingState />}>
            <ProductFilter />
          </Suspense>
        </aside>

        {/* Products */}
        <div>
          {result.items.length > 0 ? (
            <>
              <ProductGrid products={result.items} wishlistIds={wishlistIds} />

              {/* Pagination */}
              {result.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Link
                        key={p}
                        href={`/shop?${new URLSearchParams({
                          ...Object.fromEntries(
                            Object.entries(searchParams).filter(([k]) => k !== "page")
                          ),
                          page: p.toString(),
                        } as Record<string, string>).toString()}`}
                        className={`px-4 py-2 rounded-card text-sm font-medium transition-colors ${
                          p === page
                            ? "bg-brand-green text-white"
                            : "bg-white text-warm-gray hover:bg-beige border border-warm-gray/20"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={Package}
              title="محصولی یافت نشد"
              description="فیلترهای خود را تغییر دهید یا همه محصولات را مشاهده کنید."
              actionLabel="مشاهده همه"
              actionHref="/shop"
            />
          )}
        </div>
      </div>
    </div>
  );
}
