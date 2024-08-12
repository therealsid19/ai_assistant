import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect API routes and TRPC routes
    '/api/:path*',
    '/trpc/:path*',
    // Protect all other routes except the ones that match the following patterns
    '/((?!_next/static|_next/image|favicon.ico|signin|signup|signout).*)',
  ],
};
