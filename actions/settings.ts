"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("دسترسی غیرمجاز");
  }
  return session;
}

// ─── خواندن محتوا (عمومی، بدون نیاز به ادمین) ─────────
export async function getSiteSetting<T = unknown>(
  key: string
): Promise<T | null> {
  const setting = await db.siteSetting.findUnique({ where: { key } });
  if (!setting) return null;
  try {
    return JSON.parse(setting.value) as T;
  } catch {
    return null;
  }
}

// ─── ذخیره محتوا (فقط ادمین) ──────────────────────────
export async function updateSiteSetting(key: string, value: unknown) {
  await requireAdmin();

  const stringValue = JSON.stringify(value);

  await db.siteSetting.upsert({
    where: { key },
    update: { value: stringValue },
    create: { key, value: stringValue },
  });

  revalidatePath("/about");
  revalidatePath("/admin/content");
  return { success: true };
}