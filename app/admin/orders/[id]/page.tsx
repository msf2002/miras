import { getOrderById } from "@/actions/orders";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { AdminOrderActions } from "./order-actions";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export default async function AdminOrderDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const order = await getOrderById(params.id);
  if (!order) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-2">
        سفارش {order.orderNumber}
      </h1>
      <p className="text-warm-gray mb-8">
        {new Date(order.createdAt).toLocaleDateString("fa-IR")}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Info */}
        <div className="bg-white rounded-card shadow-card p-6 space-y-4">
          <h2 className="font-bold text-brand-black">اطلاعات سفارش</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-warm-gray">وضعیت:</span>
              <Badge>{ORDER_STATUS_LABELS[order.status]}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-gray">پرداخت:</span>
              <Badge>{PAYMENT_STATUS_LABELS[order.paymentStatus]}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-gray">جمع:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>تخفیف:</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-warm-gray">ارسال:</span>
              <span>{order.shippingCost === 0 ? "رایگان" : formatPrice(order.shippingCost)}</span>
            </div>
            <hr className="border-warm-gray/10" />
            <div className="flex justify-between font-bold text-lg">
              <span>مبلغ نهایی:</span>
              <span className="text-brand-green">{formatPrice(order.total)}</span>
            </div>
          </div>
          {order.trackingCode && (
            <p className="text-xs text-warm-gray">
              کد پیگیری: {order.trackingCode}
            </p>
          )}
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-card shadow-card p-6 space-y-2">
          <h2 className="font-bold text-brand-black mb-4">آدرس ارسال</h2>
          <p className="text-sm">{order.shippingName}</p>
          <p className="text-sm text-warm-gray">{order.shippingAddress}</p>
          <p className="text-sm text-warm-gray">
            {order.shippingProvince} - {order.shippingCity}
          </p>
          <p className="text-sm text-warm-gray">تلفن: {order.shippingPhone}</p>
          <p className="text-sm text-warm-gray">کد پستی: {order.shippingPostalCode}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-card shadow-card p-6 mt-6">
        <h2 className="font-bold text-brand-black mb-4">اقلام سفارش</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-warm-gray/5">
              <div>
                <p className="text-brand-black">{item.productName}</p>
                <p className="text-xs text-warm-gray">
                  {item.sizeName} / {item.colorName} | SKU: {item.sku}
                </p>
              </div>
              <div className="text-left">
                <p>{formatPrice(item.price)} × {item.quantity}</p>
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Actions */}
      <div className="mt-6">
        <AdminOrderActions orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
