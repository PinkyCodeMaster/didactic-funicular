import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

type Session = {
    user: {
        id: string;
        email: string;
        name: string;
        emailVerified: boolean;
    };
} | null;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define route categories
    const authRoutes = ['/sign-in', '/login', '/sign-up', '/register', '/forgot-password'];
    const protectedRoutes = ['/account', '/dashboard', '/profile'];

    const isAuthRoute = authRoutes.includes(pathname);
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Get session from your backend with error handling
    let session: Session = null;

    try {
        const response = await betterFetch<Session>("/api/auth/get-session", {
            baseURL: "http://localhost:9000", // Use HTTP not HTTPS
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
            timeout: 5000, // 5 second timeout
        });
        session = response.data;
    } catch (error) {
        console.error("Failed to fetch session:", error);

        // Fallback: check for session cookie as backup
        const sessionToken = request.cookies.get('better-auth.session_token');
        if (sessionToken) {
            // If we have a session token but can't verify it, allow access but log the issue
            console.warn("Backend unreachable, using cookie fallback");
            session = { user: { id: "unknown", email: "unknown", name: "unknown", emailVerified: false } };
        }
    }

    // If user is logged in
    if (session) {
        // Redirect authenticated users away from auth pages to account
        if (isAuthRoute) {
            return NextResponse.redirect(new URL('/account', request.url));
        }
        // Allow access to protected routes and public routes
        return NextResponse.next();
    }

    // If user is not logged in
    if (!session) {
        // Redirect unauthenticated users from protected routes to sign-in
        if (isProtectedRoute) {
            const loginUrl = new URL('/sign-in', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
        // Allow access to auth routes and public routes
        return NextResponse.next();
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};