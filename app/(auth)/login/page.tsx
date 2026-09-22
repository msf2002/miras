"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { loginUser } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    startTransition(async () => {
      const result = await loginUser(data.email, data.password);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("خوش آمدید!");
        router.push("/");
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-card shadow-card p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-brand-green flex items-center justify-center">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-brand-black">ورود</h1>
            <p className="text-warm-gray text-sm mt-2">
              به حساب کاربری خود وارد شوید
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="email"
              label="ایمیل"
              type="email"
              placeholder="example@email.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="password"
              label="رمز عبور"
              type="password"
              placeholder="حداقل ۶ کاراکتر"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isPending}
            >
              ورود
            </Button>
          </form>

          <p className="text-center text-sm text-warm-gray mt-6">
            حساب کاربری ندارید؟{" "}
            <Link href="/register" className="text-brand-green font-medium hover:underline">
              ثبت‌نام
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
