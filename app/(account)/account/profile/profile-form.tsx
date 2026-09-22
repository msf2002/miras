"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/actions/profile";
import { toast } from "sonner";

interface ProfileFormProps {
  profile: { name: string | null; email: string; phone: string | null };
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: profile.name || "",
      phone: profile.phone || "",
    },
  });

  const onSubmit = (data: { name: string; phone: string }) => {
    startTransition(async () => {
      const result = await updateProfile(data);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <Input id="email" label="ایمیل" value={profile.email} disabled />
      <Input id="name" label="نام" {...register("name")} />
      <Input id="phone" label="شماره موبایل" placeholder="09xxxxxxxxx" {...register("phone")} />
      <Button type="submit" isLoading={isPending}>ذخیره تغییرات</Button>
    </form>
  );
}
