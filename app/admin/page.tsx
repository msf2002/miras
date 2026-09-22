import { getDashboardStats } from "@/actions/admin";
import { formatPrice, formatNumber } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Package,
} from "lucide-react";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "داشبورد مدیریت" };

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "کاربران",
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "سفارش‌ها",
      value: formatNumber(stats.totalOrders),
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      label: "فروش کل",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-gold",
    },
    {
      label: "سفارش‌های جدید",
      value: formatNumber(stats.newOrders),
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      label: "کم‌موجودی",
      value: formatNumber(stats.lowStockProducts),
      icon: AlertTriangle,
      color: "bg-red-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-8">داشبورد</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-card shadow-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-warm-gray">{card.label}</span>
              <div
                className={`${card.color} p-2 rounded-lg`}
              >
                <card.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-xl font-bold text-brand-black">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="text-lg font-bold text-brand-black mb-4">
            محصولات پرفروش
          </h2>
          <div className="space-y-3">
            {stats.topProducts.map((product, idx) => (
              <div
                key={product.name}
                className="flex items-center justify-between py-2 border-b border-warm-gray/10 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-green/10 text-xs font-bold text-brand-green">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-brand-black">{product.name}</span>
                </div>
                <span className="text-sm font-medium text-warm-gray">
                  {product.sales} فروش
                </span>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-sm text-warm-gray">هنوز فروشی ثبت نشده</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="text-lg font-bold text-brand-black mb-4">
            آخرین سفارش‌ها
          </h2>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-warm-gray/10 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-brand-black">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-warm-gray">
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">
                    {formatPrice(order.total)}
                  </p>
                  <Badge
                    variant={
                      order.status === "DELIVERED"
                        ? "success"
                        : order.status === "CANCELLED"
                          ? "danger"
                          : "default"
                    }
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <p className="text-sm text-warm-gray">سفارشی ثبت نشده</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
