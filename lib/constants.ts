export const SITE_NAME = "میراث نور";
export const SITE_DESCRIPTION =
  "فروشگاه اینترنتی تخصصی تندیس‌های مذهبی - تجلی نام‌های مقدس در هنر ایرانی";

export const NAV_LINKS = [
  { label: "صفحه اصلی", href: "/" },
  { label: "تندیس‌ها", href: "/shop" },
  { label: "درباره ما", href: "/about" },
  { label: "راهنمای خرید", href: "/about#guide" },
  { label: "تماس با ما", href: "/about#contact" },
] as const;

export const PRODUCT_NAMES = ["علی", "حسین", "محمد", "مهدی"] as const;

export const SIZE_NAMES = ["کوچک", "متوسط", "بزرگ", "خیلی بزرگ"] as const;

export const COLOR_NAMES = [
  { name: "طلایی", hex: "#C5A55A" },
  { name: "مشکی", hex: "#1A1A1A" },
  { name: "مسی", hex: "#B87333" },
  { name: "نقره‌ای", hex: "#C0C0C0" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار پرداخت",
  PAID: "پرداخت شده",
  PROCESSING: "در حال پردازش",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل شده",
  CANCELLED: "لغو شده",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار",
  PAID: "پرداخت شده",
  FAILED: "ناموفق",
  REFUNDED: "بازگشت وجه",
};

export const REVIEW_STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار تایید",
  APPROVED: "تایید شده",
  REJECTED: "رد شده",
};

export const PROVINCES = [
  "تهران", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی",
  "مازندران", "خوزستان", "گیلان", "کرمان", "آذربایجان غربی",
  "سیستان و بلوچستان", "لرستان", "کرمانشاه", "گلستان", "همدان",
  "هرمزگان", "مرکزی", "اردبیل", "بوشهر", "قم", "قزوین",
  "زنجان", "کردستان", "یزد", "چهارمحال و بختیاری",
  "سمنان", "خراسان شمالی", "خراسان جنوبی", "کهگیلویه و بویراحمد",
  "ایلام", "البرز",
] as const;
