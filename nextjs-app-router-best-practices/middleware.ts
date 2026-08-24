import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that do not require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/api/auth/login'];

/**
 * Edge-level middleware to enforce centralized route security and authentication.
 * Prevents unauthenticated users from accessing protected app shells.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve session token from cookies
  const token = request.cookies.get('session_token')?.value;

  // Check if the current route is marked public
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Redirect unauthenticated users trying to access secure internal routes
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    // Persist the original target URL to redirect the user back post-login
    loginUrl.searchParams.set('redirect_to', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect logged-in users away from onboarding or public gate-keeping routes
  if (token && isPublicRoute && pathname !== '/api/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed uninterrupted
  return NextResponse.next();
}

/**
 * Configure the specific route matchers for performance optimization.
 * Prevents the middleware loop from intercepting static files or assets.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
