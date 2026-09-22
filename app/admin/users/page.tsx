import { adminGetUsers } from "@/actions/admin";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { UserRoleSelector } from "./user-role-selector";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "مدیریت کاربران" };

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await adminGetUsers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-8">
        کاربران ({users.length})
      </h1>

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-gray/10 bg-beige/50">
                <th className="px-6 py-4 text-right font-medium text-warm-gray">
                  نام
                </th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">
                  ایمیل
                </th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">
                  سفارش‌ها
                </th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">
                  نظرات
                </th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">
                  تاریخ عضویت
                </th>
                <th className="px-6 py-4 text-right font-medium text-warm-gray">
                  نقش
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-warm-gray/5 hover:bg-beige/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-brand-black">
                    {user.name || "—"}
                  </td>
                  <td className="px-6 py-4 text-warm-gray" dir="ltr">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-warm-gray">
                    {user._count.orders}
                  </td>
                  <td className="px-6 py-4 text-warm-gray">
                    {user._count.reviews}
                  </td>
                  <td className="px-6 py-4 text-warm-gray">
                    {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-6 py-4">
                    <UserRoleSelector
                      userId={user.id}
                      userName={user.name}
                      currentRole={user.role}
                      isSelf={user.id === session?.user?.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}