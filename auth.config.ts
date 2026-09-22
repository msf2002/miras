import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [], // providers توی lib/auth.ts اضافه می‌شن
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        (session.user as any).role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as any)?.role === "ADMIN";
      const pathname = nextUrl.pathname;

      const protectedPaths = ["/account", "/cart", "/checkout"];
      const adminPaths = ["/admin"];

      if (protectedPaths.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      if (
        adminPaths.some((p) => pathname.startsWith(p)) &&
        (!isLoggedIn || !isAdmin)
      ) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      if (
        (pathname === "/login" || pathname === "/register") &&
        isLoggedIn
      ) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;