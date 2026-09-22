import Link from "next/link";
import { ArrowLeft, Gem, Package, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { getFeaturedProducts } from "@/actions/products";
import { getUserWishlistIds } from "@/actions/wishlist";
import { getSiteSetting } from "@/actions/settings";
import { SITE_NAME } from "@/lib/constants";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

// آیکون‌ها ثابت هستن (چون قابل ذخیره در دیتابیس نیستن)
const FEATURE_ICONS = [Gem, Package, Shield, Truck];

// ─── مقادیر پیش‌فرض (اگه دیتابیس خالی بود) ────────────
const DEFAULT_HOME = {
  hero: {
    title: "تندیس‌هایی از نور و ایمان",
    subtitle: "تجلی نام‌های مقدس در هنر ایرانی",
    ctaText: "مشاهده مجموعه",
    ctaLink: "/shop",
    bannerUrl: "", // ← بنر Hero (اختیاری)
  },
  features: [
    {
      title: "ساخته‌شده با دست هنرمند",
      description:
        "هر تندیس توسط هنرمندان ماهر ایرانی با دقت و ظرافت ساخته می‌شود",
    },
    {
      title: "بسته‌بندی ویژه",
      description: "بسته‌بندی لوکس و ایمن برای محافظت کامل از اثر هنری شما",
    },
    {
      title: "تضمین کیفیت",
      description: "ضمانت اصالت و کیفیت تمام محصولات با امکان بازگشت",
    },
    {
      title: "ارسال سریع",
      description: "ارسال به سراسر ایران با بسته‌بندی امن و پیگیری آنلاین",
    },
  ],
  featured: {
    title: "تندیس‌های محبوب",
    subtitle: "منتخب آثار هنری میراث نور",
  },
  cta: {
    title: "هدیه‌ای از جنس ایمان",
    description:
      "تندیس‌های میراث نور، هدیه‌ای ماندگار و معنادار برای عزیزانتان. هر تندیس روایتگر داستانی از عشق، ایمان و هنر ایرانی است.",
    buttonText: "مشاهده مجموعه هدایا",
    buttonLink: "/shop",
  },
  story: {
    title: `داستان ${SITE_NAME}`,
    paragraphs: [
      "میراث نور با هدف زنده نگه داشتن هنر خوشنویسی و مجسمه‌سازی ایرانی تاسیس شده است. ما معتقدیم که هنر می‌تواند پلی باشد بین سنت و مدرنیته، بین ایمان و زیبایی.",
      "هر تندیس میراث نور حاصل ماه‌ها تحقیق، طراحی و ساخت دستی توسط هنرمندان ماهر ایرانی است. ما تلاش می‌کنیم تا با ترکیب هنر سنتی و طراحی مینیمال مدرن، آثاری خلق کنیم که هم از نظر بصری زیبا و هم از نظر معنوی غنی باشند.",
    ],
  },
};

export default async function HomePage() {
  const [home, products, wishlistIds] = await Promise.all([
    getSiteSetting<typeof DEFAULT_HOME>("home"),
    getFeaturedProducts(),
    getUserWishlistIds(),
  ]);

  const data = home ?? DEFAULT_HOME;
  const bannerUrl = data.hero.bannerUrl || "";

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-beige to-ivory">
        {/* 🎨 بنر به‌عنوان background (اگه آپلود شده) */}
        {bannerUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay تیره برای خوانایی متن */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          </>
        )}

        {/* اگه بنر نباشه، الگوی پیش‌فرض */}
        {!bannerUrl && <div className="absolute inset-0 pattern-bg" />}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Decorative element */}
          <div className="mb-6 flex justify-center">
            <div className="h-px w-16 bg-gold" />
            <div className="mx-4">
              <Gem className="h-5 w-5 text-gold" />
            </div>
            <div className="h-px w-16 bg-gold" />
          </div>

          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${
              bannerUrl ? "text-white drop-shadow-lg" : "text-brand-black"
            }`}
          >
            {data.hero.title}
          </h1>
          <p
            className={`text-lg mb-8 max-w-2xl mx-auto ${
              bannerUrl
                ? "text-white/90 drop-shadow-md"
                : "text-warm-gray"
            }`}
          >
            {data.hero.subtitle}
          </p>

          <Link href={data.hero.ctaLink}>
            <Button size="lg" className="group">
              {data.hero.ctaText}
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust / Features */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.features.map((feature, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <div key={i} className="text-center group">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 group-hover:bg-brand-green/20 transition-colors">
                    <Icon className="h-6 w-6 text-brand-green" />
                  </div>
                  <h3 className="font-bold text-brand-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-warm-gray leading-6">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-black mb-3">
              {data.featured.title}
            </h2>
            <p className="text-warm-gray">{data.featured.subtitle}</p>
          </div>

          <ProductGrid products={products} wishlistIds={wishlistIds} />

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="outline" size="lg">
                مشاهده همه محصولات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gift Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-px w-16 bg-gold/50" />
            <div className="mx-4">
              <Gem className="h-5 w-5 text-gold" />
            </div>
            <div className="h-px w-16 bg-gold/50" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            {data.cta.title}
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 leading-7">
            {data.cta.description}
          </p>
          <Link href={data.cta.buttonLink}>
            <Button variant="secondary" size="lg">
              {data.cta.buttonText}
            </Button>
          </Link>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-black mb-6">
              {data.story.title}
            </h2>
            {data.story.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-warm-gray leading-8 mb-4 last:mb-0"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}