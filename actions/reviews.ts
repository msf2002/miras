"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { reviewSchema, type ReviewInput } from "@/schemas/order";
import { revalidatePath } from "next/cache";

export async function createReview(data: ReviewInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "لطفاً وارد حساب کاربری شوید" };
  }

  const validated = reviewSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const existing = await db.review.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId: validated.data.productId,
      },
    },
  });

  if (existing) {
    return { error: "شما قبلاً برای این محصول نظر ثبت کرده‌اید" };
  }

  await db.review.create({
    data: {
      userId: session.user.id,
      productId: validated.data.productId,
      rating: validated.data.rating,
      comment: validated.data.comment,
    },
  });

  revalidatePath(`/product`);
  return { success: "نظر شما ثبت شد و پس از تایید نمایش داده می‌شود" };
}
