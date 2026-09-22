"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { checkoutSchema, type CheckoutInput } from "@/schemas/order";
import { generateOrderNumber, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createOrder(data: CheckoutInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "لطفاً وارد حساب کاربری شوید" };
  }

  const validated = checkoutSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { addressId, couponCode, notes } = validated.data;

  // Get user's cart
  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          variant: {
            include: { size: true, color: true, product: true },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { error: "سبد خرید خالی است" };
  }

  // Verify address belongs to user
  const address = await db.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });

  if (!address) {
    return { error: "آدرس یافت نشد" };
  }

  // Verify stock and calculate prices from DB
  let subtotal = 0;
  const orderItems: {
    variantId: string;
    productName: string;
    sizeName: string;
    colorName: string;
    sku: string;
    price: number;
    quantity: number;
  }[] = [];

  for (const item of cart.items) {
    const freshVariant = await db.productVariant.findUnique({
      where: { id: item.variantId },
      include: { size: true, color: true, product: true },
    });

    if (!freshVariant || !freshVariant.isActive) {
      return { error: `محصول "${item.variant.product.name}" دیگر موجود نیست` };
    }

    if (freshVariant.stock < item.quantity) {
      return {
        error: `موجودی "${freshVariant.product.name}" (${freshVariant.size.name}/${freshVariant.color.name}) کافی نیست. موجودی: ${freshVariant.stock}`,
      };
    }

    subtotal += freshVariant.price * item.quantity;
    orderItems.push({
      variantId: freshVariant.id,
      productName: freshVariant.product.name,
      sizeName: freshVariant.size.name,
      colorName: freshVariant.color.name,
      sku: freshVariant.sku,
      price: freshVariant.price,
      quantity: item.quantity,
    });
  }

  // Calculate discount
  let discount = 0;
  let couponId: string | null = null;
  let appliedCouponCode: string | null = null;

  if (couponCode) {
    const coupon = await db.coupon.findFirst({
      where: {
        code: couponCode,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    if (!coupon) {
      return { error: "کد تخفیف نامعتبر است" };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { error: "ظرفیت کد تخفیف تمام شده است" };
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return {
        error: `حداقل مبلغ سفارش برای این کد تخفیف ${coupon.minOrderAmount.toLocaleString("fa-IR")} تومان است`,
      };
    }

    if (coupon.discountPercent) {
      discount = Math.round(subtotal * coupon.discountPercent / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountAmount) {
      discount = coupon.discountAmount;
    }

    couponId = coupon.id;
    appliedCouponCode = coupon.code;
  }

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal - discount + shippingCost;

  // Create order in a transaction
  const order = await db.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        addressId: address.id,
        shippingName: address.fullName,
        shippingPhone: address.phone,
        shippingProvince: address.province,
        shippingCity: address.city,
        shippingAddress: address.address,
        shippingPostalCode: address.postalCode,
        subtotal,
        discount,
        shippingCost,
        total,
        couponId,
        couponCode: appliedCouponCode,
        notes,
        items: {
          create: orderItems,
        },
      },
    });

    // Decrease stock
    for (const item of orderItems) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Update coupon usage
    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  revalidatePath("/account/orders");
  return { success: true, orderNumber: order.orderNumber, orderId: order.id };
}

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          variant: {
            include: { size: true, color: true, product: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      ...(session.user.role !== "ADMIN" ? { userId: session.user.id } : {}),
    },
    include: {
      items: {
        include: {
          variant: {
            include: { size: true, color: true, product: true },
          },
        },
      },
      address: true,
      coupon: true,
    },
  });

  return order;
}

// Mock payment - simulates payment gateway
export async function processPayment(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "لطفاً وارد شوید" };

  const order = await db.order.findFirst({
    where: { id: orderId, userId: session.user.id, paymentStatus: "PENDING" },
  });

  if (!order) return { error: "سفارش یافت نشد" };

  // Simulate successful payment
  await db.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "PAID",
      status: "PAID",
    },
  });

  revalidatePath("/account/orders");
  return { success: true };
}
