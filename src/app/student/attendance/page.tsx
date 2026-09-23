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

    useEffect(() => {
        if (session) fetchData();
    }, [session, fetchData]);

    const getMyRecord = (sessionId: string) =>
        myRecords.find(r => r.sessionId === sessionId);

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
                showToast("Kamu sudah melakukan absensi di kegiatan ini sebelumnya.", "info");
            } else if (res.status === 201) {
                showToast("✅ Absensi berhasil dicatat! Selamat hadir.");
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
            <div className="min-h-screen flex items-center justify-center pt-24 bg-[#f7faf7] dark:bg-[#141c18]">
                <div className="w-8 h-8 border-3 border-[#468366]/30 border-t-[#468366] rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    const toastColors: Record<string, string> = {
        success: "bg-[#e8f2ec] border-[#d4e6db] text-[#2b6144]",
        error: "bg-[#fae8e8] border-[#f0c2c2] text-[#8c3636]",
        info: "bg-[#e6effa] border-[#c2d7ed] text-[#335982]",
    };

    return (
        <main className="min-h-screen pt-24 md:pt-32 pb-16 px-4 md:px-6 bg-[#f7faf7] dark:bg-[#141c18] text-[#334139] dark:text-[#dce6e0]">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs border ${toastColors[toast.type]}`}>
                    {toast.msg}
                </div>
            )}

            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#2c3831] dark:text-[#dce6e0]">
                            📅 Absensi Kegiatan
                        </h1>
                        <Link
                            href="/student/attendance/history"
                            className="px-3.5 py-1.5 text-xs font-semibold border border-[#d2ded6] dark:border-[#24342c] rounded-xl hover:bg-[#edf5f0] transition-colors text-[#5f7167] dark:text-[#a5b8ad]"
                        >
                            📋 Riwayat Saya
                        </Link>
                    </div>
                    <p className="text-[#5f7167] dark:text-[#a5b8ad] text-xs sm:text-sm">
                        Kegiatan Sekbid OSIS yang sedang membuka sesi absensi
                    </p>
                </div>

                {/* Account Card */}
                {session.user && (
                    <div className="bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-4 mb-5 flex items-center gap-3 shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-[#e8f2ec] dark:bg-[#1d2c25] flex items-center justify-center text-base font-bold text-[#396953] dark:text-[#a3d4bd]">
                            {(session.user.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-[#2c3831] dark:text-[#dce6e0]">{session.user.name || "Pengguna"}</p>
                            <p className="text-[#8a9a91] text-xs">
                                {session.user.kelas ? `${session.user.kelas} · ` : ""}
                                Absensi tercatat atas nama akun ini
                            </p>
                        </div>
                    </div>
                )}

                {/* Refresh */}
                <div className="flex justify-end mb-3">
                    <button
                        onClick={fetchData}
                        className="text-xs font-semibold text-[#5f7167] hover:text-[#468366] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        🔄 Muat Ulang
                    </button>
                </div>

                {/* Sessions */}
                {openSessions.length === 0 ? (
                    <div className="bg-white dark:bg-[#19241f] border border-dashed border-[#d2ded6] dark:border-[#24342c] rounded-2xl p-10 text-center">
                        <p className="text-3xl mb-3">📭</p>
                        <p className="font-bold text-[#2c3831] dark:text-[#dce6e0] text-base">Tidak Ada Kegiatan Aktif</p>
                        <p className="text-[#8a9a91] text-xs mt-1">
                            Belum ada kegiatan Sekbid yang membuka absensi saat ini.
                        </p>
                        <Link href="/student/attendance/history" className="inline-block mt-4 text-xs font-semibold text-[#468366] hover:underline">
                            Lihat riwayat absensi kamu →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3.5">
                        {openSessions.map(s => {
                            const myRec = getMyRecord(s.id);
                            const divMeta = DIVISIONS_METADATA[s.targetDivision as keyof typeof DIVISIONS_METADATA];
                            const alreadyDone = !!myRec;

                            return (
                                <div
                                    key={s.id}
                                    className={`bg-white dark:bg-[#19241f] border rounded-2xl p-5 transition-all shadow-xs ${
                                        alreadyDone
                                            ? "border-[#d4e6db] dark:border-[#24342c]"
                                            : "border-[#e3ece6] dark:border-[#24342c] hover:border-[#468366]/40"
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Badges */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8f2ec] dark:bg-[#1d2c25] text-[#396953] dark:text-[#a3d4bd] border border-[#d4e6db] dark:border-[#24342c]">
                                                    🟢 Dibuka
                                                </span>
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#f7faf7] dark:bg-[#141c18] text-[#5f7167] dark:text-[#a5b8ad] border border-[#e3ece6] dark:border-[#24342c]">
                                                    {divMeta?.icon} {divMeta?.label || s.targetDivision}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-bold text-[#2c3831] dark:text-[#dce6e0] text-sm md:text-base leading-snug">{s.title}</h3>

                                            {/* Details */}
                                            <div className="flex flex-wrap gap-3 mt-1.5 text-[#8a9a91] text-xs">
                                                <span>
                                                    📅 {new Date(s.date).toLocaleDateString("id-ID", {
                                                        weekday: "long", day: "numeric", month: "short", year: "numeric"
                                                    })}
                                                </span>
                                                {s.startTime && (
                                                    <span>🕒 {s.startTime}{s.endTime ? ` — ${s.endTime}` : ""}</span>
                                                )}
                                                {s.location && <span>📍 {s.location}</span>}
                                            </div>

                                            {s.description && (
                                                <p className="text-[#5f7167] dark:text-[#a5b8ad] text-xs mt-2">{s.description}</p>
                                            )}

                                            <p className="text-[#8a9a91] text-[11px] mt-2">{s._count.records} peserta sudah absen</p>
                                        </div>

                                        {/* CTA */}
                                        <div className="shrink-0">
                                            {alreadyDone ? (
                                                <div className="text-right">
                                                    <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#e8f2ec] dark:bg-[#1d2c25] border border-[#d4e6db] dark:border-[#24342c] rounded-xl">
                                                        <span className="text-[#396953]">✓</span>
                                                        <div>
                                                            <p className="text-[#396953] dark:text-[#a3d4bd] text-xs font-bold">Sudah Absen</p>
                                                            <p className="text-[#5f7167] dark:text-[#a5b8ad] text-[10px]">
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
                                                    className="px-4 py-2.5 bg-[#468366] hover:bg-[#396953] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
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

                {/* Back to dashboard */}
                <div className="text-center mt-8">
                    <Link href="/student/dashboard" className="text-xs text-[#5f7167] hover:text-[#468366] font-semibold transition-colors">
                        ← Kembali ke Dashboard
                    </Link>
                </div>
            </div>

            {/* ── Modal Konfirmasi Absensi ──────────────────────────── */}
            {confirmSession && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget && !submitting) setConfirmSession(null); }}
                >
                    <div className="bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-3xl w-full max-w-sm shadow-xl p-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#e8f2ec] dark:bg-[#1d2c25] flex items-center justify-center text-2xl mx-auto mb-4 text-[#396953]">
                            📋
                        </div>
                        <h2 className="text-lg font-bold text-[#2c3831] dark:text-[#dce6e0] text-center mb-1">
                            Konfirmasi Absensi
                        </h2>
                        <p className="text-[#5f7167] dark:text-[#a5b8ad] text-xs text-center mb-4">
                            Absensi tidak dapat dibatalkan setelah dikonfirmasi.
                        </p>

                        <div className="bg-[#f7faf7] dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-4 mb-5 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-[#5f7167]">Kegiatan</span>
                                <span className="text-[#2c3831] dark:text-[#dce6e0] font-semibold text-right max-w-[60%]">{confirmSession.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#5f7167]">Sekbid</span>
                                <span className="text-[#2c3831] dark:text-[#dce6e0] font-semibold">
                                    {DIVISIONS_METADATA[confirmSession.targetDivision as keyof typeof DIVISIONS_METADATA]?.label}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#5f7167]">Tanggal</span>
                                <span className="text-[#2c3831] dark:text-[#dce6e0] font-semibold">
                                    {new Date(confirmSession.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#5f7167]">Atas nama</span>
                                <span className="text-[#2c3831] dark:text-[#dce6e0] font-semibold">{session.user?.name || "Kamu"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#5f7167]">Status</span>
                                <span className="text-[#396953] dark:text-[#a3d4bd] font-bold">✓ Hadir</span>
                            </div>
                        </div>

                        <div className="flex gap-2.5">
                            <button
                                onClick={() => setConfirmSession(null)}
                                disabled={submitting}
                                className="flex-1 py-2.5 border border-[#d2ded6] dark:border-[#24342c] rounded-xl text-xs font-semibold text-[#5f7167] hover:bg-[#edf5f0] transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAbsen}
                                disabled={submitting}
                                className="flex-1 py-2.5 bg-[#468366] hover:bg-[#396953] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                            >
                                {submitting ? "Mencatat..." : "Ya, Absen"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
