"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { DashboardStats } from "@/types";
import type { OrderStatus, PaymentStatus, ReviewStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("دسترسی غیرمجاز");
  }
  return session;
}

// ─── Dashboard Stats ────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();

  const [
    totalUsers,
    totalOrders,
    revenueResult,
    newOrders,
    lowStockVariants,
    recentOrders,
  ] = await Promise.all([
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.count(),
    db.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
    db.order.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    db.productVariant.count({ where: { stock: { lte: 3 }, isActive: true } }),
    db.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
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
    }),
  ]);

  // Top products by sales
  const topItems = await db.orderItem.groupBy({
    by: ["productName"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  // Sales chart (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const orders = await db.order.findMany({
    where: {
      paymentStatus: "PAID",
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { createdAt: true, total: true },
  });

  const salesByDate: Record<string, number> = {};
  orders.forEach((order) => {
    const date = order.createdAt.toISOString().split("T")[0];
    salesByDate[date] = (salesByDate[date] || 0) + order.total;
  });

  const salesChart = Object.entries(salesByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date, amount }));

  return {
    totalUsers,
    totalOrders,
    totalRevenue: revenueResult._sum.total || 0,
    newOrders,
    lowStockProducts: lowStockVariants,
    topProducts: topItems.map((item) => ({
      name: item.productName,
      sales: item._sum.quantity || 0,
    })),
    recentOrders: recentOrders as DashboardStats["recentOrders"],
    salesChart,
  };
}

