import { getSiteSetting } from "@/actions/settings";
import { ContentForm } from "./content-form";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "مدیریت محتوا" };

const DEFAULT_HOME = {
  hero: {
    title: "تندیس‌هایی از نور و ایمان",
    subtitle: "تجلی نام‌های مقدس در هنر ایرانی",
    ctaText: "مشاهده مجموعه",
    ctaLink: "/shop",
    bannerUrl: "",  
    
  },
  features: [
    { title: "ساخته‌شده با دست هنرمند", description: "هر تندیس توسط هنرمندان ماهر ایرانی با دقت و ظرافت ساخته می‌شود" },
    { title: "بسته‌بندی ویژه", description: "بسته‌بندی لوکس و ایمن برای محافظت کامل از اثر هنری شما" },
    { title: "تضمین کیفیت", description: "ضمانت اصالت و کیفیت تمام محصولات با امکان بازگشت" },
    { title: "ارسال سریع", description: "ارسال به سراسر ایران با بسته‌بندی امن و پیگیری آنلاین" },
  ],
  featured: { title: "تندیس‌های محبوب", subtitle: "منتخب آثار هنری میراث نور" },
  cta: {
    title: "هدیه‌ای از جنس ایمان",
    description: "تندیس‌های میراث نور، هدیه‌ای ماندگار و معنادار برای عزیزانتان. هر تندیس روایتگر داستانی از عشق، ایمان و هنر ایرانی است.",
    buttonText: "مشاهده مجموعه هدایا",
    buttonLink: "/shop",
  },
  story: {
    title: "داستان میراث نور",
    paragraphs: [
      "میراث نور با هدف زنده نگه داشتن هنر خوشنویسی و مجسمه‌سازی ایرانی تاسیس شده است.",
      "هر تندیس میراث نور حاصل ماه‌ها تحقیق، طراحی و ساخت دستی توسط هنرمندان ماهر ایرانی است.",
    ],
  },
};

const DEFAULT_ABOUT = {
  title: "درباره میراث نور",
  paragraphs: [
    "میراث نور با هدف زنده نگه داشتن هنر خوشنویسی و مجسمه‌سازی ایرانی و ترکیب آن با طراحی مدرن تاسیس شده است.",
    "ما معتقدیم هنر اسلامی و ایرانی گنجینه‌ای بی‌پایان از زیبایی و معنویت است.",
    "هر تندیس با دقت و ظرافت فراوان و با استفاده از بهترین مواد اولیه ساخته می‌شود.",
  ],
};

const DEFAULT_GUIDE = {
  title: "راهنمای خرید",
  steps: [
    "محصول مورد نظر خود را انتخاب کنید و سایز و رنگ دلخواه را مشخص کنید.",
    "محصول را به سبد خرید اضافه کنید.",
    "آدرس ارسال خود را ثبت کنید.",
    "در صورت داشتن کد تخفیف، آن را وارد کنید.",
    "پرداخت را انجام دهید.",
    "سفارش شما پس از تایید پرداخت پردازش و ارسال خواهد شد.",
  ],
};

const DEFAULT_CONTACT = {
  title: "تماس با ما",
  address: "تهران، خیابان ولیعصر",
  email: "info@mirasnoor.ir",
  phone: "۰۲۱-۱۲۳۴۵۶۷۸",
};

const DEFAULT_FOOTER = {
  about:
    "تجلی نام‌های مقدس در هنر ایرانی. تندیس‌هایی که با عشق و ایمان توسط هنرمندان ایرانی خلق می‌شوند.",
  quickLinks: [
    { label: "صفحه اصلی", href: "/" },
    { label: "فروشگاه", href: "/shop" },
    { label: "درباره ما", href: "/about" },
    { label: "حساب کاربری", href: "/account" },
  ],
  contact: {
    phone: "09133013630",
    email: "info@mirasnoor.ir",
    address: "اصفهان، دولت آباد",
  },
  copyright: "تمامی حقوق محفوظ است.",
};

// ─── هویت بصری (NEW) ───────────────────────────────────
const DEFAULT_BRANDING = {
  logoUrl: "/logo.png",
};

export default async function AdminContentPage() {
  const [home, about, guide, contact, footer, branding] = await Promise.all([
    getSiteSetting<typeof DEFAULT_HOME>("home"),
    getSiteSetting<typeof DEFAULT_ABOUT>("about"),
    getSiteSetting<typeof DEFAULT_GUIDE>("guide"),
    getSiteSetting<typeof DEFAULT_CONTACT>("contact"),
    getSiteSetting<typeof DEFAULT_FOOTER>("footer"),
    getSiteSetting<typeof DEFAULT_BRANDING>("branding"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-8">
        مدیریت محتوای صفحات
      </h1>
      <ContentForm
        initialHome={home ?? DEFAULT_HOME}
        initialAbout={about ?? DEFAULT_ABOUT}
        initialGuide={guide ?? DEFAULT_GUIDE}
        initialContact={contact ?? DEFAULT_CONTACT}
        initialFooter={footer ?? DEFAULT_FOOTER}
        initialBranding={branding ?? DEFAULT_BRANDING}
      />
    </div>
  );
}