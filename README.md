# 🕌 میراث نور | Miras Noor

فروشگاه اینترنتی تخصصی تندیس‌های مذهبی

تجلی نام‌های مقدس در هنر ایرانی

---

## 📋 شرح پروژه

میراث نور یک فروشگاه اینترنتی حرفه‌ای برای فروش تندیس‌های مذهبی است که با ترکیب هنر سنتی ایرانی و طراحی مدرن ساخته شده است. این پروژه یک اپلیکیشن Full-Stack واقعی با قابلیت اجرا است.

### محصولات:
- تندیس یا علی
- تندیس یا حسین
- تندیس محمد
- تندیس یا مهدی

هر محصول در 4 سایز (کوچک، متوسط، بزرگ، خیلی بزرگ) و 4 رنگ (طلایی، مشکی، مسی، نقره‌ای) موجود است.

---

## 🛠 تکنولوژی‌ها

| تکنولوژی | کاربرد |
|-----------|--------|
| **Next.js 14** | فریم‌ورک React |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | استایل‌دهی |
| **PostgreSQL** | دیتابیس |
| **Prisma ORM** | مدیریت دیتابیس |
| **Auth.js (v5)** | احراز هویت |
| **Zod** | اعتبارسنجی |
| **React Hook Form** | فرم‌ها |
| **Lucide React** | آیکون‌ها |
| **Recharts** | نمودارها |
| **Zustand** | State Management |
| **Sonner** | Toast Notifications |
| **Vitest** | Unit Testing |
| **Playwright** | E2E Testing |

---

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- PostgreSQL 14+
- npm یا yarn

### مراحل نصب

```bash
# 1. کلون پروژه
git clone <repo-url>
cd miras-noor

# 2. نصب وابستگی‌ها
npm install

# 3. تنظیم Environment Variables
cp .env.example .env
# فایل .env را ویرایش کنید و اطلاعات دیتابیس را وارد کنید

# 4. ایجاد دیتابیس و اجرای Migration
npx prisma db push

# 5. Seed دیتابیس
npm run db:seed

# 6. اجرای Development Server
npm run dev
```

### فونت فارسی

فونت Vazirmatn را از [اینجا](https://github.com/rastikerdar/vazirmatn) دانلود و فایل‌های woff2 را در `public/fonts/` قرار دهید:
- `Vazirmatn-Regular.woff2`
- `Vazirmatn-Medium.woff2`
- `Vazirmatn-Bold.woff2`

### تصاویر محصولات

تصاویر placeholder را در `public/images/products/` قرار دهید.

---

## 🔐 حساب‌های کاربری پیش‌فرض

| نقش | ایمیل | رمز عبور |
|------|-------|----------|
| مدیر | admin@mirasnoor.ir | admin123 |
| مشتری | customer@example.com | customer123 |

---

## 📁 ساختار پروژه

```
miras-noor/
├── app/                     # Next.js App Router
│   ├── (auth)/              # صفحات احراز هویت
│   ├── (account)/           # حساب کاربری
│   ├── admin/               # پنل مدیریت
│   ├── api/                 # API Routes
│   ├── shop/                # فروشگاه
│   ├── product/[slug]/      # جزئیات محصول
│   ├── cart/                # سبد خرید
│   ├── checkout/            # تکمیل خرید
│   ├── search/              # جستجو
│   └── about/               # درباره ما
├── components/
│   ├── ui/                  # کامپوننت‌های پایه
│   ├── layout/              # Header, Footer
│   ├── product/             # کامپوننت‌های محصول
│   ├── cart/                # کامپوننت‌های سبد خرید
│   ├── common/              # EmptyState, Loading
│   └── admin/               # کامپوننت‌های ادمین
├── actions/                 # Server Actions
├── lib/                     # Utilities
├── schemas/                 # Zod Schemas
├── types/                   # TypeScript Types
├── hooks/                   # React Hooks
├── prisma/
│   ├── schema.prisma        # Database Schema
│   └── seed.ts              # Seed Data
└── tests/
    ├── unit/                # Unit Tests
    └── e2e/                 # E2E Tests
```

---

## 🗄 مدل‌های دیتابیس

```
User ─── Address
  │ ─── Cart ─── CartItem ─── ProductVariant
  │ ─── Order ─── OrderItem
  │ ─── Wishlist
  │ ─── Review
  
Product ─── ProductImage
  │ ─── ProductVariant ─── Size
  │                    ─── Color
  
Coupon ─── Order
```

---

## 🔑 قابلیت‌ها

### مشتری (Customer)
- ✅ ثبت‌نام و ورود
- ✅ مشاهده محصولات با فیلتر و جستجو
- ✅ انتخاب سایز و رنگ (Variant System)
- ✅ سبد خرید با تغییر تعداد
- ✅ لیست علاقه‌مندی‌ها
- ✅ تکمیل خرید با کد تخفیف
- ✅ مشاهده سفارش‌ها
- ✅ مدیریت آدرس‌ها
- ✅ ثبت نظر و امتیاز

### مدیر (Admin)
- ✅ داشبورد با آمار فروش
- ✅ مدیریت محصولات و واریانت‌ها
- ✅ مدیریت سفارش‌ها و تغییر وضعیت
- ✅ ثبت کد پیگیری
- ✅ مدیریت کاربران
- ✅ تایید/رد نظرات
- ✅ مدیریت کدهای تخفیف

### فنی
- ✅ RTL کامل
- ✅ Responsive (Mobile First)
- ✅ Server Components
- ✅ Server Actions
- ✅ Type Safety
- ✅ Zod Validation
- ✅ Password Hashing (bcrypt)
- ✅ Protected Routes (Middleware)
- ✅ SEO Metadata
- ✅ Loading & Empty States
- ✅ Toast Notifications

---

## 🧪 تست‌ها

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e
```

---

## 📊 Environment Variables

| متغیر | توضیح |
|--------|-------|
| `DATABASE_URL` | آدرس اتصال PostgreSQL |
| `NEXTAUTH_URL` | آدرس سایت |
| `NEXTAUTH_SECRET` | کلید رمزنگاری NextAuth |
| `NEXT_PUBLIC_APP_URL` | آدرس عمومی سایت |
| `NEXT_PUBLIC_APP_NAME` | نام برند |

---

## 🔒 نکات امنیتی

1. رمز عبور با bcrypt (salt 12) هش می‌شود
2. قیمت نهایی از دیتابیس محاسبه می‌شود
3. موجودی در سرور بررسی می‌شود
4. Admin Routes با Middleware محافظت شده‌اند
5. Server Actions برای عملیات حساس استفاده شده
6. Input Validation با Zod در Client و Server

---

## 📄 لایسنس

این پروژه برای مقاصد آموزشی ساخته شده است.

---

پروژه دانشگاهی | طراحی و پیاده‌سازی فروشگاه اینترنتی
