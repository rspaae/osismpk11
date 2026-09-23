"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DIVISIONS_METADATA } from "@/lib/permissions";

interface MyRecord {
    id: string;
    sessionId: string;
    status: "PRESENT" | "LATE" | "PERMISSION" | "SICK" | "ABSENT";
    checkInTime: string;
    notes: string | null;
    session: {
        id: string;
        title: string;
        type: string;
        targetDivision: string;
        date: string;
        startTime: string | null;
        endTime: string | null;
        location: string | null;
        isOpen: boolean;
    };
}

const STATUS_CONFIG = {
    PRESENT: { label: "Hadir", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", icon: "✅" },
    LATE: { label: "Terlambat", bg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20", icon: "⏰" },
    PERMISSION: { label: "Izin", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", icon: "📋" },
    SICK: { label: "Sakit", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", icon: "🏥" },
    ABSENT: { label: "Tidak Hadir", bg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", icon: "❌" },
};

export default function StudentAttendanceHistoryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [records, setRecords] = useState<MyRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/attendance/my-records?limit=100");
            const json = await res.json();
            setRecords(Array.isArray(json) ? json : json.data || []);
        } catch (error) {
            console.error("Gagal memuat riwayat absensi:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (session) {
            fetchRecords();
        }
    }, [session, fetchRecords]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    const filtered = records.filter(r => {
        if (filterStatus === "ALL") return true;
        return r.status === filterStatus;
    });

    const summary = {
        total: records.length,
        present: records.filter(r => r.status === "PRESENT").length,
        permission: records.filter(r => r.status === "PERMISSION").length,
        sick: records.filter(r => r.status === "SICK").length,
        absent: records.filter(r => r.status === "ABSENT").length,
    };

    return (
        <main className="min-h-screen pt-24 md:pt-32 pb-16 px-4 md:px-6 bg-brand-soft/50 dark:bg-background">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/student/attendance" className="text-foreground/50 hover:text-foreground text-xs font-bold transition-all">
                                ← Absen Sekarang
                            </Link>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                            📋 Riwayat Absensi Saya
                        </h1>
                        <p className="text-foreground/50 text-sm font-medium mt-1">
                            Daftar catatan kehadiran kamu di setiap kegiatan organisasi
                        </p>
                    </div>
                    <Link
                        href="/student/attendance"
                        className="self-start md:self-auto px-5 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-brand-primary/90 transition-all"
                    >
                        + Buka Absensi Aktif
                    </Link>
                </div>

                {/* Summary Mini Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="glass border border-border/50 rounded-2xl p-4 text-center">
                        <p className="text-foreground/40 text-[11px] font-bold uppercase tracking-wider mb-1">Total Kegiatan</p>
                        <p className="text-2xl font-black text-foreground">🎯 {summary.total}</p>
                    </div>
                    <div className="glass border border-border/50 rounded-2xl p-4 text-center">
                        <p className="text-emerald-500/70 text-[11px] font-bold uppercase tracking-wider mb-1">Hadir</p>
                        <p className="text-2xl font-black text-emerald-500">✅ {summary.present}</p>
                    </div>
                    <div className="glass border border-border/50 rounded-2xl p-4 text-center">
                        <p className="text-blue-500/70 text-[11px] font-bold uppercase tracking-wider mb-1">Izin / Sakit</p>
                        <p className="text-2xl font-black text-blue-500">📋 {summary.permission + summary.sick}</p>
                    </div>
                    <div className="glass border border-border/50 rounded-2xl p-4 text-center">
                        <p className="text-red-500/70 text-[11px] font-bold uppercase tracking-wider mb-1">Tidak Hadir</p>
                        <p className="text-2xl font-black text-red-500">❌ {summary.absent}</p>
                    </div>
                </div>

                {/* Filter & Action */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground/50">Filter:</span>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand-primary"
                        >
                            <option value="ALL">Semua Status</option>
                            <option value="PRESENT">Hadir</option>
                            <option value="PERMISSION">Izin</option>
                            <option value="SICK">Sakit</option>
                            <option value="ABSENT">Tidak Hadir</option>
                        </select>
                    </div>
                    <button
                        onClick={fetchRecords}
                        className="text-xs font-bold text-foreground/50 hover:text-foreground transition-all flex items-center gap-1"
                    >
                        🔄 Segarkan
                    </button>
                </div>

                {/* Records List */}
                {filtered.length === 0 ? (
                    <div className="glass border border-dashed border-border rounded-2xl p-12 text-center">
                        <p className="text-4xl mb-3">📄</p>
                        <p className="font-bold text-foreground/60 text-base">Belum Ada Riwayat Absensi</p>
                        <p className="text-foreground/40 text-xs mt-1">
                            Kamu belum memiliki catatan absensi kegiatan yang sesuai.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(r => {
                            const st = STATUS_CONFIG[r.status] || STATUS_CONFIG.PRESENT;
                            const divMeta = DIVISIONS_METADATA[r.session.targetDivision as keyof typeof DIVISIONS_METADATA];

                            return (
                                <div
                                    key={r.id}
                                    className="glass border border-border/60 hover:border-brand-primary/30 rounded-2xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${st.bg}`}>
                                                {st.icon} {st.label}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-foreground/5 text-foreground/60 border border-border/50">
                                                {divMeta?.icon} {divMeta?.label || r.session.targetDivision}
                                            </span>
                                        </div>
                                        <h3 className="font-black text-foreground text-base truncate">{r.session.title}</h3>
                                        <div className="flex flex-wrap gap-3 mt-1 text-foreground/50 text-xs font-medium">
                                            <span>
                                                📅 {new Date(r.session.date).toLocaleDateString("id-ID", {
                                                    day: "numeric", month: "long", year: "numeric"
                                                })}
                                            </span>
                                            {r.session.location && <span>📍 {r.session.location}</span>}
                                        </div>
                                        {r.notes && (
                                            <p className="text-foreground/40 text-xs mt-1.5 italic">
                                                Catatan: {r.notes}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-left sm:text-right flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-foreground/40">Waktu Check-in</p>
                                        <p className="font-mono text-sm font-bold text-foreground mt-0.5">
                                            {r.status === "PRESENT" || r.status === "LATE"
                                                ? new Date(r.checkInTime).toLocaleTimeString("id-ID", {
                                                    hour: "2-digit", minute: "2-digit", second: "2-digit"
                                                })
                                                : "—"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Back Link */}
                <div className="text-center mt-10">
                    <Link href="/student/dashboard" className="text-xs text-foreground/40 hover:text-foreground font-semibold transition-all">
                        ← Kembali ke Dashboard Siswa
                    </Link>
                </div>
            </div>
        </main>
    );
}
