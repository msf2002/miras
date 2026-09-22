"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Pencil } from "lucide-react";
import { adminCreateCoupon, adminUpdateCoupon } from "@/actions/admin";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountPercent?: number | null;
  discountAmount?: number | null;
  minOrderAmount?: number | null;
  maxUses?: number | null;
  expiresAt?: Date | string | null;
  isActive: boolean;
}

interface CouponFormProps {
  coupon?: Coupon;  // اگه داده بشه، حالت ویرایش
}

export function CouponForm({ coupon }: CouponFormProps) {
  const router = useRouter();
  const isEdit = !!coupon;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percent" as "percent" | "amount",
    discountPercent: "",
    discountAmount: "",
    minOrderAmount: "",
    maxUses: "",
    expiresAt: "",
    isActive: true,
  });

  // وقتی coupon عوض می‌شه (حالت ویرایش)، فرم رو پر کن
  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code,
        description: coupon.description || "",
        discountType: coupon.discountPercent ? "percent" : "amount",
        discountPercent: coupon.discountPercent?.toString() || "",
        discountAmount: coupon.discountAmount?.toString() || "",
        minOrderAmount: coupon.minOrderAmount?.toString() || "",
        maxUses: coupon.maxUses?.toString() || "",
        expiresAt: coupon.expiresAt
          ? new Date(coupon.expiresAt).toISOString().split("T")[0]
          : "",
        isActive: coupon.isActive,
      });
    }
  }, [coupon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description || undefined,
        discountPercent:
          form.discountType === "percent" && form.discountPercent
            ? Number(form.discountPercent)
            : undefined,
        discountAmount:
          form.discountType === "amount" && form.discountAmount
            ? Number(form.discountAmount)
            : undefined,
        minOrderAmount: form.minOrderAmount
          ? Number(form.minOrderAmount)
          : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
        isActive: form.isActive,
      };

      const result = isEdit
        ? await adminUpdateCoupon(coupon!.id, payload)
        : await adminCreateCoupon(payload);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          isEdit ? "کد تخفیف ویرایش شد" : "کد تخفیف ایجاد شد"
        );
        setOpen(false);
        if (!isEdit) {
          setForm({
            code: "",
            description: "",
            discountType: "percent",
            discountPercent: "",
            discountAmount: "",
            minOrderAmount: "",
            maxUses: "",
            expiresAt: "",
            isActive: true,
          });
        }
        router.refresh();
      }
    } catch (err) {
      toast.error("خطا در ذخیره کد تخفیف");
    } finally {
      setLoading(false);
    }
  };

  // دکمه بازکننده
  const trigger = isEdit ? (
    <button
      onClick={() => setOpen(true)}
      className="p-1.5 hover:bg-beige rounded transition-colors"
      title="ویرایش"
    >
      <Pencil className="h-4 w-4 text-warm-gray" />
    </button>
  ) : (
    <button
      onClick={() => setOpen(true)}
      className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-card hover:bg-brand-green/90 transition-colors text-sm font-medium"
    >
      <Plus className="h-4 w-4" />
      افزودن کد تخفیف
    </button>
  );

  if (!open) return trigger;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-card shadow-card-hover w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-warm-gray/10">
          <h2 className="text-lg font-bold text-brand-black">
            {isEdit ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-beige rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-brand-black">
              کد تخفیف *
            </label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="مثلاً: OFF20"
              className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green/30"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-brand-black">
              توضیحات
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="اختیاری"
              className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-brand-black">
              نوع تخفیف *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, discountType: "percent" })}
                className={`flex-1 px-3 py-2 rounded-card text-sm font-medium transition-colors ${
                  form.discountType === "percent"
                    ? "bg-brand-green text-white"
                    : "bg-beige text-warm-gray hover:bg-beige/70"
                }`}
              >
                درصدی
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, discountType: "amount" })}
                className={`flex-1 px-3 py-2 rounded-card text-sm font-medium transition-colors ${
                  form.discountType === "amount"
                    ? "bg-brand-green text-white"
                    : "bg-beige text-warm-gray hover:bg-beige/70"
                }`}
              >
                مبلغ ثابت
              </button>
            </div>
          </div>

          {form.discountType === "percent" ? (
            <div>
              <label className="block text-sm font-medium mb-1 text-brand-black">
                درصد تخفیف *
              </label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={form.discountPercent}
                onChange={(e) =>
                  setForm({ ...form, discountPercent: e.target.value })
                }
                placeholder="مثلاً: 20"
                className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green/30"
                dir="ltr"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1 text-brand-black">
                مبلغ تخفیف (تومان) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.discountAmount}
                onChange={(e) =>
                  setForm({ ...form, discountAmount: e.target.value })
                }
                placeholder="مثلاً: 50000"
                className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green/30"
                dir="ltr"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-brand-black">
                حداقل مبلغ سفارش
              </label>
              <input
                type="number"
                min="0"
                value={form.minOrderAmount}
                onChange={(e) =>
                  setForm({ ...form, minOrderAmount: e.target.value })
                }
                placeholder="اختیاری"
                className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green/30"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-brand-black">
                حداکثر استفاده
              </label>
              <input
                type="number"
                min="0"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="اختیاری"
                className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green/30"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-brand-black">
              تاریخ انقضا
            </label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green/30"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
              className="rounded border-warm-gray/30 text-brand-green focus:ring-brand-green"
            />
            <span className="text-sm text-brand-black">فعال باشد</span>
          </label>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-green text-white px-4 py-2 rounded-card hover:bg-brand-green/90 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {loading ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "ذخیره"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-card bg-beige text-warm-gray hover:bg-beige/70 transition-colors text-sm font-medium"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}