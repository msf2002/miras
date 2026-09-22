import { adminGetCoupons } from "@/actions/admin";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { CouponForm } from "./coupon-form";
import { DeleteCouponButton } from "./delete-coupon-button";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "مدیریت تخفیف‌ها" };

export default async function AdminCouponsPage() {
  const coupons = await adminGetCoupons();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-black">کدهای تخفیف</h1>
        <CouponForm />
      </div>

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-gray/10 bg-beige/50">
                <th className="px-6 py-4 text-right font-medium text-warm-gray">کد</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">تخفیف</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">استفاده</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">وضعیت</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">انقضا</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-warm-gray">
                    هنوز کد تخفیفی ثبت نشده است
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-warm-gray/5 hover:bg-beige/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold">{coupon.code}</td>
                    <td className="px-6 py-4 text-warm-gray">
                      {coupon.discountPercent
                        ? `${coupon.discountPercent}%`
                        : coupon.discountAmount
                        ? formatPrice(coupon.discountAmount)
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-warm-gray">
                      {coupon.usedCount}/{coupon.maxUses || "∞"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={coupon.isActive ? "success" : "danger"}>
                        {coupon.isActive ? "فعال" : "غیرفعال"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-warm-gray">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString("fa-IR")
                        : "بدون محدودیت"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <CouponForm
                          coupon={{
                            id: coupon.id,
                            code: coupon.code,
                            description: coupon.description,
                            discountPercent: coupon.discountPercent,
                            discountAmount: coupon.discountAmount,
                            minOrderAmount: coupon.minOrderAmount,
                            maxUses: coupon.maxUses,
                            expiresAt: coupon.expiresAt,
                            isActive: coupon.isActive,
                          }}
                        />
                        <DeleteCouponButton
                          couponId={coupon.id}
                          couponCode={coupon.code}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}