import { getUserAddresses } from "@/actions/address";
import { AddressesClient } from "./addresses-client";
import type { Metadata } from "next";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata: Metadata = { title: "آدرس‌ها" };

export default async function AddressesPage() {
  const addresses = await getUserAddresses();
  return <AddressesClient addresses={addresses} />;
}
