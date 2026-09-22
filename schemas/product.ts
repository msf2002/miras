import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "نام محصول الزامی است"),
  slug: z.string().min(1, "اسلاگ الزامی است"),
  description: z.string().min(1, "توضیحات الزامی است"),
  story: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const variantSchema = z.object({
  productId: z.string().min(1),
  sizeId: z.string().min(1, "سایز الزامی است"),
  colorId: z.string().min(1, "رنگ الزامی است"),
  sku: z.string().min(1, "SKU الزامی است"),
  price: z.number().min(1, "قیمت باید بیشتر از صفر باشد"),
  stock: z.number().min(0, "موجودی نمی‌تواند منفی باشد"),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
