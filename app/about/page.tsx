import { Gem, Phone, Mail, MapPin } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { getSiteSetting } from "@/actions/settings";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = {
  title: "درباره ما",
  description: `درباره فروشگاه ${SITE_NAME} - تجلی نام‌های مقدس در هنر ایرانی`,
};

const DEFAULT_ABOUT = {
  title: `درباره ${SITE_NAME}`,
  paragraphs: [
    "میراث نور با هدف زنده نگه داشتن هنر خوشنویسی و مجسمه‌سازی ایرانی و ترکیب آن با طراحی مدرن تاسیس شده است.",
    "ما معتقدیم هنر اسلامی و ایرانی گنجینه‌ای بی‌پایان از زیبایی و معنویت است که می‌تواند در قالب‌های مدرن و امروزی نیز تجلی یابد. تندیس‌های میراث نور حاصل ماه‌ها تحقیق و طراحی توسط هنرمندان ماهر ایرانی هستند.",
    "هر تندیس با دقت و ظرافت فراوان و با استفاده از بهترین مواد اولیه ساخته می‌شود. هدف ما ارائه آثار هنری است که هم از نظر بصری زیبا و هم از نظر معنوی غنی باشند.",
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

export default async function AboutPage() {
  const [about, guide, contact] = await Promise.all([
    getSiteSetting<typeof DEFAULT_ABOUT>("about"),
    getSiteSetting<typeof DEFAULT_GUIDE>("guide"),
    getSiteSetting<typeof DEFAULT_CONTACT>("contact"),
  ]);

  const aboutData = about ?? DEFAULT_ABOUT;
  const guideData = guide ?? DEFAULT_GUIDE;
  const contactData = contact ?? DEFAULT_CONTACT;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* هدر با آیکون */}
      <div className="text-center mb-12">
        <div className="mb-4 flex justify-center">
          <div className="h-px w-12 bg-gold" />
          <div className="mx-3">
            <Gem className="h-5 w-5 text-gold" />
          </div>
          <div className="h-px w-12 bg-gold" />
        </div>
        <h1 className="text-3xl font-bold text-brand-black mb-4">
          {aboutData.title}
        </h1>
      </div>

      {/* پاراگراف‌ها */}
      <div className="prose prose-lg max-w-none text-warm-gray leading-8 space-y-6">
        {aboutData.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* راهنمای خرید */}
      <section
        id="guide"
        className="mt-16 pt-12 border-t border-warm-gray/10"
      >
        <h2 className="text-2xl font-bold text-brand-black mb-6">
          {guideData.title}
        </h2>
        <div className="space-y-4 text-warm-gray leading-7">
          {guideData.steps.map((step, i) => (
            <p key={i}>
              {toPersianNumber(i + 1)}. {step}
            </p>
          ))}
        </div>
      </section>

      {/* تماس با ما */}
      <section
        id="contact"
        className="mt-16 pt-12 border-t border-warm-gray/10"
      >
        <h2 className="text-2xl font-bold text-brand-black mb-6">
          {contactData.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-card shadow-card p-6 text-center">
            <Phone className="h-6 w-6 text-brand-green mx-auto mb-3" />
            <p className="font-medium text-brand-black mb-1">تلفن</p>
            <p className="text-sm text-warm-gray" dir="ltr">
              {contactData.phone}
            </p>
          </div>
          <div className="bg-white rounded-card shadow-card p-6 text-center">
            <Mail className="h-6 w-6 text-brand-green mx-auto mb-3" />
            <p className="font-medium text-brand-black mb-1">ایمیل</p>
            <p className="text-sm text-warm-gray" dir="ltr">
              {contactData.email}
            </p>
          </div>
          <div className="bg-white rounded-card shadow-card p-6 text-center">
            <MapPin className="h-6 w-6 text-brand-green mx-auto mb-3" />
            <p className="font-medium text-brand-black mb-1">آدرس</p>
            <p className="text-sm text-warm-gray">{contactData.address}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function toPersianNumber(num: number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .split("")
    .map((d) => persianDigits[parseInt(d)] || d)
    .join("");
}