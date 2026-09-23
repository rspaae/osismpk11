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
        <div className="space-y-8">
            {/* Header Greeting */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Executive Control Center
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                        Selamat Datang, {user?.name || "Pengurus"}! 👋
                    </h1>
                    <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                        Kelola seluruh operasional organisasi OSIS & MPK SMKN 11 Bandung (Kabinet {stats?.activePeriod?.cabinetNameOsis || "Navastra"} x {stats?.activePeriod?.cabinetNameMpk || "Navandya"}) dalam satu dashboard terintegrasi.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/attendance"
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                    >
                        <span>⏱️</span>
                        <span>Buka Presensi QR</span>
                    </Link>
                    <Link
                        href="/admin/aspirations"
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-2"
                    >
                        <span>🗳️</span>
                        <span>Kotak Aspirasi</span>
                    </Link>
                </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {/* Total User */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Anggota</div>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg">
                            👥
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white mt-3">
                        {loading ? "..." : stats?.metrics.totalUsers ?? 0}
                    </div>
                    <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <span className="text-emerald-400 font-semibold">● Aktif</span> di database
                    </div>
                </div>

                {/* Aspirasi Pending */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aspirasi Siswa</div>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg">
                            🗳️
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white mt-3 flex items-baseline gap-2">
                        {loading ? "..." : stats?.metrics.totalAspirations ?? 0}
                        <span className="text-xs font-semibold text-amber-400">
                            ({stats?.metrics.pendingAspirations ?? 0} Perlu Tanggapan)
                        </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                        Advokasi & Aspirasi Komisi B
                    </div>
                </div>

                {/* Program Kerja */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Program Kerja</div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg">
                            📋
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white mt-3 flex items-baseline gap-2">
                        {loading ? "..." : stats?.metrics.totalWorkPrograms ?? 0}
                        <span className="text-xs font-semibold text-emerald-400">
                            ({stats?.metrics.ongoingWorkPrograms ?? 0} Berjalan)
                        </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                        Sekbid OSIS & Komisi MPK
                    </div>
                </div>

                {/* Presensi Aktif */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-purple-500/40 transition-all">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sesi Presensi QR</div>
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg">
                            ⏱️
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white mt-3">
                        {loading ? "..." : stats?.metrics.activeAttendanceSessions ?? 0}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                        Sesi terbuka untuk check-in
                    </div>
                </div>
            </div>

            {/* Two Column Layout: Active Sessions & Recent Aspirations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active / Recent Sessions */}
                <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <span className="text-lg">⏱️</span>
                                <h2 className="text-base font-bold text-white">Sesi Presensi Terbuka</h2>
                            </div>
                            <Link
                                href="/admin/attendance"
                                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                            >
                                Kelola Semua →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="py-8 text-center text-slate-500 text-xs">Memuat data sesi...</div>
                        ) : !stats?.recentSessions || stats.recentSessions.length === 0 ? (
                            <div className="py-8 text-center border border-dashed border-slate-800 rounded-2xl p-6">
                                <div className="text-2xl mb-2">📭</div>
                                <div className="text-xs font-semibold text-slate-300">Tidak ada sesi presensi yang sedang buka</div>
                                <p className="text-[11px] text-slate-500 mt-1">Buat sesi rapat atau piket baru untuk mengaktifkan QR check-in.</p>
                                <Link
                                    href="/admin/attendance"
                                    className="mt-4 inline-block px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                                >
                                    + Buat Sesi Baru
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.recentSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="text-xs font-bold text-white">{session.title}</div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">
                                                📍 {session.location || "SMKN 11 Bandung"} • Mulai {session.startTime || "-"}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                                                {session._count.records} Hadir
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Aspirations */}
                <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <span className="text-lg">🗳️</span>
                                <h2 className="text-base font-bold text-white">Aspirasi Siswa Terbaru</h2>
                            </div>
                            <Link
                                href="/admin/aspirations"
                                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                            >
                                Lihat Semua ({stats?.metrics.totalAspirations || 0}) →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="py-8 text-center text-slate-500 text-xs">Memuat data aspirasi...</div>
                        ) : !stats?.recentAspirations || stats.recentAspirations.length === 0 ? (
                            <div className="py-8 text-center border border-dashed border-slate-800 rounded-2xl p-6">
                                <div className="text-2xl mb-2">📬</div>
                                <div className="text-xs font-semibold text-slate-300">Belum ada aspirasi masuk</div>
                                <p className="text-[11px] text-slate-500 mt-1">Aspirasi siswa yang dikirim via portal akan muncul di sini.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.recentAspirations.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
                                    >
                                        <div className="min-w-0 flex-1 pr-3">
                                            <div className="text-xs font-bold text-white truncate">{item.title}</div>
                                            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                                                Oleh: {item.user?.name || "Anonim"} ({item.user?.kelas || "Siswa"}) • {item.category}
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                                    item.status === "PENDING"
                                                        ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                                        : item.status === "RESOLVED" || item.status === "APPROVED"
                                                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                                        : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Access Matrix */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Pintasan Manajemen Organisasi
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <Link
                        href="/admin/aspirations"
                        className="p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-center transition-all group"
                    >
                        <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🗳️</div>
                        <div className="text-xs font-bold text-slate-200">Kotak Aspirasi</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Tanggapi Siswa</div>
                    </Link>

                    <Link
                        href="/admin/work-programs"
                        className="p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-center transition-all group"
                    >
                        <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">📋</div>
                        <div className="text-xs font-bold text-slate-200">Program Kerja</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">RAB & LPJ Proker</div>
                    </Link>

                    <Link
                        href="/admin/attendance"
                        className="p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-center transition-all group"
                    >
                        <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">⏱️</div>
                        <div className="text-xs font-bold text-slate-200">Presensi & QR</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Rapat & Piket</div>
                    </Link>

                    <Link
                        href="/admin/tasks"
                        className="p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-center transition-all group"
                    >
                        <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">📌</div>
                        <div className="text-xs font-bold text-slate-200">Tugas Anggota</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Delegasi Kerja</div>
                    </Link>

                    <Link
                        href="/admin/activities"
                        className="p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-center transition-all group"
                    >
                        <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">📰</div>
                        <div className="text-xs font-bold text-slate-200">Publikasi Berita</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">CMS Dokumentasi</div>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-center transition-all group"
                    >
                        <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">👥</div>
                        <div className="text-xs font-bold text-slate-200">Kelola Akun</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Admin & Kesiswaan</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
