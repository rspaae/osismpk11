"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const publicLinks = [
    { name: "Beranda", href: "/" },
    { name: "Visi & Misi", href: "/vision-mission" },
    { name: "Struktur", href: "/structure" },
    { name: "Sekbid", href: "/departments" },
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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-2 md:py-4" : "py-4 md:py-8"}`}>
            <div className={`container mx-auto px-4 md:px-6 flex items-center justify-between transition-all duration-500 ${isScrolled ? "glass border border-white/20 py-3 rounded-2xl md:rounded-[2rem] max-w-5xl shadow-2xl shadow-purple-500/10 mx-4 md:mx-auto" : ""}`}>
                <Link href="/" className="group flex items-center gap-4">
                    <div className="logo-orb w-12 h-12 md:w-14 md:h-14 p-1.5 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <Image
                            src="/images/logos/smkn11.jpg"
                            alt="SMKN 11 Bandung"
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground leading-none group-hover:text-brand-primary transition-colors">
                            OSIS-MPK
                        </span>
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/80 mt-1 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-brand-accent animate-pulse" />
                            SMKN 11 Bandung
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    {!user ? (
                        <>
                            {publicLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[13px] font-bold uppercase tracking-widest text-foreground/60 hover:text-brand-primary transition-all relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-primary rounded-full transition-all group-hover:w-full" />
                                </Link>
                            ))}
                            <div className="h-6 w-[1px] bg-border/50 mx-2" />
                            <Link
                                href="/login"
                                className="relative px-7 py-3.5 bg-gradient-primary text-white text-[13px] font-black uppercase tracking-widest rounded-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all active:scale-95 overflow-hidden group"
                            >
                                <span className="relative z-10">Login Siswa</span>
                                <div className="absolute inset-0 bg-gradient-vibrant opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Link>
                        </>
                    ) : (
                        <>
                            {memberLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[13px] font-bold uppercase tracking-widest text-foreground/50 hover:text-brand-primary transition-all relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full" />
                                </Link>
                            ))}
                            {['ADMINISTRATOR', 'PEMBINA', 'DEWAN'].includes(user.role as any) && (
                                <Link
                                    href="/admin/aspirations"
                                    className="text-[13px] font-bold uppercase tracking-widest text-foreground/50 hover:text-brand-primary transition-all relative group"
                                >
                                    Suara Siswa
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full" />
                                </Link>
                            )}
                            {user.role === 'ADMINISTRATOR' && (
                                <Link
                                    href="/admin/users"
                                    className="text-[13px] font-bold uppercase tracking-widest text-foreground/50 hover:text-brand-primary transition-all relative group"
                                >
                                    Kelola Akun
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full" />
                                </Link>
                            )}
                            <div className="h-6 w-[1px] bg-border mx-2" />
                            <Link
                                href="/student/dashboard"
                                className="px-6 py-3 bg-brand-primary text-white text-[13px] font-black uppercase tracking-widest rounded-xl hover:shadow-2xl hover:shadow-brand-primary/30 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                My Account
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className={`w-6 h-0.5 bg-foreground transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`w-4 h-0.5 bg-foreground transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                    <span className={`w-6 h-0.5 bg-foreground transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-background/95 backdrop-blur-2xl z-[60] md:hidden p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-xl font-black tracking-tight text-foreground">OSIS-MPK</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5"
                            >
                                <span className="text-2xl">✕</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-6">
                            {!user ? (
                                <>
                                    {publicLinks.map((link, i) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className="text-4xl font-black text-foreground hover:text-brand-primary transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: publicLinks.length * 0.1 }}
                                        className="pt-8 border-t border-border"
                                    >
                                        <Link
                                            href="/login"
                                            className="text-3xl font-black text-foreground"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            → Login Siswa
                                        </Link>
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    {memberLinks.map((link, i) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className="text-4xl font-black text-foreground hover:text-brand-primary transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                    {['ADMINISTRATOR', 'PEMBINA', 'DEWAN'].includes(user.role as any) && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: memberLinks.length * 0.1 }}
                                        >
                                            <Link
                                                href="/admin/aspirations"
                                                className="text-4xl font-black text-foreground hover:text-brand-primary"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Suara Siswa
                                            </Link>
                                        </motion.div>
                                    )}
                                    {user.role === 'ADMINISTRATOR' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (memberLinks.length + 1) * 0.1 }}
                                        >
                                            <Link
                                                href="/admin/users"
                                                className="text-4xl font-black text-foreground hover:text-brand-primary"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Kelola Akun
                                            </Link>
                                        </motion.div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (memberLinks.length + 1) * 0.1 }}
                                        className="pt-8 border-t border-border"
                                    >
                                        <Link
                                            href="/"
                                            className="text-2xl font-bold text-foreground/40 mb-4 block"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Halaman Publik
                                        </Link>
                                        <Link
                                            href="/student/dashboard"
                                            className="text-3xl font-black text-brand-primary"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            → Profil Saya
                                        </Link>
                                    </motion.div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
