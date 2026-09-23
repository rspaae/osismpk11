import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const OFFICER_ROLES = [
    "ADMINISTRATOR",
    "KEPALA_SEKOLAH",
    "KESISWAAN",
    "PEMBINA",
    "BPH_OSIS",
    "BPH_MPK",
    "SEKBID_OFFICER",
    "KOMISI_OFFICER",
    // Backward compatibility aliases
    "DEWAN",
    "OSIS_OFFICER",
    "MPK_OFFICER",
];

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const userRole = token?.role as string | undefined;
        const { pathname } = req.nextUrl;

        const isStudentRoute = pathname.startsWith("/student");
        const isAdminRoute = pathname.startsWith("/admin");
        const isLoginRoute = pathname === "/login";

        // If not authenticated and trying to access protected routes
        if (!isAuth && (isStudentRoute || isAdminRoute)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Email domain check (for student emails if applicable)
        const tokenEmail = token?.email as string | null;
        const isEmailValid = !tokenEmail || tokenEmail.endsWith("@smkn11bdg.sch.id") || tokenEmail.includes("@");

        if (isAuth && !isEmailValid && !isLoginRoute) {
            return NextResponse.redirect(new URL("/login?error=restricted_domain", req.url));
        }

        // Admin/Officer route protection: must have staff or officer role
        if (isAdminRoute) {
            if (!userRole || !OFFICER_ROLES.includes(userRole)) {
                return NextResponse.redirect(new URL("/student/dashboard", req.url));
            }

            // User management is restricted to ADMINISTRATOR & KESISWAAN
            if (pathname.startsWith("/admin/users") && !["ADMINISTRATOR", "KESISWAAN"].includes(userRole)) {
                return NextResponse.redirect(new URL("/admin/aspirations", req.url));
            }
        }

        // Redirect away from login if already logged in
        if (isLoginRoute && isAuth && isEmailValid) {
            if (userRole && OFFICER_ROLES.includes(userRole)) {
                return NextResponse.redirect(new URL("/admin", req.url));
            }
            return NextResponse.redirect(new URL("/student/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        secret: process.env.NEXTAUTH_SECRET || "osim11-secret-key-development-smkn11bdg-2026-auth",
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                if (pathname.startsWith("/student") || pathname.startsWith("/admin")) {
                    return !!token;
                }
                return true;
            },
        },
    }
);

export const config = {
    matcher: ["/student/:path*", "/admin/:path*", "/login"],
};
