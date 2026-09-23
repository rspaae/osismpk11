import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";
import { NextAuthProvider } from "@/components/Providers";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-jakarta",
    display: 'swap',
});

export const metadata: Metadata = {
    title: "OSIS-MPK SMKN 11 Bandung | Official Website",
    description: "Wadah inspirasi, kolaborasi, dan aksi nyata siswa SMKN 11 Bandung.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={`${jakarta.variable} font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950`}
            >
                <NextAuthProvider>
                    <ConditionalShell>
                        {children}
                    </ConditionalShell>
                </NextAuthProvider>
            </body>
        </html>
    );
}
