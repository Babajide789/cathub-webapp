import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    const isOnboardingRoute = pathname.startsWith("/onboarding");
    const isAuthRoute = pathname.startsWith("/auth");
    const isApiRoute = pathname.startsWith("/api");

    // Already onboarded — don't let them back into onboarding
    if (token?.hasOnboarded && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // Signed in but not onboarded — push to onboarding
    if (token && !token.hasOnboarded && !isOnboardingRoute && !isAuthRoute && !isApiRoute) {
      return NextResponse.redirect(new URL("/onboarding/step-1", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/profile",  
    "/onboarding/:path*",
    "/checkout/:path*",
    "/listing/new/:path*",
    "/adoption/new/:path*",
    "/mating/new/:path*",
    "/booking/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
  ],
};