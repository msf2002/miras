"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getOrCreateCart(userId: string) {
  let cart = await db.cart.findUnique({
    where: { userId },
    include: {
      items: {
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
      },
    },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: { userId },
      include: {
        items: {
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
        },
      },
    });
  }

  return cart;
}

export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return getOrCreateCart(session.user.id);
}

export async function addToCart(variantId: string, quantity: number = 1) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "لطفاً ابتدا وارد حساب کاربری شوید" };
  }

  // Verify variant exists and has stock
  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant || !variant.isActive || !variant.product.isActive) {
    return { error: "محصول مورد نظر یافت نشد" };
  }

  if (variant.stock < quantity) {
    return { error: "موجودی کافی نیست" };
  }

  const cart = await getOrCreateCart(session.user.id);

  const existingItem = cart.items.find(
    (item) => item.variantId === variantId
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > variant.stock) {
      return { error: `حداکثر ${variant.stock} عدد موجود است` };
    }

    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });
  }

  revalidatePath("/cart");
  return { success: "به سبد خرید اضافه شد" };
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "لطفاً وارد شوید" };

  const cartItem = await db.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true, variant: true },
  });

  if (!cartItem || cartItem.cart.userId !== session.user.id) {
    return { error: "آیتم یافت نشد" };
  }

  if (quantity <= 0) {
    await db.cartItem.delete({ where: { id: cartItemId } });
  } else {
    if (quantity > cartItem.variant.stock) {
      return { error: `حداکثر ${cartItem.variant.stock} عدد موجود است` };
    }
    await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(cartItemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "لطفاً وارد شوید" };

  const cartItem = await db.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== session.user.id) {
    return { error: "آیتم یافت نشد" };
  }

  await db.cartItem.delete({ where: { id: cartItemId } });

  revalidatePath("/cart");
  return { success: true };
}

export async function clearCart() {
  const session = await auth();
  if (!session?.user?.id) return;

  const cart = await db.cart.findUnique({ where: { userId: session.user.id } });
  if (!cart) return;

  await db.cartItem.deleteMany({ where: { cartId: cart.id } });
  revalidatePath("/cart");
}
