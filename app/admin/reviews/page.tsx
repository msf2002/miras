import { adminGetReviews } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { REVIEW_STATUS_LABELS } from "@/lib/constants";
import { ReviewActions } from "./review-actions";
import { Star } from "lucide-react";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "مدیریت نظرات" };

export default async function AdminReviewsPage() {
  const reviews = await adminGetReviews();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-8">نظرات</h1>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-card shadow-card p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-brand-black">
                  {(review as any).user?.name || "کاربر"} ({(review as any).user?.email})
                </p>
                <p className="text-xs text-warm-gray mt-1">
                  محصول: {(review as any).product?.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-gold text-gold" : "text-warm-gray/30"}`}
                    />
                  ))}
                </div>
                <Badge
                  variant={
                    review.status === "APPROVED"
                      ? "success"
                      : review.status === "REJECTED"
                        ? "danger"
                        : "warning"
                  }
                >
                  {REVIEW_STATUS_LABELS[review.status]}
                </Badge>
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-warm-gray mb-4">{review.comment}</p>
            )}
            <ReviewActions reviewId={review.id} currentStatus={review.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
