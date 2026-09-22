import { adminGetOrders } from "@/actions/admin";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "مدیریت سفارش‌ها" };

export default async function AdminOrdersPage() {
  const orders = await adminGetOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-8">سفارش‌ها</h1>
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-gray/10 bg-beige/50">
                <th className="px-6 py-4 text-right font-medium text-warm-gray">شماره</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">تاریخ</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">مبلغ</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">وضعیت</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">پرداخت</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-warm-gray/5 hover:bg-beige/30">
                  <td className="px-6 py-4 font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-warm-gray">
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        order.status === "DELIVERED"
                          ? "success"
                          : order.status === "CANCELLED"
                            ? "danger"
                            : order.status === "SHIPPED"
                              ? "info"
                              : "default"
                      }
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"}>
                      {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-brand-green hover:underline text-xs"
                    >
                      جزئیات
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
