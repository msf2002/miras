import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";

  // Protected routes
  const protectedPaths = ["/account", "/cart", "/checkout"];
  const adminPaths = ["/admin"];

  // Redirect to login if accessing protected routes
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect non-admins from admin routes
  if (adminPaths.some((p) => pathname.startsWith(p)) && (!isLoggedIn || !isAdmin)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect logged-in users from auth pages
  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/account/:path*",
    "/cart",
    "/checkout",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
