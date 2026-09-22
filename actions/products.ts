"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { ProductFilters, PaginatedResponse, ProductCardData } from "@/types";

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<ProductCardData>> {
  const {
    search,
    productNames,
    sizes,
    colors,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    limit = 12,
  } = filters;

  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { story: { contains: search, mode: "insensitive" } },
    ];
  }

  if (productNames && productNames.length > 0) {
    where.name = {
      in: productNames.map((n: string) => `تندیس یا ${n}`).concat(
        productNames.map((n: string) => `تندیس ${n}`)
      ),
    };
  }

  // Variant-level filters
  const variantWhere: Record<string, unknown> = { isActive: true };
  if (sizes && sizes.length > 0) {
    variantWhere.size = { name: { in: sizes } };
  }
  if (colors && colors.length > 0) {
    variantWhere.color = { name: { in: colors } };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    variantWhere.price = {};
    if (minPrice !== undefined) (variantWhere.price as Record<string, unknown>).gte = minPrice;
    if (maxPrice !== undefined) (variantWhere.price as Record<string, unknown>).lte = maxPrice;
  }

  if (sizes?.length || colors?.length || minPrice || maxPrice) {
    where.variants = { some: variantWhere };
  }

  let orderBy: Record<string, string> = {};
  switch (sort) {
    case "price-asc":
    case "price-desc":
      orderBy = { createdAt: "desc" }; // sorted client-side for variant prices
      break;
    case "popular":
      orderBy = { createdAt: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const [items, total] = await Promise.all([
    db.product.findMany({
      where: where as never,
      include: {
        images: { orderBy: { order: "asc" } },
        variants: {
          where: variantWhere as never,
          include: {
            size: true,
            color: true,
          },
          orderBy: [{ size: { order: "asc" } }, { color: { order: "asc" } }],
        },
      },
      orderBy: orderBy as never,
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.product.count({ where: where as never }),
  ]);

  return {
    items: items as ProductCardData[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string) {
  // 🔑 slug رو decode کن (چون URL-encoded میاد)
  const decodedSlug = decodeURIComponent(slug);

  // 🔍 لاگ دیباگ (بعد از تست حذف کن)
  console.log("[getProductBySlug] decodedSlug:", decodedSlug);

  const product = await db.product.findFirst({
    where: {
      slug: decodedSlug,
      isActive: true,
    },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: {
        where: { isActive: true },
        include: {
          size: true,
          color: true,
        },
        orderBy: [{ size: { order: "asc" } }, { color: { order: "asc" } }],
      },
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { reviews: { where: { status: "APPROVED" } } } },
    },
  });

  console.log("[getProductBySlug] found:", product ? product.name : "NULL");

  return product;
}

export async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: {
        where: { isActive: true },
        include: { size: true, color: true },
        orderBy: [{ size: { order: "asc" } }, { color: { order: "asc" } }],
      },
    },
    take: 4,
  });
}

export async function getRelatedProducts(productId: string) {
  return db.product.findMany({
    where: { isActive: true, id: { not: productId } },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: {
        where: { isActive: true },
        include: { size: true, color: true },
        orderBy: [{ size: { order: "asc" } }, { color: { order: "asc" } }],
      },
    },
    take: 4,
  });
}
