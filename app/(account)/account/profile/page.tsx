import { getUserProfile } from "@/actions/profile";
import { ProfileForm } from "./profile-form";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "پروفایل" };

export default async function ProfilePage() {
  const profile = await getUserProfile();
  if (!profile) return null;

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <h2 className="text-lg font-bold text-brand-black mb-6">اطلاعات شخصی</h2>
      <ProfileForm profile={profile} />
    </div>
  );
}