// ─── Admin Product Management ───────────────────────────
export async function adminGetProducts() {
  await requireAdmin();
  return db.product.findMany({
    include: {
      images: { orderBy: { order: "asc" } },
      variants: {
        include: { size: true, color: true },
        orderBy: [{ size: { order: "asc" } }, { color: { order: "asc" } }],
      },
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminCreateProduct(data: {
  name: string;
  slug: string;
  description: string;
  story?: string;
  isActive: boolean;
  isFeatured: boolean;
}) {
  await requireAdmin();

  const existing = await db.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { error: "اسلاگ تکراری است" };
  }

  const product = await db.product.create({ data });
  revalidatePath("/admin/products");
  return { success: true, productId: product.id };
}

export async function adminUpdateProduct(
  productId: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    story?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }
) {
  await requireAdmin();

  await db.product.update({
    where: { id: productId },
    data,
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function adminDeleteProduct(productId: string) {
  await requireAdmin();

  await db.product.update({
    where: { id: productId },
    data: { isActive: false },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function adminCreateVariant(data: {
  productId: string;
  sizeId: string;
  colorId: string;
  sku: string;
  price: number;
  stock: number;
}) {
  await requireAdmin();

  const existing = await db.productVariant.findUnique({
    where: {
      productId_sizeId_colorId: {
        productId: data.productId,
        sizeId: data.sizeId,
        colorId: data.colorId,
      },
    },
  });

  if (existing) {
    return { error: "این ترکیب سایز و رنگ قبلاً وجود دارد" };
  }

  await db.productVariant.create({ data: { ...data, isActive: true } });
  revalidatePath("/admin/products");
  return { success: true };
}

export async function adminUpdateVariant(
  variantId: string,
  data: { price?: number; stock?: number; isActive?: boolean; sku?: string }
) {
  await requireAdmin();

  await db.productVariant.update({
    where: { id: variantId },
    data,
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function adminDeleteVariant(variantId: string) {
  await requireAdmin();

  // چک کن واریانت در سفارشی استفاده نشده باشه
  const usedInOrders = await db.orderItem.count({
    where: { variantId },
  });

  if (usedInOrders > 0) {
    return {
      error: `این واریانت در ${usedInOrders} سفارش استفاده شده و قابل حذف نیست. به جای حذف، آن را غیرفعال کنید.`,
    };
  }

  await db.productVariant.delete({
    where: { id: variantId },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

// ─── Admin Order Management ─────────────────────────────
export async function adminGetOrders() {
  await requireAdmin();
  return db.order.findMany({
    include: {
      items: {
        include: {
          variant: {
            include: { size: true, color: true, product: true },
          },
        },
      },
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  await requireAdmin();

  await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function adminUpdatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  await requireAdmin();

  await db.order.update({
    where: { id: orderId },
    data: { paymentStatus },
  });

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function adminSetTrackingCode(
  orderId: string,
  trackingCode: string
) {
  await requireAdmin();

  await db.order.update({
    where: { id: orderId },
    data: { trackingCode, status: "SHIPPED" },
  });

  revalidatePath("/admin/orders");
  return { success: true };
}

// ─── Admin User Management ──────────────────────────────
export async function adminGetUsers() {
  await requireAdmin();
  return db.user.findMany({
    include: {
      _count: { select: { orders: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminUpdateUserRole(
  userId: string,
  role: "ADMIN" | "CUSTOMER"
)

{
  const session = await requireAdmin();

  // جلوگیری از تغییر نقش خودت
  if (userId === session.user.id) {
    return { error: "نمی‌توانید نقش خودتان را تغییر دهید" };
  }

  // جلوگیری از حذف آخرین ادمین
  if (role === "CUSTOMER") {
    const adminCount = await db.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return {
        error: "نمی‌توانید آخرین ادمین را به کاربر عادی تغییر دهید",
      };
    }
  }

  await db.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

// ─── Admin Review Management ────────────────────────────
export async function adminGetReviews() {
  await requireAdmin();
  return db.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminUpdateReviewStatus(
  reviewId: string,
  status: ReviewStatus
) {
  await requireAdmin();

  await db.review.update({
    where: { id: reviewId },
    data: { status },
  });

  revalidatePath("/admin/reviews");
  return { success: true };
}

// ─── Admin Coupon Management ────────────────────────────
export async function adminGetCoupons() {
  await requireAdmin();
  return db.coupon.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminCreateCoupon(data: {
  code: string;
  description?: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  maxUses?: number;
  isActive: boolean;
  expiresAt?: string;
}) {
  await requireAdmin();

  const existing = await db.coupon.findUnique({ where: { code: data.code } });
  if (existing) return { error: "این کد تخفیف قبلاً وجود دارد" };

  await db.coupon.create({
    data: {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function adminUpdateCoupon(
  couponId: string,
  data: {
    code?: string;
    description?: string;
    discountPercent?: number;
    discountAmount?: number;
    minOrderAmount?: number;
    maxUses?: number;
    isActive?: boolean;
    expiresAt?: string;
  }
) {
  await requireAdmin();

  // اگه کد تغییر کرده، یکتا بودنش رو چک کن
  if (data.code) {
    const existing = await db.coupon.findFirst({
      where: {
        code: data.code,
        NOT: { id: couponId },
      },
    });
    if (existing) {
      return { error: "این کد تخفیف قبلاً وجود دارد" };
    }
  }

  await db.coupon.update({
    where: { id: couponId },
    data: {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function adminDeleteCoupon(couponId: string) {
  await requireAdmin();

  // چک کن کد تخفیف در سفارشی استفاده نشده باشه
  const usedInOrders = await db.order.count({
    where: { couponId },
  });

  if (usedInOrders > 0) {
    // اگه استفاده شده، فقط غیرفعالش کن
    await db.coupon.update({
      where: { id: couponId },
      data: { isActive: false },
    });
    revalidatePath("/admin/coupons");
    return {
      success: true,
      message: "این کد در سفارشات استفاده شده بود، بنابراین غیرفعال شد",
    };
  }

  await db.coupon.delete({
    where: { id: couponId },
  });

  revalidatePath("/admin/coupons");
  return { success: true };
}

// ─── Admin Product Image Management ─────────────────────
export async function adminAddProductImage(data: {
  productId: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}) {
  await requireAdmin();

  const count = await db.productImage.count({
    where: { productId: data.productId },
  });

  const shouldBePrimary = data.isPrimary || count === 0;

  if (shouldBePrimary) {
    await db.productImage.updateMany({
      where: { productId: data.productId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  const image = await db.productImage.create({
    data: {
      productId: data.productId,
      url: data.url,
      alt: data.alt || null,
      isPrimary: shouldBePrimary,
      order: count,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true, imageId: image.id };
}

export async function adminDeleteProductImage(imageId: string) {
  await requireAdmin();

  const image = await db.productImage.findUnique({ where: { id: imageId } });
  if (!image) return { error: "عکس یافت نشد" };

  await db.productImage.delete({ where: { id: imageId } });

  if (image.isPrimary) {
    const next = await db.productImage.findFirst({
      where: { productId: image.productId },
      orderBy: { order: "asc" },
    });
    if (next) {
      await db.productImage.update({
        where: { id: next.id },
        data: { isPrimary: true },
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function adminSetPrimaryImage(
  imageId: string,
  productId: string
) {
  await requireAdmin();

  await db.productImage.updateMany({
    where: { productId, isPrimary: true },
    data: { isPrimary: false },
  });

  await db.productImage.update({
    where: { id: imageId },
    data: { isPrimary: true },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

// ─── Get sizes and colors ───────────────────────────────
export async function getSizes() {
  return db.size.findMany({ orderBy: { order: "asc" } });
}

export async function getColors() {
  return db.color.findMany({ orderBy: { order: "asc" } });
}