import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { getSiteSetting } from "@/actions/settings";
import { SITE_NAME } from "@/lib/constants";

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

const DEFAULT_BRANDING = {
  logoUrl: "/logo.png",
};

export async function Footer() {
  const [footer, branding] = await Promise.all([
    getSiteSetting<typeof DEFAULT_FOOTER>("footer"),
    getSiteSetting<typeof DEFAULT_BRANDING>("branding"),
  ]);

  const data = footer ?? DEFAULT_FOOTER;
  const logoUrl = branding?.logoUrl || DEFAULT_BRANDING.logoUrl;

  return (
    <footer className="bg-brand-black text-white/80">
      <div className="h-1 bg-gradient-to-l from-gold via-brand-green to-gold" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-10 w-10">
                <Image
                  src={logoUrl}
                  alt={SITE_NAME}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">{SITE_NAME}</span>
            </div>
            <p className="text-sm leading-7 text-white/60">{data.about}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              {data.quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <span dir="ltr">{data.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <span dir="ltr">{data.contact.email}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                <span>{data.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {SITE_NAME}. {data.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}