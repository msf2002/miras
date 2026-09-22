import { adminGetProducts } from "@/actions/admin";
import { formatPrice, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "مدیریت محصولات" };

export default async function AdminProductsPage() {
  const products = await adminGetProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-black">محصولات</h1>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            محصول جدید
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-gray/10 bg-beige/50">
                <th className="px-6 py-4 text-right font-medium text-warm-gray">محصول</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">واریانت‌ها</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">قیمت (از)</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">موجودی</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">وضعیت</th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
                const minPrice = Math.min(...product.variants.map((v) => v.price));
                return (
                  <tr key={product.id} className="border-b border-warm-gray/5 hover:bg-beige/30">
                    <td className="px-6 py-4">
                      <p className="font-medium text-brand-black">{product.name}</p>
                      <p className="text-xs text-warm-gray">{product.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-warm-gray">{product.variants.length}</td>
                    <td className="px-6 py-4">
                      {product.variants.length > 0
                        ? formatPrice(minPrice)
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={totalStock < 10 ? "text-red-600 font-medium" : ""}>
                        {formatNumber(totalStock)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <Badge variant="success">فعال</Badge>
                      ) : (
                        <Badge variant="danger">غیرفعال</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-beige rounded-lg hover:bg-dark-beige transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        ویرایش
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
