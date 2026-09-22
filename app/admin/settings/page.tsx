import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "تنظیمات" };

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-8">تنظیمات</h1>
      <div className="bg-white rounded-card shadow-card p-6">
        <p className="text-warm-gray">
          تنظیمات سایت در نسخه‌های آینده اضافه خواهد شد.
        </p>
      </div>
    </div>
  );
}
