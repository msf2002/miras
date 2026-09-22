"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminUpdateOrderStatus,
  adminSetTrackingCode,
} from "@/actions/admin";
import { toast } from "sonner";
import type { OrderStatus } from "@prisma/client";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "در انتظار" },
  { value: "PAID", label: "پرداخت شده" },
  { value: "PROCESSING", label: "در حال پردازش" },
  { value: "SHIPPED", label: "ارسال شده" },
  { value: "DELIVERED", label: "تحویل شده" },
  { value: "CANCELLED", label: "لغو شده" },
];

export function AdminOrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [trackingCode, setTrackingCode] = useState("");

  const handleStatusChange = (status: OrderStatus) => {
    startTransition(async () => {
      const result = await adminUpdateOrderStatus(orderId, status);
      if (result.success) toast.success("وضعیت به‌روزرسانی شد");
    });
  };

  const handleTrackingCode = () => {
    if (!trackingCode) return;
    startTransition(async () => {
      const result = await adminSetTrackingCode(orderId, trackingCode);
      if (result.success) toast.success("کد پیگیری ثبت شد");
    });
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 space-y-6">
      <h2 className="font-bold text-brand-black">عملیات مدیر</h2>

      <div>
        <p className="text-sm text-warm-gray mb-3">تغییر وضعیت سفارش:</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Button
              key={s.value}
              size="sm"
              variant={currentStatus === s.value ? "primary" : "outline"}
              onClick={() => handleStatusChange(s.value)}
              disabled={isPending}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-warm-gray mb-3">ثبت کد پیگیری:</p>
        <div className="flex gap-2">
          <Input
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="کد رهگیری پستی"
          />
          <Button onClick={handleTrackingCode} disabled={isPending}>
            ثبت
          </Button>
        </div>
      </div>
    </div>
  );
}
