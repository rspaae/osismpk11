import type { NextConfig } from "next";

const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    img-src 'self' data: https: http: blob:;
    connect-src 'self' https: http: ws: wss:;
    frame-src 'none';
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
    {
        key: "Content-Security-Policy",
        value: ContentSecurityPolicy,
    },
    {
        key: "X-DNS-Prefetch-Control",
        value: "on",
    },
    {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
    },
    {
        key: "X-Frame-Options",
        value: "DENY", // Mencegah website dimasukkan iframe oleh situs judol/phishing
    },
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "X-XSS-Protection",
        value: "1; mode=block",
    },
    {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
    },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    },
];

const nextConfig: NextConfig = {
    reactCompiler: true,
    poweredByHeader: false, // Menyembunyikan header 'X-Powered-By: Next.js' untuk mempersulit footprinting
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
