import { NextRequest, NextResponse } from "next/server";

// List of public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/verify-otp",
  "/auth/forgot-password",
  "/tarifs",
  "/boutique",
  "/help",
  "/legal/terms",
  "/legal/privacy",
];

// Public routes are intentionally listed for future auth enforcement.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _publicRoutes = publicRoutes;

// List of routes that require authentication
const privateRoutes = [
  "/settings",
  "/commander",
  "/commands",
  "/track",
  "/admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is private
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute) {
    // You would check for auth token here
    // For now, we'll just allow it to pass through
    // In production, you'd validate the session
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
