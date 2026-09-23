"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

interface NavItem {
    name: string;
    href: string;
    icon: (isActive: boolean) => React.ReactNode;
    badge?: string;
    roles?: string[];
    divisions?: string[];
    customCheck?: (user: any) => boolean;
}

const navItems: NavItem[] = [
    {
        name: "Ringkasan",
        href: "/admin",
        icon: (active) => (
            <svg className={`w-4 h-4 ${active ? "text-white" : "text-[#5f7167] dark:text-[#a5b8ad]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        name: "Publikasi Dokumentasi",
        href: "/admin/activities",
        icon: (active) => (
            <svg className={`w-4 h-4 ${active ? "text-white" : "text-[#5f7167] dark:text-[#a5b8ad]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
    },
    {
        name: "Kotak Aspirasi",
        href: "/admin/aspirations",
        icon: (active) => (
            <svg className={`w-4 h-4 ${active ? "text-white" : "text-[#5f7167] dark:text-[#a5b8ad]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
        customCheck: (user) => {
            if (!user) return false;
            const r = user.role;
            const d = user.division;
            return ["ADMINISTRATOR", "KESISWAAN", "PEMBINA", "KEPALA_SEKOLAH", "BPH_MPK", "BPH_OSIS"].includes(r) || d === "KOMISI_B";
        },
    },
    {
        name: "Program Kerja",
        href: "/admin/work-programs",
        icon: (active) => (
            <svg className={`w-4 h-4 ${active ? "text-white" : "text-[#5f7167] dark:text-[#a5b8ad]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
    },
    {
        name: "Presensi & Kegiatan",
        href: "/admin/attendance/sekbid",
        icon: (active) => (
            <svg className={`w-4 h-4 ${active ? "text-white" : "text-[#5f7167] dark:text-[#a5b8ad]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        customCheck: (user) => {
            if (!user) return false;
            const r = user.role;
            const d = user.division;
            return ["ADMINISTRATOR", "KESISWAAN", "PEMBINA", "KEPALA_SEKOLAH", "BPH_OSIS", "BPH_MPK"].includes(r) || d === "SEKBID_2" || d === "SEKBID_6";
        },
    },
    {
        name: "Tugas Pengurus",
        href: "/admin/tasks",
        icon: (active) => (
            <svg className={`w-4 h-4 ${active ? "text-white" : "text-[#5f7167] dark:text-[#a5b8ad]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
    {
        name: "Kelola Pengguna",
        href: "/admin/users",
        icon: (active) => (
            <svg className={`w-4 h-4 ${active ? "text-white" : "text-[#5f7167] dark:text-[#a5b8ad]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        roles: ["ADMINISTRATOR", "KESISWAAN", "PEMBINA"],
    },
    {
        name: "Pelanggaran Siswa",
        href: "/admin/violations",
        icon: (active) => (
            <svg className={`w-4 h-4 ${active ? "text-white" : "text-[#5f7167] dark:text-[#a5b8ad]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        customCheck: (user) => {
            if (!user) return false;
            const r = user.role;
            const d = user.division;
            return ["ADMINISTRATOR", "KESISWAAN", "PEMBINA", "BPH_OSIS", "BPH_MPK"].includes(r) || d === "SEKBID_7";
        },
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const user = session?.user;
    const userRole = (user?.role as string) || "GUEST";

    const filteredNavItems = navItems.filter((item) => {
        if (item.customCheck) {
            return item.customCheck(user);
        }
        if (item.roles && !item.roles.includes(userRole)) {
            return false;
        }
        return true;
    });

    return (
        <div
            suppressHydrationWarning
            className="min-h-screen bg-[#f5f8f6] dark:bg-[#121915] text-[#2c3831] dark:text-[#dce6e0] flex flex-col md:flex-row font-sans"
        >
            {/* Mobile Header Bar */}
            <div className="md:hidden sticky top-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#19241f]/95 backdrop-blur-md border-b border-[#e3ece6] dark:border-[#24342c] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                        <Image
                            src="/images/logos/smkn11.jpg"
                            alt="Logo SMKN 11"
                            width={26}
                            height={26}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-[#202924] dark:text-[#f0f5f2] leading-tight">Panel Pengurus</div>
                        <div className="text-[10px] text-[#468366] dark:text-[#a3d4bd] font-medium">OSIS & MPK SMKN 11</div>
                    </div>
                </div>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 rounded-xl bg-[#f0f5f2] dark:bg-[#1f2d26] text-[#2c3831] dark:text-[#dce6e0] border border-[#e3ece6] dark:border-[#24342c] text-xs font-semibold"
                >
                    {isMobileOpen ? "Tutup ✕" : "Menu ☰"}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-[#19241f] border-r border-[#e3ece6] dark:border-[#24342c] flex flex-col transition-transform duration-300 shrink-0 ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                {/* Brand Header */}
                <div className="p-5 border-b border-[#e3ece6] dark:border-[#24342c]">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] p-1 flex items-center justify-center shadow-xs group-hover:border-[#468366]/40 transition-colors overflow-hidden shrink-0">
                            <Image
                                src="/images/logos/smkn11.jpg"
                                alt="SMKN 11 Bandung"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-[#202924] dark:text-[#f0f5f2] tracking-tight leading-none">
                                OSIS - MPK
                            </div>
                            <div className="text-[10px] font-semibold text-[#468366] dark:text-[#a3d4bd] uppercase tracking-wider mt-1">
                                SMKN 11 Bandung
                            </div>
                        </div>
                    </Link>

                    {/* Active Cabinet Badge */}
                    <div className="mt-3.5 px-3 py-2 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] flex items-center justify-between">
                        <div>
                            <div className="text-[9px] text-[#718579] dark:text-[#8ba093] font-medium uppercase tracking-wider">Kepengurusan Aktif</div>
                            <div className="text-[11px] font-semibold text-[#2c3831] dark:text-[#dce6e0]">Periode 2026/2027</div>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-[#468366]" />
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-[#8b9e93] dark:text-[#697c71] uppercase">
                        Menu Navigasi
                    </div>
                    {filteredNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                    isActive
                                        ? "bg-[#468366] text-white font-semibold shadow-xs"
                                        : "text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#202924] dark:hover:text-[#f0f5f2] hover:bg-[#f2f6f3] dark:hover:bg-[#1e2a23]"
                                }`}
                            >
                                <span className="shrink-0">{item.icon(isActive)}</span>
                                <span className="flex-1 truncate">{item.name}</span>
                                {item.badge && (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-[#e8f2ec] text-[#396953]">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile & Actions Footer */}
                <div className="p-3.5 border-t border-[#e3ece6] dark:border-[#24342c] bg-white dark:bg-[#19241f]">
                    <div className="p-2.5 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] mb-2.5 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#468366] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#2c3831] dark:text-[#dce6e0] truncate">{user?.name || "Pengurus"}</div>
                            <div className="text-[10px] text-[#468366] dark:text-[#a3d4bd] font-medium truncate capitalize">
                                {userRole.replace(/_/g, " ").toLowerCase()}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href="/"
                            className="text-center py-1.5 px-2.5 rounded-lg text-xs font-medium bg-[#f2f6f3] dark:bg-[#1f2d26] text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#2c3831] dark:hover:text-[#dce6e0] transition-colors border border-[#e3ece6] dark:border-[#24342c]"
                        >
                            Web Publik
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="py-1.5 px-2.5 rounded-lg text-xs font-medium bg-[#fbf2f2] dark:bg-[#2d1a1b] text-[#c24141] dark:text-[#f87171] hover:bg-[#f8e5e5] transition-colors border border-[#f0d5d5] dark:border-[#422123]"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <div className="p-4 md:p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
