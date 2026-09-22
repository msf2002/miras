import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("fa-IR").format(num);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MN-${timestamp}-${random}`;
}

export function generateSKU(
  productName: string,
  sizeName: string,
  colorName: string
): string {
  const p = productName.substring(0, 3).toUpperCase();
  const s = sizeName.substring(0, 2).toUpperCase();
  const c = colorName.substring(0, 2).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `MN-${p}-${s}-${c}-${rand}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function slugify(text: string): string {
  return text
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export const SHIPPING_COST = 50000; // 50,000 تومان
export const FREE_SHIPPING_THRESHOLD = 2000000; // 2,000,000 تومان
