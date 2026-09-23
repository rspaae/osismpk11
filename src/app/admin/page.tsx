"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface AdminStats {
    metrics: {
        totalUsers: number;
        totalAspirations: number;
        pendingAspirations: number;
        totalWorkPrograms: number;
        ongoingWorkPrograms: number;
        activeAttendanceSessions: number;
        totalActivities: number;
        totalTasks: number;
        pendingTasks: number;
    };
    activePeriod: {
        name: string;
        cabinetNameOsis?: string;
        cabinetNameMpk?: string;
        theme?: string;
    } | null;
    recentAspirations: Array<{
        id: string;
        title: string;
        category: string;
        status: string;
        createdAt: string;
        user: {
            name: string;
            kelas?: string;
        };
    }>;
    recentSessions: Array<{
        id: string;
        title: string;
        type: string;
        location?: string;
        startTime?: string;
        _count: {
            records: number;
        };
    }>;
}

export default function AdminOverviewPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    const user = session?.user;

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/stats");
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Gagal memuat statistik admin:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header Greeting Card */}
            <div className="bg-white dark:bg-[#19241f] p-6 sm:p-8 rounded-2xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f2ec] dark:bg-[#1d2c25] text-[#396953] dark:text-[#a3d4bd] text-xs font-semibold uppercase tracking-wider mb-3">
                        <span className="w-2 h-2 rounded-full bg-[#468366]" />
                        <span>Panel Manajemen Pengurus</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#202924] dark:text-[#f0f5f2] tracking-tight">
                        Selamat Datang, {user?.name || "Pengurus"}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#5f7167] dark:text-[#a5b8ad] mt-1 max-w-2xl leading-relaxed">
                        Pusat kendali kegiatan, dokumentasi, aspirasi siswa, dan program kerja OSIS-MPK SMKN 11 Bandung Periode 2026/2027.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <Link
                        href="/admin/activities"
                        className="px-4 py-2 rounded-xl bg-[#468366] hover:bg-[#3b6f57] text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-2"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Upload Dokumentasi</span>
                    </Link>
                    <Link
                        href="/admin/aspirations"
                        className="px-4 py-2 rounded-xl bg-[#f2f6f3] dark:bg-[#1e2a23] hover:bg-[#e8f0eb] text-[#2c3831] dark:text-[#dce6e0] text-xs font-semibold transition-colors border border-[#d4e6db] dark:border-[#24342c] flex items-center gap-1.5"
                    >
                        <span>Kotak Aspirasi</span>
                    </Link>
                </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Anggota / Pengguna */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad]">Total Akun Terdaftar</span>
                        <div className="w-8 h-8 rounded-lg bg-[#e8f2ec] dark:bg-[#1e2d25] text-[#396953] dark:text-[#a3d4bd] flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#202924] dark:text-[#f0f5f2] mt-3">
                        {loading ? "..." : stats?.metrics.totalUsers ?? 0}
                    </div>
                    <div className="text-[11px] text-[#718579] dark:text-[#8ba093] mt-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#468366]" />
                        <span>Siswa & Pengurus Aktif</span>
                    </div>
                </div>

                {/* Aspirasi Siswa */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad]">Aspirasi Masuk</span>
                        <div className="w-8 h-8 rounded-lg bg-[#faf3e1] dark:bg-[#2d2516] text-[#785a21] dark:text-[#e6c885] flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#202924] dark:text-[#f0f5f2] mt-3 flex items-baseline gap-2">
                        {loading ? "..." : stats?.metrics.totalAspirations ?? 0}
                        {stats?.metrics.pendingAspirations ? (
                            <span className="text-xs font-semibold text-[#b87818]">
                                ({stats.metrics.pendingAspirations} pending)
                            </span>
                        ) : null}
                    </div>
                    <div className="text-[11px] text-[#718579] dark:text-[#8ba093] mt-1.5">
                        Dikelola oleh Komisi B MPK
                    </div>
                </div>

                {/* Program Kerja */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad]">Program Kerja</span>
                        <div className="w-8 h-8 rounded-lg bg-[#e8f2ec] dark:bg-[#1e2d25] text-[#396953] dark:text-[#a3d4bd] flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#202924] dark:text-[#f0f5f2] mt-3 flex items-baseline gap-2">
                        {loading ? "..." : stats?.metrics.totalWorkPrograms ?? 0}
                        <span className="text-xs font-semibold text-[#468366]">
                            ({stats?.metrics.ongoingWorkPrograms ?? 0} aktif)
                        </span>
                    </div>
                    <div className="text-[11px] text-[#718579] dark:text-[#8ba093] mt-1.5">
                        10 Sekbid OSIS & Komisi MPK
                    </div>
                </div>

                {/* Publikasi / Dokumentasi */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad]">Dokumentasi Kegiatan</span>
                        <div className="w-8 h-8 rounded-lg bg-[#eaf1f8] dark:bg-[#1a2632] text-[#2c6194] dark:text-[#90c0ee] flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[#202924] dark:text-[#f0f5f2] mt-3">
                        {loading ? "..." : stats?.metrics.totalActivities ?? 0}
                    </div>
                    <div className="text-[11px] text-[#718579] dark:text-[#8ba093] mt-1.5">
                        Artikel & Galeri Terbit
                    </div>
                </div>
            </div>

            {/* 2-Column Section: Sesi Presensi & Aspirasi Terbaru */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sesi Presensi Aktif */}
                <div className="bg-white dark:bg-[#19241f] rounded-2xl p-6 border border-[#e3ece6] dark:border-[#24342c] shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#468366]" />
                                <h2 className="text-sm font-bold text-[#202924] dark:text-[#f0f5f2]">Sesi Presensi & Rapat</h2>
                            </div>
                            <Link
                                href="/admin/attendance"
                                className="text-xs font-semibold text-[#468366] hover:underline"
                            >
                                Kelola Sesi →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="py-8 text-center text-[#718579] text-xs">Memuat data sesi...</div>
                        ) : !stats?.recentSessions || stats.recentSessions.length === 0 ? (
                            <div className="py-8 text-center border border-dashed border-[#e3ece6] dark:border-[#24342c] rounded-xl p-5 bg-[#fafcfb] dark:bg-[#151d18]">
                                <div className="text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0]">Belum ada sesi rapat yang dibuka</div>
                                <p className="text-[11px] text-[#718579] dark:text-[#8ba093] mt-1">Buat sesi presensi baru untuk rapat pleno atau piket harian.</p>
                                <Link
                                    href="/admin/attendance"
                                    className="mt-3.5 inline-block px-3.5 py-1.5 rounded-lg bg-[#f0f5f2] hover:bg-[#e4ede7] text-xs font-semibold text-[#2e5845] transition-colors border border-[#d4e6db]"
                                >
                                    + Buat Sesi Presensi
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {stats.recentSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="p-3.5 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="text-xs font-bold text-[#202924] dark:text-[#f0f5f2]">{session.title}</div>
                                            <div className="text-[11px] text-[#718579] dark:text-[#8ba093] mt-0.5">
                                                {session.location || "SMKN 11 Bandung"} • Mulai {session.startTime || "-"}
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full bg-[#e8f2ec] text-[#396953] text-[10px] font-semibold">
                                            {session._count.records} Hadir
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Aspirasi Siswa Terbaru */}
                <div className="bg-white dark:bg-[#19241f] rounded-2xl p-6 border border-[#e3ece6] dark:border-[#24342c] shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#c99a36]" />
                                <h2 className="text-sm font-bold text-[#202924] dark:text-[#f0f5f2]">Aspirasi Siswa Terbaru</h2>
                            </div>
                            <Link
                                href="/admin/aspirations"
                                className="text-xs font-semibold text-[#468366] hover:underline"
                            >
                                Semua Aspirasi →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="py-8 text-center text-[#718579] text-xs">Memuat data aspirasi...</div>
                        ) : !stats?.recentAspirations || stats.recentAspirations.length === 0 ? (
                            <div className="py-8 text-center border border-dashed border-[#e3ece6] dark:border-[#24342c] rounded-xl p-5 bg-[#fafcfb] dark:bg-[#151d18]">
                                <div className="text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0]">Belum ada aspirasi masuk</div>
                                <p className="text-[11px] text-[#718579] dark:text-[#8ba093] mt-1">Aspirasi yang dikirim siswa melalui portal akan terdata di sini.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {stats.recentAspirations.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3.5 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] flex items-center justify-between"
                                    >
                                        <div className="min-w-0 flex-1 pr-3">
                                            <div className="text-xs font-bold text-[#202924] dark:text-[#f0f5f2] truncate">{item.title}</div>
                                            <div className="text-[11px] text-[#718579] dark:text-[#8ba093] mt-0.5 truncate">
                                                {item.user?.name || "Anonim"} ({item.user?.kelas || "Siswa"}) • {item.category}
                                            </div>
                                        </div>
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                                item.status === "PENDING"
                                                    ? "bg-[#faf3e1] text-[#785a21]"
                                                    : "bg-[#e8f2ec] text-[#396953]"
                                            }`}
                                        >
                                            {item.status === "PENDING" ? "Perlu Respon" : item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Access Tiles */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#718579] dark:text-[#8ba093] mb-4">
                    Pintasan Menu Pengurus
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <Link
                        href="/admin/activities"
                        className="p-4 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] hover:bg-[#eef5f0] dark:hover:bg-[#1b2620] border border-[#e3ece6] dark:border-[#24342c] text-center transition-colors group"
                    >
                        <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-[#e8f2ec] text-[#396953] flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <div className="text-xs font-bold text-[#202924] dark:text-[#f0f5f2]">Dokumentasi</div>
                        <div className="text-[10px] text-[#718579] mt-0.5">Upload Berita</div>
                    </Link>

                    <Link
                        href="/admin/aspirations"
                        className="p-4 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] hover:bg-[#eef5f0] dark:hover:bg-[#1b2620] border border-[#e3ece6] dark:border-[#24342c] text-center transition-colors group"
                    >
                        <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-[#faf3e1] text-[#785a21] flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <div className="text-xs font-bold text-[#202924] dark:text-[#f0f5f2]">Kotak Aspirasi</div>
                        <div className="text-[10px] text-[#718579] mt-0.5">Tanggapi Siswa</div>
                    </Link>

                    <Link
                        href="/admin/work-programs"
                        className="p-4 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] hover:bg-[#eef5f0] dark:hover:bg-[#1b2620] border border-[#e3ece6] dark:border-[#24342c] text-center transition-colors group"
                    >
                        <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-[#e8f2ec] text-[#396953] flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <div className="text-xs font-bold text-[#202924] dark:text-[#f0f5f2]">Program Kerja</div>
                        <div className="text-[10px] text-[#718579] mt-0.5">RAB & LPJ</div>
                    </Link>

                    <Link
                        href="/admin/attendance"
                        className="p-4 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] hover:bg-[#eef5f0] dark:hover:bg-[#1b2620] border border-[#e3ece6] dark:border-[#24342c] text-center transition-colors group"
                    >
                        <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-[#e8f2ec] text-[#396953] flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-xs font-bold text-[#202924] dark:text-[#f0f5f2]">Presensi & QR</div>
                        <div className="text-[10px] text-[#718579] mt-0.5">Rapat & Piket</div>
                    </Link>

                    <Link
                        href="/admin/tasks"
                        className="p-4 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] hover:bg-[#eef5f0] dark:hover:bg-[#1b2620] border border-[#e3ece6] dark:border-[#24342c] text-center transition-colors group"
                    >
                        <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-[#e8f2ec] text-[#396953] flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="text-xs font-bold text-[#202924] dark:text-[#f0f5f2]">Tugas Anggota</div>
                        <div className="text-[10px] text-[#718579] mt-0.5">Delegasi Kerja</div>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="p-4 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] hover:bg-[#eef5f0] dark:hover:bg-[#1b2620] border border-[#e3ece6] dark:border-[#24342c] text-center transition-colors group"
                    >
                        <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-[#e8f2ec] text-[#396953] flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div className="text-xs font-bold text-[#202924] dark:text-[#f0f5f2]">Kelola Akun</div>
                        <div className="text-[10px] text-[#718579] mt-0.5">Pengurus & Siswa</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
