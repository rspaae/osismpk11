"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const publicLinks = [
    { name: "Beranda", href: "/" },
    { name: "Visi & Misi", href: "/vision-mission" },
    { name: "Struktur & Sekbid", href: "/structure" },
    { name: "Dokumentasi", href: "/activities" },
];

const memberLinks = [
    { name: "Dashboard", href: "/student/dashboard" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2 md:py-3" : "py-4 md:py-6"}`}>
            <div className={`container mx-auto px-4 md:px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 py-2.5 rounded-2xl max-w-5xl shadow-sm mx-4 md:mx-auto" : ""}`}>
                <Link href="/" className="group flex items-center gap-3">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shadow-sm">
                        <Image
                            src="/images/logos/smkn11.jpg"
                            alt="SMKN 11 Bandung"
                            width={36}
                            height={36}
                            className="object-contain rounded-lg"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                            OSIS-MPK
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mt-0.5">
                            SMKN 11 Bandung
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {!user ? (
                        <>
                            {publicLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                            <Link
                                href="/login"
                                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                            >
                                Login Siswa
                            </Link>
                        </>
                    ) : (
                        <>
                            {memberLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {['ADMINISTRATOR', 'KEPALA_SEKOLAH', 'KESISWAAN', 'PEMBINA', 'BPH_OSIS', 'BPH_MPK', 'SEKBID_OFFICER', 'KOMISI_OFFICER', 'DEWAN', 'OSIS_OFFICER', 'MPK_OFFICER'].includes(user.role as any) ? (
                                <>
                                    <Link
                                        href="/admin"
                                        className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                                    >
                                        Executive Suite
                                    </Link>
                                    <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                                    <Link
                                        href="/admin"
                                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                                    >
                                        <span>📊</span>
                                        <span>Dashboard Pengurus</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                                    <Link
                                        href="/student/dashboard"
                                        className="px-5 py-2 bg-slate-900 dark:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                                    >
                                        Dashboard Siswa
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden flex flex-col gap-1 p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className={`w-5 h-0.5 bg-slate-800 dark:bg-white transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                    <span className={`w-3.5 h-0.5 bg-slate-800 dark:bg-white transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                    <span className={`w-5 h-0.5 bg-slate-800 dark:bg-white transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-[60] md:hidden p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">OSIS-MPK SMKN 11</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {!user ? (
                                <>
                                    {publicLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-2xl font-black text-slate-800 dark:text-slate-100 hover:text-emerald-700 transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <Link
                                            href="/login"
                                            className="text-xl font-black text-emerald-700 dark:text-emerald-400"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            → Login Siswa
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {memberLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-2xl font-black text-slate-800 dark:text-slate-100 hover:text-emerald-700"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <Link
                                            href="/student/dashboard"
                                            className="text-xl font-black text-emerald-700 dark:text-emerald-400"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            → Dashboard Saya
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
