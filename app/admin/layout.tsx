import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Tag,
  Settings,
  ArrowRight,
} from "lucide-react";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

const ADMIN_LINKS = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/reviews", label: "نظرات", icon: MessageSquare },
  { href: "/admin/coupons", label: "تخفیف‌ها", icon: Tag },
  { href: "/admin/content", label: "مدیریت محتوا", icon: FileText }
];


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-beige/50">
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block bg-brand-black text-white min-h-screen sticky top-0">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                بازگشت به سایت
              </span>
            </Link>
            <h2 className="text-lg font-bold mb-8">پنل مدیریت</h2>
            <nav className="space-y-1">
              {ADMIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="lg:hidden bg-brand-black text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <span className="font-bold text-sm">پنل مدیریت</span>
          <div className="flex gap-2">
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="p-2 rounded-lg hover:bg-white/10"
                title={link.label}
              >
                <link.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
