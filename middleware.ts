//middleware.ts
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth, req, evt) {
    const isAuthenticated = !!auth.userId;
    const isHomePage = req.nextUrl.pathname === "/";

    if (isAuthenticated && isHomePage) {
      return NextResponse.redirect(new URL("/user", req.url));
    }

    if (!isAuthenticated && !isHomePage) {
      const signInUrl = new URL("/", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};
