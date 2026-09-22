"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Tag, CreditCard, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrder, processPayment } from "@/actions/orders";
import { formatPrice, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CartWithItems } from "@/types";
import type { Address } from "@prisma/client";

interface CheckoutClientProps {
  cart: CartWithItems;
  addresses: Address[];
}

export function CheckoutClient({ cart, addresses }: CheckoutClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [couponCode, setCouponCode] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"review" | "payment" | "success">("review");
  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  const handleSubmitOrder = () => {
    if (!selectedAddressId) {
      toast.error("لطفاً یک آدرس انتخاب کنید");
      return;
    }

    startTransition(async () => {
      const result = await createOrder({
        addressId: selectedAddressId,
        couponCode: couponCode || undefined,
        notes: notes || undefined,
      });

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        setOrderId(result.orderId!);
        setOrderNumber(result.orderNumber!);
        setStep("payment");
      }
    });
  };

  const handlePayment = () => {
    startTransition(async () => {
      const result = await processPayment(orderId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setStep("success");
        toast.success("پرداخت موفق!");
      }
    });
  };

  if (step === "success") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mb-6 mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-brand-black mb-2">
          سفارش با موفقیت ثبت شد!
        </h1>
        <p className="text-warm-gray mb-2">شماره سفارش: {orderNumber}</p>
        <p className="text-warm-gray mb-8">
          از خرید شما متشکریم. جزئیات سفارش از طریق حساب کاربری قابل مشاهده است.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push("/account/orders")}>
            مشاهده سفارش‌ها
          </Button>
          <Button variant="outline" onClick={() => router.push("/shop")}>
            ادامه خرید
          </Button>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mb-6 mx-auto h-16 w-16 rounded-full bg-brand-green/10 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-brand-green" />
        </div>
        <h1 className="text-2xl font-bold text-brand-black mb-2">
          پرداخت سفارش
        </h1>
        <p className="text-warm-gray mb-8">
          شماره سفارش: {orderNumber}
        </p>
        <p className="text-sm text-warm-gray mb-4">
          (در این نسخه پرداخت شبیه‌سازی شده است)
        </p>
        <Button
          size="lg"
          onClick={handlePayment}
          isLoading={isPending}
          className="min-w-[200px]"
        >
          پرداخت و تایید نهایی
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl font-bold text-brand-black mb-8">تکمیل خرید</h1>

      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
        <div className="space-y-6">
          {/* Address Selection */}
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-bold text-brand-black mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-green" />
              آدرس ارسال
            </h2>
            {addresses.length === 0 ? (
              <p className="text-warm-gray text-sm">
                آدرسی ثبت نشده.{" "}
                <a href="/account/addresses" className="text-brand-green hover:underline">
                  افزودن آدرس
                </a>
              </p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-card border-2 cursor-pointer transition-all",
                      selectedAddressId === addr.id
                        ? "border-brand-green bg-brand-green/5"
                        : "border-warm-gray/10 hover:border-warm-gray/30"
                    )}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 text-brand-green focus:ring-brand-green"
                    />
                    <div>
                      <p className="font-medium text-brand-black">{addr.title}</p>
                      <p className="text-sm text-warm-gray mt-1">{addr.address}</p>
                      <p className="text-xs text-warm-gray mt-1">
                        {addr.province} - {addr.city} | {addr.phone}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Coupon */}
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-bold text-brand-black mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-brand-green" />
              کد تخفیف
            </h2>
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="کد تخفیف را وارد کنید"
                className="flex-1"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-bold text-brand-black mb-4">
              توضیحات سفارش
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="در صورت نیاز توضیحاتی اضافه کنید..."
              className="w-full rounded-card border border-warm-gray/30 bg-white px-4 py-2.5 text-sm text-brand-black placeholder:text-warm-gray/50 focus:border-brand-green focus:outline-none min-h-[80px] resize-y"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-white rounded-card shadow-card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-brand-black mb-4">
              خلاصه سفارش
            </h2>

            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-warm-gray line-clamp-1">
                    {item.variant.product.name} ({item.variant.size.name}/{item.variant.color.name}) × {item.quantity}
                  </span>
                  <span className="font-medium whitespace-nowrap mr-2">
                    {formatPrice(item.variant.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-warm-gray/10 mb-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray">جمع</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">ارسال</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">رایگان</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              <hr className="border-warm-gray/10" />
              <div className="flex justify-between text-lg font-bold">
                <span>مبلغ نهایی</span>
                <span className="text-brand-green">
                  {formatPrice(subtotal + shippingCost)}
                </span>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleSubmitOrder}
              isLoading={isPending}
              disabled={!selectedAddressId}
            >
              ثبت سفارش
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
