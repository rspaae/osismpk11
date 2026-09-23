"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

interface NavItem {
    name: string;
    href: string;
    icon: string;
    badge?: string;
    roles?: string[];
    divisions?: string[];
    customCheck?: (user: any) => boolean;
}

const navItems: NavItem[] = [
    {
        name: "Overview",
        href: "/admin",
        icon: "📊",
    },
    {
        name: "Kotak Aspirasi",
        href: "/admin/aspirations",
        icon: "🗳️",
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
        icon: "📋",
    },
    {
        name: "Absensi Sapa Pagi & Danus",
        href: "/admin/attendance/sekbid",
        icon: "⏱️",
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
        icon: "📌",
    },
    {
        name: "Publikasi Berita",
        href: "/admin/activities",
        icon: "📰",
    },
    {
        name: "Kelola Pengguna",
        href: "/admin/users",
        icon: "👥",
        roles: ["ADMINISTRATOR", "KESISWAAN", "PEMBINA"],
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
            className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row pt-20 md:pt-0"
        >
            {/* Mobile Header Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                        <Image
                            src="/images/logos/smkn11.jpg"
                            alt="Logo"
                            width={24}
                            height={24}
                            className="rounded-md object-contain"
                        />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white leading-tight">OSIM11 Portal</div>
                        <div className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Pengurus & Admin</div>
                    </div>
                </div>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                >
                    {isMobileOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-30 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                {/* Brand Header */}
                <div className="p-6 border-b border-slate-800/80">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center shadow-inner group-hover:border-emerald-500/50 transition-colors">
                            <Image
                                src="/images/logos/smkn11.jpg"
                                alt="SMKN 11 Bandung"
                                width={32}
                                height={32}
                                className="object-contain rounded-lg"
                            />
                        </div>
                        <div>
                            <div className="text-base font-extrabold text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
                                OSIM11 SUITE
                            </div>
                            <div className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase mt-1">
                                SMKN 11 Bandung
                            </div>
                        </div>
                    </Link>

                    {/* Active Cabinet Badge */}
                    <div className="mt-4 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] text-slate-400 font-medium">Periode Aktif</div>
                            <div className="text-xs font-bold text-slate-200">2025/2026 (Navastra x Navandya)</div>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                        Menu Utama
                    </div>
                    {filteredNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span className="flex-1">{item.name}</span>
                                {item.badge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile & Actions Footer */}
                <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
                    <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 mb-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-700/30 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300 text-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-100 truncate">{user?.name || "Pengguna"}</div>
                            <div className="text-[10px] text-emerald-400 font-semibold truncate capitalize">
                                {userRole.replace(/_/g, " ").toLowerCase()}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href="/"
                            className="text-center py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                        >
                            Web Publik
                        </Link>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="py-2 px-3 rounded-lg text-xs font-semibold bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 hover:text-rose-100 transition-colors border border-rose-800/40"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
