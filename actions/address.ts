"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { addressSchema, type AddressInput } from "@/schemas/address";
import { revalidatePath } from "next/cache";

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddress(data: AddressInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "لطفاً وارد حساب کاربری شوید" };
  }

  const validated = addressSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  if (validated.data.isDefault) {
    await db.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  await db.address.create({
    data: {
      userId: session.user.id,
      ...validated.data,
    },
  });

  revalidatePath("/account/addresses");
  return { success: "آدرس اضافه شد" };
}

export async function updateAddress(addressId: string, data: AddressInput) {
  const session = await auth();
  if (!session?.user?.id) return { error: "لطفاً وارد شوید" };

  const address = await db.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });

  if (!address) return { error: "آدرس یافت نشد" };

  const validated = addressSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  if (validated.data.isDefault) {
    await db.address.updateMany({
      where: { userId: session.user.id, id: { not: addressId } },
      data: { isDefault: false },
    });
  }

  await db.address.update({
    where: { id: addressId },
    data: validated.data,
  });

  revalidatePath("/account/addresses");
  return { success: "آدرس به‌روزرسانی شد" };
}

export async function deleteAddress(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "لطفاً وارد شوید" };

  await db.address.deleteMany({
    where: { id: addressId, userId: session.user.id },
  });

  revalidatePath("/account/addresses");
  return { success: "آدرس حذف شد" };
}
