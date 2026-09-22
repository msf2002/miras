import { getUserOrders } from "@/actions/orders";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "سفارش‌ها" };

export default async function OrdersPage() {
  const orders = await getUserOrders();

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="سفارشی ثبت نشده"
        description="هنوز سفارشی ثبت نکرده‌اید."
        actionLabel="مشاهده فروشگاه"
        actionHref="/shop"
      />
    );
  }

  const statusVariant = (status: string) => {
    switch (status) {
      case "DELIVERED": return "success" as const;
      case "CANCELLED": return "danger" as const;
      case "SHIPPED": return "info" as const;
      case "PROCESSING": return "warning" as const;
      default: return "default" as const;
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-card shadow-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <p className="font-bold text-brand-black">سفارش {order.orderNumber}</p>
              <p className="text-xs text-warm-gray mt-1">
                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant={statusVariant(order.status)}>
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
              <Badge variant={order.paymentStatus === "PAID" ? "success" : "default"}>
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-warm-gray">
                <span>
                  {item.productName} ({item.sizeName}/{item.colorName}) × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <hr className="my-4 border-warm-gray/10" />
          <div className="flex justify-between font-bold">
            <span>مبلغ نهایی</span>
            <span className="text-brand-green">{formatPrice(order.total)}</span>
          </div>
          {order.trackingCode && (
            <p className="text-xs text-warm-gray mt-2">
              کد پیگیری: {order.trackingCode}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
