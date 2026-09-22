import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import { getUserWishlistIds } from "@/actions/wishlist";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductDetailClient } from "./product-detail-client";
import { Star } from "lucide-react";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "محصول یافت نشد" };

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) notFound();

  const [relatedProducts, wishlistIds] = await Promise.all([
    getRelatedProducts(product.id),
    getUserWishlistIds(),
  ]);

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Details */}
        <div className="mt-8 lg:mt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-brand-black mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(avgRating)
                        ? "fill-gold text-gold"
                        : "text-warm-gray/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-warm-gray">
                ({product._count?.reviews || 0} نظر)
              </span>
            </div>
          )}

          <p className="text-warm-gray leading-7 mb-6">
            {product.description}
          </p>

          {/* Client-side variant selector + add to cart */}
          <ProductDetailClient product={product} wishlistIds={wishlistIds} />

          {/* Story */}
          {product.story && (
            <div className="mt-8 pt-8 border-t border-warm-gray/10">
              <h2 className="text-lg font-bold text-brand-black mb-4">
                داستان و مفهوم اثر
              </h2>
              <p className="text-warm-gray leading-8">{product.story}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-16 pt-12 border-t border-warm-gray/10">
          <h2 className="text-xl font-bold text-brand-black mb-8">
            نظرات کاربران ({product.reviews.length})
          </h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-card p-6 shadow-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-brand-green/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-green">
                        {(review as any).user?.name?.[0] || "ک"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-brand-black">
                      {(review as any).user?.name || "کاربر"}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= review.rating
                            ? "fill-gold text-gold"
                            : "text-warm-gray/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-warm-gray leading-6">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-warm-gray/10">
          <h2 className="text-xl font-bold text-brand-black mb-8">
            محصولات مرتبط
          </h2>
          <ProductGrid products={relatedProducts} wishlistIds={wishlistIds} />
        </section>
      )}
    </div>
  );
}