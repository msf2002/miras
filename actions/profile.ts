"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست")
    .optional()
    .or(z.literal("")),
});

export async function updateProfile(data: { name: string; phone?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "لطفاً وارد شوید" };

  const validated = profileSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: validated.data.name,
      phone: validated.data.phone || null,
    },
  });

  revalidatePath("/account/profile");
  return { success: "پروفایل به‌روزرسانی شد" };
}

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
}
