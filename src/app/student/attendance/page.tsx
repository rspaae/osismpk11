"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DIVISIONS_METADATA } from "@/lib/permissions";

// ─── Types ──────────────────────────────────────────────────────────────────
interface OpenSession {
    id: string;
    title: string;
    targetDivision: string;
    location: string | null;
    date: string;
    startTime: string | null;
    endTime: string | null;
    isOpen: boolean;
    description: string | null;
    _count: { records: number };
}

interface MyRecord {
    sessionId: string;
    status: string;
    checkInTime: string;
}

export default function StudentAttendancePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [openSessions, setOpenSessions] = useState<OpenSession[]>([]);
    const [myRecords, setMyRecords] = useState<MyRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal confirm
    const [confirmSession, setConfirmSession] = useState<OpenSession | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

    const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [sessRes, recRes] = await Promise.all([
                fetch("/api/attendance/sessions?divisionGroup=SEKBID&isOpen=true"),
                fetch("/api/attendance/my-records?limit=100"),
            ]);
            const [sessJson, recJson] = await Promise.all([sessRes.json(), recRes.json()]);
            setOpenSessions(Array.isArray(sessJson) ? sessJson : sessJson.data || []);
            setMyRecords(Array.isArray(recJson) ? recJson : recJson.data || []);
        } catch {
            showToast("Gagal memuat data", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const getMyRecord = (sessionId: string) =>
        myRecords.find(r => r.sessionId === sessionId);

    // ── Submit Absensi ──────────────────────────────────────────────────────
    const handleAbsen = async () => {
        if (!confirmSession) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/attendance/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: confirmSession.id }),
            });
            const json = await res.json();
            if (res.status === 200 && json.data) {
                // Already checked in
                showToast("Kamu sudah melakukan absensi di kegiatan ini sebelumnya.", "info");
            } else if (res.status === 201) {
                showToast("✅ Absensi berhasil dicatat! Selamat hadir.");
                // Update local myRecords
                setMyRecords(prev => [...prev, {
                    sessionId: confirmSession.id,
                    status: "PRESENT",
                    checkInTime: new Date().toISOString(),
                }]);
            } else {
                showToast(json.error || "Gagal melakukan absensi", "error");
            }
        } catch {
            showToast("Gagal terhubung ke server", "error");
        } finally {
            setSubmitting(false);
            setConfirmSession(null);
        }
    };

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

    const toastColors: Record<string, string> = {
        success: "bg-emerald-900/90 border-emerald-500/40 text-emerald-300",
        error: "bg-red-900/90 border-red-500/40 text-red-300",
        info: "bg-blue-900/90 border-blue-500/40 text-blue-300",
    };

    return (
        <main className="min-h-screen pt-24 md:pt-32 pb-16 px-4 md:px-6 bg-brand-soft/50 dark:bg-background">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-bold shadow-2xl border ${toastColors[toast.type]}`}>
                    {toast.msg}
                </div>
            )}

            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                            📅 Absensi Kegiatan
                        </h1>
                        <Link
                            href="/student/attendance/history"
                            className="px-4 py-2 text-xs font-bold border border-border rounded-xl hover:bg-foreground/5 transition-all text-foreground/70 hover:text-foreground"
                        >
                            📋 Riwayat Saya
                        </Link>
                    </div>
                    <p className="text-foreground/50 text-sm font-medium">
                        Kegiatan Sekbid OSIS yang sedang membuka absensi
                    </p>
                </div>

                {/* Absensi kamu */}
                {session.user && (
                    <div className="glass border border-border/50 rounded-2xl p-5 mb-6 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-brand-primary/10 flex items-center justify-center text-lg font-black text-brand-primary">
                            {(session.user.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-black text-foreground">{session.user.name || "Pengguna"}</p>
                            <p className="text-foreground/50 text-xs">
                                {session.user.kelas ? `${session.user.kelas} · ` : ""}
                                Absensi tercatat atas nama akun ini
                            </p>
                        </div>
                    </div>
                )}

                {/* Refresh */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={fetchData}
                        className="text-xs font-bold text-foreground/40 hover:text-foreground/70 transition-all flex items-center gap-1.5"
                    >
                        🔄 Muat Ulang
                    </button>
                </div>

                {/* Sessions */}
                {openSessions.length === 0 ? (
                    <div className="glass border border-dashed border-border rounded-2xl p-12 text-center">
                        <p className="text-4xl mb-4">📭</p>
                        <p className="font-black text-foreground/60 text-lg">Tidak Ada Kegiatan Aktif</p>
                        <p className="text-foreground/40 text-sm mt-2">
                            Belum ada kegiatan Sekbid yang sedang membuka absensi saat ini.
                        </p>
                        <Link href="/student/attendance/history" className="inline-block mt-5 text-sm font-bold text-brand-primary hover:underline">
                            Lihat riwayat absensi kamu →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {openSessions.map(s => {
                            const myRec = getMyRecord(s.id);
                            const divMeta = DIVISIONS_METADATA[s.targetDivision as keyof typeof DIVISIONS_METADATA];
                            const alreadyDone = !!myRec;

                            return (
                                <div
                                    key={s.id}
                                    className={`glass border rounded-2xl p-5 transition-all ${
                                        alreadyDone
                                            ? "border-emerald-500/30 bg-emerald-500/5"
                                            : "border-border/60 hover:border-brand-primary/30"
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Badges */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                    🟢 Dibuka
                                                </span>
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-foreground/5 text-foreground/60 border border-border/50">
                                                    {divMeta?.icon} {divMeta?.label || s.targetDivision}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-black text-foreground text-base leading-snug">{s.title}</h3>

                                            {/* Details */}
                                            <div className="flex flex-wrap gap-3 mt-1.5 text-foreground/50 text-xs font-medium">
                                                <span>
                                                    📅 {new Date(s.date).toLocaleDateString("id-ID", {
                                                        weekday: "long", day: "numeric", month: "long", year: "numeric"
                                                    })}
                                                </span>
                                                {s.startTime && (
                                                    <span>🕒 {s.startTime}{s.endTime ? ` — ${s.endTime}` : ""}</span>
                                                )}
                                                {s.location && <span>📍 {s.location}</span>}
                                            </div>

                                            {s.description && (
                                                <p className="text-foreground/40 text-xs mt-2">{s.description}</p>
                                            )}

                                            <p className="text-foreground/30 text-xs mt-2">{s._count.records} peserta sudah absen</p>
                                        </div>

                                        {/* CTA */}
                                        <div className="flex-shrink-0">
                                            {alreadyDone ? (
                                                <div className="text-right">
                                                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                                                        <span className="text-emerald-500 text-base">✅</span>
                                                        <div>
                                                            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-black">Sudah Absen</p>
                                                            <p className="text-emerald-500/70 text-[10px] font-semibold">
                                                                {new Date(myRec!.checkInTime).toLocaleTimeString("id-ID", {
                                                                    hour: "2-digit", minute: "2-digit"
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmSession(s)}
                                                    className="px-5 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-brand-primary/20"
                                                >
                                                    Absen Sekarang →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Link ke dashboard */}
                <div className="text-center mt-10">
                    <Link href="/student/dashboard" className="text-sm text-foreground/40 hover:text-foreground/70 font-semibold transition-all">
                        ← Kembali ke Dashboard
                    </Link>
                </div>
            </div>

            {/* ── Modal Konfirmasi Absensi ──────────────────────────── */}
            {confirmSession && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget && !submitting) setConfirmSession(null); }}
                >
                    <div className="bg-background border border-border rounded-3xl w-full max-w-sm shadow-2xl">
                        <div className="p-6">
                            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-3xl mx-auto mb-5">
                                📋
                            </div>
                            <h2 className="text-xl font-black text-foreground text-center mb-1">
                                Konfirmasi Absensi
                            </h2>
                            <p className="text-foreground/50 text-sm text-center mb-5">
                                Absensi tidak dapat dibatalkan setelah dikonfirmasi.
                            </p>

                            <div className="bg-foreground/[0.03] border border-border/60 rounded-2xl p-4 mb-5 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-foreground/50">Kegiatan</span>
                                    <span className="text-foreground font-bold text-right max-w-[60%]">{confirmSession.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground/50">Sekbid</span>
                                    <span className="text-foreground font-bold">
                                        {DIVISIONS_METADATA[confirmSession.targetDivision as keyof typeof DIVISIONS_METADATA]?.label}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground/50">Tanggal</span>
                                    <span className="text-foreground font-bold">
                                        {new Date(confirmSession.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground/50">Atas nama</span>
                                    <span className="text-foreground font-bold">{session.user?.name || "Kamu"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-foreground/50">Status</span>
                                    <span className="text-emerald-500 font-black">✅ Hadir</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmSession(null)}
                                    disabled={submitting}
                                    className="flex-1 py-3 border border-border rounded-2xl text-sm font-bold text-foreground/60 hover:text-foreground transition-all disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleAbsen}
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-60"
                                >
                                    {submitting ? "Mencatat..." : "Ya, Absen Sekarang"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
