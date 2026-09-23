'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import { motion, AnimatePresence } from "framer-motion";
import AspirationForm from "@/components/AspirationForm";
import Image from "next/image";

interface MyAspiration {
    id: string;
    title: string;
    content: string;
    category: string;
    status: "PENDING" | "REVIEWED" | "COMPLETED";
    response?: string | null;
    respondedAt?: string | null;
    isAnonymous: boolean;
    createdAt: string;
}

export default function StudentDashboard() {
    const { data: session, status } = useSession();
    const [myAspirations, setMyAspirations] = useState<MyAspiration[]>([]);
    const [loadingAspirations, setLoadingAspirations] = useState(true);

    const user = session?.user;

    useEffect(() => {
        if (session && user?.role === "STUDENT") {
            fetchMyAspirations();
        }
    }, [session, user?.role]);

    const fetchMyAspirations = async () => {
        try {
            setLoadingAspirations(true);
            const res = await fetch("/api/aspirations/my");
            if (res.ok) {
                const data = await res.json();
                setMyAspirations(data);
            }
        } catch (error) {
            console.error("Error fetching my aspirations:", error);
        } finally {
            setLoadingAspirations(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7faf7] dark:bg-[#141c18]">
                <div className="w-8 h-8 border-3 border-[#468366]/30 border-t-[#468366] rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 bg-[#f7faf7] dark:bg-[#141c18] text-[#334139] dark:text-[#dce6e0]">
            <div className="container mx-auto max-w-6xl">
                {/* Header Section */}
                <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#2c3831] dark:text-[#dce6e0]">
                            Dashboard Siswa
                        </h1>
                        <p className="text-xs sm:text-sm text-[#5f7167] dark:text-[#a5b8ad] mt-1">
                            Selamat datang, {user?.name?.split(' ')[0]}. Ruang aspirasi dan layanan OSIS-MPK SMKN 11 Bandung.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <SignOutButton />
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Digital Student Card (Soft Sage Mint Tone) */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-5"
                    >
                        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#468366] via-[#3a6e56] to-[#2e5845] text-white shadow-xs flex flex-col justify-between min-h-[260px] relative overflow-hidden">
                            {/* Card Background Pattern Decor */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[#d4e6db] text-[9px] font-semibold uppercase tracking-wider mb-1">Kartu Pelajar Digital</p>
                                    <h2 className="text-lg md:text-xl font-bold tracking-tight">SMKN 11 Bandung</h2>
                                </div>
                                <div className="w-12 h-12 p-1 rounded-xl bg-white/95 border border-white/20 shadow-xs flex items-center justify-center overflow-hidden">
                                    <Image
                                        src="/images/logos/smkn11.jpg"
                                        alt="SMKN 11 Bandung"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 items-center mb-6">
                                <div className="w-14 h-14 p-1 rounded-full bg-white/95 border border-white/20 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                                    <Image
                                        src={user?.role === 'BPH_MPK' || user?.role === 'KOMISI_OFFICER' ? "/images/logos/mpk.jpg" : "/images/logos/osis.jpg"}
                                        alt="Org Logo"
                                        width={48}
                                        height={48}
                                        className="object-cover rounded-full"
                                    />
                                </div>
                                <div>
                                    <p className="text-base md:text-lg font-bold tracking-tight uppercase leading-snug">{user?.name}</p>
                                    <span className="px-2.5 py-0.5 bg-[#e8f2ec] text-[#2e5845] text-[10px] font-semibold rounded-md inline-block uppercase tracking-wide mt-1">
                                        {
                                            user?.role === 'ADMINISTRATOR' ? 'Sistem Admin' :
                                            user?.role === 'KEPALA_SEKOLAH' ? 'Kepala Sekolah' :
                                            user?.role === 'KESISWAAN' ? 'Wakasek Kesiswaan' :
                                            user?.role === 'PEMBINA' ? 'Pembina OSIS-MPK' :
                                            user?.role === 'BPH_OSIS' ? 'BPH OSIS Navastra' :
                                            user?.role === 'BPH_MPK' ? 'BPH MPK Navandya' :
                                            user?.role === 'SEKBID_OFFICER' ? (user?.position || 'Pengurus Sekbid OSIS') :
                                            user?.role === 'KOMISI_OFFICER' ? (user?.position || 'Pengurus Komisi MPK') :
                                            'Siswa Aktif'
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-4 border-t border-white/15 text-xs text-[#d4e6db]">
                                <div>
                                    <p className="text-[9px] uppercase tracking-wider text-white/70">Email Sekolah</p>
                                    <p className="font-medium text-white text-xs truncate max-w-[180px]">{user?.email || '-'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] uppercase tracking-wider text-white/70">ID</p>
                                    <p className="font-bold text-white text-xs">{user?.id?.substring(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Stat Cards & Info */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { title: "Status Akun", value: "Aktif", icon: "✨", color: "text-[#468366]", bg: "bg-[#e8f2ec] dark:bg-[#1d2c25]" },
                            { title: "Aspirasi Dikirim", value: `${myAspirations.length} Usulan`, icon: "💡", color: "text-[#396953]", bg: "bg-[#edf5f0] dark:bg-[#1d2c25]" },
                            { title: "Agenda Terdekat", value: "Porseni XI", icon: "📅", color: "text-[#335982]", bg: "bg-[#e6effa] dark:bg-[#1b2a38]" },
                            { title: "Status Verifikasi", value: "Terverifikasi", icon: "🛡️", color: "text-[#785a21]", bg: "bg-[#faf3e1] dark:bg-[#332814]" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + (i * 0.05) }}
                                className="p-5 bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs"
                            >
                                <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3`}>
                                    {stat.icon}
                                </div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a9a91] dark:text-[#73887d] mb-0.5">{stat.title}</p>
                                <p className="text-lg font-bold text-[#2c3831] dark:text-[#dce6e0] leading-none">{stat.value}</p>
                            </motion.div>
                        ))}

                        {/* Announcement Card */}
                        <div className="sm:col-span-2 p-5 bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs">
                            <h3 className="text-sm font-bold text-[#2c3831] dark:text-[#dce6e0] mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-[#468366] rounded-full" />
                                Pengumuman Siswa
                            </h3>
                            <div className="space-y-2.5">
                                {[
                                    { date: "Maret 2026", text: "Kanal Aspirasi Terbuka aktif untuk seluruh siswa SMKN 11 Bandung." },
                                    { date: "Februari 2026", text: "Pendaftaran lomba dan kepengurusan ekstrakurikuler semester genap." },
                                ].map((news, i) => (
                                    <div key={i} className="flex gap-3 items-start text-xs">
                                        <span className="px-2 py-0.5 bg-[#e8f2ec] dark:bg-[#1d2c25] text-[#396953] dark:text-[#a3d4bd] rounded-md text-[10px] font-semibold shrink-0">
                                            {news.date}
                                        </span>
                                        <span className="text-[#5f7167] dark:text-[#a5b8ad]">
                                            {news.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Aspiration Form - Students */}
                    {user?.role === 'STUDENT' && (
                        <>
                            <div className="lg:col-span-12 mt-2">
                                <AspirationForm onAspirationSubmitted={fetchMyAspirations} />
                            </div>

                            {/* My Aspirations List */}
                            <div className="lg:col-span-12 mt-4">
                                <div className="p-6 sm:p-8 md:p-10 bg-white dark:bg-[#19241f] rounded-3xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold text-[#2c3831] dark:text-[#dce6e0] flex items-center gap-2">
                                                <span className="w-1.5 h-5 bg-[#468366] rounded-full" />
                                                Riwayat Aspirasi Saya
                                            </h3>
                                            <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mt-0.5">
                                                Status dan tanggapan dari tim pengurus OSIS & MPK SMKN 11 Bandung.
                                            </p>
                                        </div>
                                        <button
                                            onClick={fetchMyAspirations}
                                            className="px-4 py-2 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#d2ded6] dark:border-[#24342c] text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#468366] transition-colors flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <span>🔄</span> Muat Ulang
                                        </button>
                                    </div>

                                    {loadingAspirations ? (
                                        <div className="text-center py-12 text-[#8a9a91] text-xs">
                                            Memuat riwayat aspirasi...
                                        </div>
                                    ) : myAspirations.length === 0 ? (
                                        <div className="text-center py-12 p-6 rounded-2xl bg-[#f7faf7] dark:bg-[#141c18] border border-dashed border-[#d2ded6] dark:border-[#24342c] text-[#8a9a91] text-xs">
                                            Belum ada aspirasi yang dikirim. Sampaikan usul Anda melalui formulir di atas!
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <AnimatePresence>
                                                {myAspirations.map((asp) => (
                                                    <motion.div
                                                        key={asp.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="p-5 rounded-2xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c]"
                                                    >
                                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                                    asp.status === 'PENDING'
                                                                        ? 'bg-[#faf3e1] dark:bg-[#332814] text-[#785a21] dark:text-[#e6c885] border-[#ede0bc] dark:border-[#3d3119]'
                                                                        : asp.status === 'REVIEWED'
                                                                        ? 'bg-[#e6effa] dark:bg-[#1b2a38] text-[#335982] dark:text-[#9ec1e6] border-[#c2d7ed] dark:border-[#2b3c4f]'
                                                                        : 'bg-[#e8f2ec] dark:bg-[#183325] text-[#2b6144] dark:text-[#96d6b4] border-[#d4e6db] dark:border-[#24342c]'
                                                                }`}>
                                                                    {asp.status === 'PENDING' && '⏳ Menunggu'}
                                                                    {asp.status === 'REVIEWED' && '🔍 Ditinjau'}
                                                                    {asp.status === 'COMPLETED' && '✓ Selesai'}
                                                                </span>
                                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium text-[#5f7167] dark:text-[#a5b8ad] border border-[#e3ece6] dark:border-[#24342c] bg-white dark:bg-[#19241f]">
                                                                    {asp.category}
                                                                </span>
                                                                {asp.isAnonymous && (
                                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-[#f1ecfa] dark:bg-[#271a38] text-[#5e3b8a] dark:text-[#c8aae6] border border-[#dfd4f2] dark:border-[#38264f]">
                                                                        🕵️ Anonim
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-[11px] text-[#8a9a91]">
                                                                {new Date(asp.createdAt).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>

                                                        <h4 className="text-sm font-bold text-[#2c3831] dark:text-[#dce6e0] mb-1.5">
                                                            {asp.title}
                                                        </h4>
                                                        <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] leading-relaxed mb-4">
                                                            {asp.content}
                                                        </p>

                                                        {/* Response */}
                                                        {asp.response ? (
                                                            <div className="p-3.5 rounded-xl bg-[#e8f2ec] dark:bg-[#183325] border border-[#d4e6db] dark:border-[#24342c]">
                                                                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-semibold text-[#2b6144] dark:text-[#96d6b4]">
                                                                    <span>💬 Tanggapan Pengurus OSIS-MPK</span>
                                                                    {asp.respondedAt && (
                                                                        <span className="text-[10px] text-[#5f7167] dark:text-[#a5b8ad] ml-auto font-normal">
                                                                            {new Date(asp.respondedAt).toLocaleDateString('id-ID', {
                                                                                day: 'numeric',
                                                                                month: 'short',
                                                                                year: 'numeric'
                                                                            })}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-[#334139] dark:text-[#dce6e0] italic">
                                                                    "{asp.response}"
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-[11px] text-[#8a9a91] italic">
                                                                Belum ada tanggapan dari tim pengurus.
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
