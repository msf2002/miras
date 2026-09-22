"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/common/empty-state";
import { addressSchema, type AddressInput } from "@/schemas/address";
import { createAddress, deleteAddress } from "@/actions/address";
import { PROVINCES } from "@/lib/constants";
import { toast } from "sonner";
import type { Address } from "@prisma/client";

interface AddressesClientProps {
  addresses: Address[];
}

export function AddressesClient({ addresses }: AddressesClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = (data: AddressInput) => {
    startTransition(async () => {
      const result = await createAddress(data);
      if (result.error) toast.error(result.error);
      else {
        toast.success(result.success);
        setShowModal(false);
        reset();
      }
    });
  };

  const handleDelete = (addressId: string) => {
    startTransition(async () => {
      const result = await deleteAddress(addressId);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-brand-black">آدرس‌ها</h2>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          افزودن آدرس
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="آدرسی ثبت نشده"
          description="برای خرید، ابتدا یک آدرس اضافه کنید."
        />
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-card shadow-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-brand-black">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="text-xs bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="h-3 w-3" /> پیش‌فرض
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-warm-gray">{addr.address}</p>
                  <p className="text-xs text-warm-gray mt-1">
                    {addr.province} - {addr.city} | {addr.phone} | کد پستی: {addr.postalCode}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={isPending}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="افزودن آدرس جدید">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input id="title" label="عنوان" placeholder="مثلاً: خانه" error={errors.title?.message} {...register("title")} />
          <Input id="fullName" label="نام و نام خانوادگی" error={errors.fullName?.message} {...register("fullName")} />
          <Input id="phone" label="شماره موبایل" placeholder="09xxxxxxxxx" error={errors.phone?.message} {...register("phone")} />
          <Select
            id="province"
            label="استان"
            placeholder="انتخاب استان"
            options={PROVINCES.map((p) => ({ value: p, label: p }))}
            error={errors.province?.message}
            {...register("province")}
          />
          <Input id="city" label="شهر" error={errors.city?.message} {...register("city")} />
          <Input id="address" label="آدرس کامل" error={errors.address?.message} {...register("address")} />
          <Input id="postalCode" label="کد پستی" placeholder="۱۰ رقم" error={errors.postalCode?.message} {...register("postalCode")} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isDefault")} className="rounded text-brand-green" />
            آدرس پیش‌فرض
          </label>
          <Button type="submit" className="w-full" isLoading={isPending}>ذخیره</Button>
        </form>
      </Modal>
    </div>
  );
}
