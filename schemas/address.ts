import { z } from "zod";

export const addressSchema = z.object({
  title: z.string().min(1, "عنوان آدرس الزامی است"),
  fullName: z.string().min(1, "نام و نام خانوادگی الزامی است"),
  phone: z
    .string()
    .min(1, "شماره تماس الزامی است")
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  province: z.string().min(1, "استان الزامی است"),
  city: z.string().min(1, "شهر الزامی است"),
  address: z.string().min(1, "آدرس الزامی است").min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد"),
  postalCode: z
    .string()
    .min(1, "کد پستی الزامی است")
    .regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
