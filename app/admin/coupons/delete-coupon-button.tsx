"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { adminDeleteCoupon } from "@/actions/admin";
import { toast } from "sonner";

interface DeleteCouponButtonProps {
  couponId: string;
  couponCode: string;
}

export function DeleteCouponButton({
  couponId,
  couponCode,
}: DeleteCouponButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await adminDeleteCoupon(couponId);
      if (!result.success) {
       toast.error(result.message || 'خطا در حذف');
      } else {
        toast.success(result?.message || "کد تخفیف حذف شد");
        setOpen(false);
        router.refresh();
      }
    } catch (err) {
      toast.error("خطا در حذف کد تخفیف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 hover:bg-red-50 rounded transition-colors"
        title="حذف"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-card-hover w-full max-w-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-brand-black">حذف کد تخفیف</h3>
                <p className="text-xs text-warm-gray mt-0.5">
                  آیا از حذف کد <span className="font-mono font-bold">{couponCode}</span> مطمئنید؟
                </p>
              </div>
            </div>

            <p className="text-sm text-warm-gray mb-5">
              این عمل قابل بازگشت نیست. اگر کد در سفارشات استفاده شده باشد،
              به‌جای حذف، غیرفعال خواهد شد.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-card hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {loading ? "در حال حذف..." : "حذف کن"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-card bg-beige text-warm-gray hover:bg-beige/70 transition-colors text-sm font-medium"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}