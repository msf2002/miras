import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSiteSetting } from "@/actions/settings";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

const vazirmatn = localFont({
  src: [
    { path: "../public/fonts/Vazirmatn-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Vazirmatn-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Vazirmatn-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

// ─── متادیتای داینامیک (شامل favicon) ─────────────────
export async function generateMetadata(): Promise<Metadata> {
  const branding = await getSiteSetting<{ logoUrl: string }>("branding");
  const logoUrl = branding?.logoUrl || "/logo.png";

  return {
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    icons: {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl,
    },
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      locale: "fa_IR",
      type: "website",
      images: [{ url: logoUrl }],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  let cartItemCount = 0;
  if (session?.user?.id) {
    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    });
    cartItemCount =
      cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  const branding = await getSiteSetting<{ logoUrl: string }>("branding");
  const logoUrl = branding?.logoUrl || "/logo.png";

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Header
          session={session}
          cartItemCount={cartItemCount}
          logoUrl={logoUrl}
        />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}