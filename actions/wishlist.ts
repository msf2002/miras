"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(variantId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "لطفاً وارد حساب کاربری شوید" };
  }

  const existing = await db.wishlist.findUnique({
    where: {
      userId_variantId: {
        userId: session.user.id,
        variantId,
      },
    },
  });

  if (existing) {
    await db.wishlist.delete({ where: { id: existing.id } });
    revalidatePath("/account/wishlist");
    return { success: true, added: false };
  }

  await db.wishlist.create({
    data: {
      userId: session.user.id,
      variantId,
    },
  });

  revalidatePath("/account/wishlist");
  return { success: true, added: true };
}

export async function getWishlist() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      variant: {
        include: {
          size: true,
          color: true,
          product: {
            include: { images: { where: { isPrimary: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserWishlistIds() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const items = await db.wishlist.findMany({
    where: { userId: session.user.id },
    select: { variantId: true },
  });

  return items.map((item) => item.variantId);
}
