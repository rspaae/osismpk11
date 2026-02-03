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

        const tokenEmail = token?.email as string | null;
        const isEmailValid = !tokenEmail || tokenEmail.endsWith("@smkn11bdg.sch.id");

        if (isLoginRoute && isAuth && isEmailValid) {
            return NextResponse.redirect(new URL("/student/dashboard", req.url));
        }

        // Domain restriction check for students
        if (isAuth && !isEmailValid && !isLoginRoute) {
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
