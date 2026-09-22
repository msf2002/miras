import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

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
