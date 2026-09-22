"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { adminUpdateReviewStatus } from "@/actions/admin";
import { toast } from "sonner";
import type { ReviewStatus } from "@prisma/client";

export function ReviewActions({
  reviewId,
  currentStatus,
}: {
  reviewId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatus = (status: ReviewStatus) => {
    startTransition(async () => {
      const result = await adminUpdateReviewStatus(reviewId, status);
      if (result.success) toast.success("وضعیت نظر تغییر کرد");
    });
  };

  return (
    <div className="flex gap-2">
      {currentStatus !== "APPROVED" && (
        <Button size="sm" onClick={() => handleStatus("APPROVED")} disabled={isPending}>
          تایید
        </Button>
      )}
      {currentStatus !== "REJECTED" && (
        <Button size="sm" variant="danger" onClick={() => handleStatus("REJECTED")} disabled={isPending}>
          رد
        </Button>
      )}
    </div>
  );
}
