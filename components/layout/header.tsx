"use client";

import { signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useCartStore } from "@/hooks/use-cart-store";
import type { Session } from "next-auth";

interface HeaderProps {
  session: Session | null;
  cartItemCount: number;
  logoUrl: string;
}

export function Header({ session, cartItemCount, logoUrl }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const userMenuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(event.target as Node)
    ) {
      setUserMenuOpen(false);
    }
  }
  if (userMenuOpen) {
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }
}, [userMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-warm-gray/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-beige rounded-card transition-colors"
            aria-label="منو"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-10 w-10">
              <Image
                src={logoUrl}
                alt={SITE_NAME}
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:block text-xl font-bold text-brand-black group-hover:text-brand-green transition-colors">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="منوی اصلی"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-card text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-brand-green/10 text-brand-green"
                    : "text-warm-gray hover:text-brand-black hover:bg-beige"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 hover:bg-beige rounded-card transition-colors"
              aria-label="جستجو"
            >
              <Search className="h-5 w-5 text-warm-gray" />
            </button>

            {/* User */}
            {session?.user ? (
  <div className="relative" ref={userMenuRef}>
    <button
      type="button"
      onClick={() => setUserMenuOpen(!userMenuOpen)}
      className="p-2.5 hover:bg-beige rounded-card transition-colors flex items-center gap-2"
      aria-label="حساب کاربری"
    >
      <User className="h-5 w-5 text-warm-gray" />
      <span className="hidden md:block text-sm text-warm-gray">
        {session.user.name?.split(" ")[0]}
      </span>
    </button>

    <div
      className={cn(
        "absolute left-0 top-full mt-1 w-48 bg-white rounded-card shadow-card-hover border border-warm-gray/10 transition-all duration-200 z-50",
        userMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}
    >
      <div className="p-2">
        <button
          type="button"
          onClick={async () => {
            setUserMenuOpen(false);
            try {
              await signOut({ redirect: false });
            } catch (err) {
              console.error(err);
            }
            window.location.href = "/login";
          }}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          خروج
        </button>

        <hr className="my-1 border-warm-gray/10" />

        <Link
          href="/account/profile"
          onClick={() => setUserMenuOpen(false)}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-beige transition-colors"
        >
          <User className="h-4 w-4" />
          پروفایل
        </Link>
        <Link
          href="/account/orders"
          onClick={() => setUserMenuOpen(false)}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-beige transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          سفارش‌ها
        </Link>
        <Link
          href="/account/wishlist"
          onClick={() => setUserMenuOpen(false)}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-beige transition-colors"
        >
          <Heart className="h-4 w-4" />
          علاقه‌مندی‌ها
        </Link>
        {session.user.role === "ADMIN" && (
          <Link
            href="/admin"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-beige transition-colors text-brand-green"
          >
            <LayoutDashboard className="h-4 w-4" />
            پنل مدیریت
          </Link>
        )}
      </div>
    </div>
  </div>
) : (
  <Link
    href="/login"
    className="p-2.5 hover:bg-beige rounded-card transition-colors"
    aria-label="ورود"
  >
    <User className="h-5 w-5 text-warm-gray" />
  </Link>
)}:(
              <Link
                href="/login"
                className="p-2.5 hover:bg-beige rounded-card transition-colors"
                aria-label="ورود"
              >
                <User className="h-5 w-5 text-warm-gray" />
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 hover:bg-beige rounded-card transition-colors"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="h-5 w-5 text-warm-gray" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">
                  {cartItemCount > 9 ? "+۹" : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی تندیس..."
                className="w-full rounded-card border border-warm-gray/30 bg-white px-4 py-3 pr-12 text-brand-black placeholder:text-warm-gray/50 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green/30"
                autoFocus
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-warm-gray/10 bg-ivory animate-fade-in">
          <nav className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-card text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-brand-green/10 text-brand-green"
                    : "text-warm-gray hover:text-brand-black hover:bg-beige"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
