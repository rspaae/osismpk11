import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "@/components/Providers";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: 'swap',
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
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
        <html lang="id">
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased selection:bg-brand-accent selection:text-brand-primary`}>
                <NextAuthProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </NextAuthProvider>
            </body>
        </html>
    );
}
