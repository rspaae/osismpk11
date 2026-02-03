import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isStudentRoute = req.nextUrl.pathname.startsWith("/student");
        const isLoginRoute = req.nextUrl.pathname === "/login";

        if (isStudentRoute && !isAuth) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (isLoginRoute && isAuth) {
            return NextResponse.redirect(new URL("/student/dashboard", req.url));
        }

        // Domain restriction check for students
        if (isAuth && token?.email && !token.email.endsWith("@smkn11bdg.sch.id")) {
            // Technically this should be handled at login time, but as a fallback:
            return NextResponse.redirect(new URL("/login?error=restricted_domain", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // If it's a student route, we need a token
                if (req.nextUrl.pathname.startsWith("/student")) {
                    return !!token;
                }
                return true;
            },
        },
    }
);

export const config = {
    matcher: ["/student/:path*", "/login"],
};
