"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingActionWidget from "@/components/FloatingActionWidget";

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    return (
        <>
            <ScrollProgress />
            {!isAdminRoute && <Navbar />}
            {children}
            {!isAdminRoute && <FloatingActionWidget />}
            {!isAdminRoute && <Footer />}
        </>
    );
}
