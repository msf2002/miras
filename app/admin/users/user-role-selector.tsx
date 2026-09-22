"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldCheck, Loader2 } from "lucide-react";
import { adminUpdateUserRole } from "@/actions/admin";
import { toast } from "sonner";

interface Props {
  userId: string;
  userName: string | null;
  currentRole: "ADMIN" | "CUSTOMER";
  isSelf: boolean;  // ← آیا این رکورد خود ادمین فعلی هست؟
}

export function UserRoleSelector({
  userId,
  userName,
  currentRole,
  isSelf,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleChange = (newRole: "ADMIN" | "CUSTOMER") => {
    if (newRole === currentRole) {
      setOpen(false);
      return;
    }

    const action = newRole === "ADMIN" ? "ارتقا به مدیر" : "تبدیل به کاربر عادی";
    if (
      !confirm(
        `آیا مطمئن هستید که می‌خواهید «${userName || "این کاربر"}» را ${action} کنید؟`
      )
    ) {
      setOpen(false);
      return;
    }

    startTransition(async () => {
      const result = await adminUpdateUserRole(userId, newRole);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          newRole === "ADMIN"
            ? "کاربر به مدیر ارتقا یافت ✅"
            : "نقش کاربر به عادی تغییر کرد"
        );
        router.refresh();
      }
      setOpen(false);
    });
  };

  // اگه خود ادمین فعلی هست، فقط نمایش بدیم بدون امکان تغییر
  if (isSelf) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-green/10 text-brand-green">
        <ShieldCheck className="h-3.5 w-3.5" />
        شما (مدیر)
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          currentRole === "ADMIN"
            ? "bg-brand-green text-white hover:bg-brand-green/90"
            : "bg-beige text-warm-gray hover:bg-beige/70"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : currentRole === "ADMIN" ? (
          <ShieldCheck className="h-3.5 w-3.5" />
        ) : (
          <Shield className="h-3.5 w-3.5" />
        )}
        {currentRole === "ADMIN" ? "مدیر" : "کاربر"}
      </button>

      {open && !isPending && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Menu */}
          <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-card shadow-card-hover border border-warm-gray/10 z-50 p-1">
            <button
              type="button"
              onClick={() => handleChange("ADMIN")}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-right ${
                currentRole === "ADMIN"
                  ? "bg-brand-green/10 text-brand-green"
                  : "hover:bg-beige"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              مدیر
            </button>
            <button
              type="button"
              onClick={() => handleChange("CUSTOMER")}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-right ${
                currentRole === "CUSTOMER"
                  ? "bg-beige text-warm-gray"
                  : "hover:bg-beige"
              }`}
            >
              <Shield className="h-4 w-4" />
              کاربر عادی
            </button>
          </div>
        </>
      )}
    </div>
  );
}