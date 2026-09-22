"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { registerUser } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    startTransition(async () => {
      const result = await registerUser(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        router.push("/login");
      }
    });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-card shadow-card p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-brand-green flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-brand-black">ثبت‌نام</h1>
            <p className="text-warm-gray text-sm mt-2">
              یک حساب کاربری جدید بسازید
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="name"
              label="نام و نام خانوادگی"
              placeholder="نام شما"
              error={errors.name?.message}
              {...register("name")}
            />
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
            <Input
              id="confirmPassword"
              label="تکرار رمز عبور"
              type="password"
              placeholder="رمز عبور را تکرار کنید"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isPending}
            >
              ثبت‌نام
            </Button>
          </form>

          <p className="text-center text-sm text-warm-gray mt-6">
            حساب کاربری دارید؟{" "}
            <Link href="/login" className="text-brand-green font-medium hover:underline">
              ورود
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
