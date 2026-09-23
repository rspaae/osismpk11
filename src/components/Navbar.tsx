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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2.5 md:py-3" : "py-4 md:py-5"}`}>
            <div className={`container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
                isScrolled 
                    ? "bg-[#ffffff]/92 dark:bg-[#19241f]/92 backdrop-blur-md border border-[#e3ece6] dark:border-[#24342c] py-2.5 rounded-2xl max-w-7xl lg:max-w-[1360px] shadow-[0_4px_16px_-4px_rgba(70,131,102,0.04)] mx-4 md:mx-auto" 
                    : "bg-transparent max-w-7xl lg:max-w-[1360px]"
            }`}>
                <Link href="/" className="group flex items-center gap-3">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] p-1 flex items-center justify-center shadow-xs group-hover:border-[#468366]/40 transition-colors overflow-hidden shrink-0">
                        <Image
                            src="/images/logos/smkn11.jpg"
                            alt="SMKN 11 Bandung"
                            width={36}
                            height={36}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg md:text-xl font-bold tracking-tight text-[#2c3831] dark:text-[#dce6e0] leading-none">
                            OSIS-MPK
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#468366] dark:text-[#a3d4bd] mt-0.5">
                            SMKN 11 Bandung
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-7">
                    {!user ? (
                        <>
                            {publicLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xs font-medium uppercase tracking-wider text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-4 w-[1px] bg-[#e3ece6] dark:bg-[#24342c] mx-1" />
                            <Link
                                href="/login"
                                className="px-5 py-2.5 bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow-sm"
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
                                    className="text-xs font-medium uppercase tracking-wider text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {['ADMINISTRATOR', 'KEPALA_SEKOLAH', 'KESISWAAN', 'PEMBINA', 'BPH_OSIS', 'BPH_MPK', 'SEKBID_OFFICER', 'KOMISI_OFFICER', 'DEWAN', 'OSIS_OFFICER', 'MPK_OFFICER'].includes(user.role as any) ? (
                                <>
                                    <Link
                                        href="/admin"
                                        className="text-xs font-medium uppercase tracking-wider text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors"
                                    >
                                        Executive Suite
                                    </Link>
                                    <div className="h-4 w-[1px] bg-[#e3ece6] dark:bg-[#24342c] mx-1" />
                                    <Link
                                        href="/admin"
                                        className="px-5 py-2.5 bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                                    >
                                        <span>📊</span>
                                        <span>Dashboard Pengurus</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="h-4 w-[1px] bg-[#e3ece6] dark:bg-[#24342c] mx-1" />
                                    <Link
                                        href="/student/dashboard"
                                        className="px-5 py-2.5 bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs"
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
                    aria-label="Toggle Mobile Menu"
                    className="md:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-[#e8f2ec] dark:hover:bg-[#24342c] transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className={`w-5 h-0.5 bg-[#334139] dark:bg-[#dce6e0] transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                    <span className={`w-3.5 h-0.5 bg-[#334139] dark:bg-[#dce6e0] transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                    <span className={`w-5 h-0.5 bg-[#334139] dark:bg-[#dce6e0] transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-0 bg-[#f7faf7]/98 dark:bg-[#141c18]/98 backdrop-blur-xl z-[60] md:hidden p-6 sm:p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#e3ece6] dark:border-[#24342c]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#e8f2ec] text-[#468366] flex items-center justify-center font-bold text-xs">
                                    11
                                </div>
                                <span className="text-lg font-bold tracking-tight text-[#2c3831] dark:text-[#dce6e0]">OSIS-MPK SMKN 11</span>
                            </div>
                            <button
                                aria-label="Close Mobile Menu"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#e8f2ec] dark:bg-[#19241f] text-[#334139] dark:text-[#dce6e0] border border-[#e3ece6] dark:border-[#24342c]"
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
                                            className="text-xl font-semibold text-[#334139] dark:text-[#dce6e0] hover:text-[#468366] transition-colors py-1"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <div className="pt-4 mt-2 border-t border-[#e3ece6] dark:border-[#24342c]">
                                        <Link
                                            href="/login"
                                            className="inline-flex items-center justify-center w-full py-3 bg-[#468366] text-white font-semibold text-sm uppercase tracking-wider rounded-xl shadow-xs"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Login Siswa
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {memberLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-xl font-semibold text-[#334139] dark:text-[#dce6e0] hover:text-[#468366] py-1"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <div className="pt-4 mt-2 border-t border-[#e3ece6] dark:border-[#24342c]">
                                        <Link
                                            href="/student/dashboard"
                                            className="inline-flex items-center justify-center w-full py-3 bg-[#468366] text-white font-semibold text-sm uppercase tracking-wider rounded-xl shadow-xs"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Dashboard Saya
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
