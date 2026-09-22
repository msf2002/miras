import { z } from "zod";

export const checkoutSchema = z.object({
  addressId: z.string().min(1, "آدرس را انتخاب کنید"),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(1, "کد تخفیف الزامی است").max(20),
  description: z.string().optional(),
  discountPercent: z.number().min(1).max(100).optional(),
  discountAmount: z.number().min(1).optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  maxUses: z.number().min(1).optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional(),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().min(1, "حداقل امتیاز ۱ است").max(5, "حداکثر امتیاز ۵ است"),
  comment: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
