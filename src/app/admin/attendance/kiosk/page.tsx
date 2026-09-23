"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface TappedUser {
    id: string;
    name: string;
    nis?: string | null;
    kelas?: string | null;
    role: string;
    division?: string | null;
    position?: string | null;
    image?: string | null;
    rfidCard?: string | null;
}

interface RecentAttendee {
    id: string;
    name: string;
    kelas?: string | null;
    position?: string | null;
    time: string;
    status: string;
}

function KioskContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("sessionId");

    const [sessionData, setSessionData] = useState<any>(null);
    const [loadingSession, setLoadingSession] = useState(true);
    const [rfidInput, setRfidInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Feedback States
    const [lastUser, setLastUser] = useState<TappedUser | null>(null);
    const [statusType, setStatusType] = useState<"IDLE" | "SUCCESS" | "ALREADY" | "ERROR">("IDLE");
    const [statusMessage, setStatusMessage] = useState("");
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [recentList, setRecentList] = useState<RecentAttendee[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    // Web Audio Synthesizer
    const playChime = (type: "SUCCESS" | "ALREADY" | "ERROR") => {
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            if (type === "SUCCESS") {
                // High pleasant double-tone
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
                osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.35);
            } else if (type === "ALREADY") {
                // Reminder gentle tone
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(659, ctx.currentTime);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            } else {
                // Low buzz error
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            }
        } catch (e) {
            console.log("Audio not allowed yet or not supported", e);
        }
    };

    // Keep input auto-focused continuously
    useEffect(() => {
        const focusInput = () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        };

        focusInput();
        const interval = setInterval(focusInput, 1500);
        window.addEventListener("click", focusInput);

        return () => {
            clearInterval(interval);
            window.removeEventListener("click", focusInput);
        };
    }, []);

    // Load Session Details & Existing Records
    useEffect(() => {
        if (!sessionId) {
            // Auto-load or create today's Sapa Pagi piket session
            fetch("/api/attendance/auto-piket?type=SAPA_PAGI")
                .then((r) => r.json())
                .then((data) => {
                    if (data.session?.id) {
                        router.replace(`/admin/attendance/kiosk?sessionId=${data.session.id}`);
                    } else {
                        setLoadingSession(false);
                    }
                })
                .catch(() => setLoadingSession(false));
            return;
        }

        const fetchSession = async () => {
            try {
                setLoadingSession(true);
                const [sessRes, recRes] = await Promise.all([
                    fetch(`/api/attendance/sessions`),
                    fetch(`/api/attendance/records?sessionId=${sessionId}`),
                ]);

                if (sessRes.ok) {
                    const sData = await sessRes.json();
                    const target = sData.data?.find((s: any) => s.id === sessionId);
                    setSessionData(target || null);
                }

                if (recRes.ok) {
                    const rData = await recRes.json();
                    const recList = rData.data || [];
                    setAttendeeCount(recList.length);
                    setRecentList(
                        recList.slice(-8).reverse().map((r: any) => ({
                            id: r.id,
                            name: r.user?.name || "Anggota",
                            kelas: r.user?.kelas,
                            position: r.user?.position || r.user?.role,
                            time: new Date(r.checkInTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                            status: r.status,
                        }))
                    );
                }
            } catch (err) {
                console.error("Gagal load session kiosk:", err);
            } finally {
                setLoadingSession(false);
            }
        };

        fetchSession();
    }, [sessionId, router]);

    // Handle RFID Tap (Scanner sends UID string followed by Enter)
    const handleRfidSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const uid = rfidInput.trim();
        if (!uid || !sessionId || isProcessing) return;

        try {
            setIsProcessing(true);
            setRfidInput("");

            const res = await fetch("/api/attendance/rfid-tap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    rfidCard: uid,
                }),
            });

            const data = await res.json();

            if (res.status === 201) {
                // Success New Check-in
                setStatusType("SUCCESS");
                setStatusMessage("PRESENSI BERHASIL!");
                setLastUser(data.user);
                setAttendeeCount(data.totalAttendees || attendeeCount + 1);
                playChime("SUCCESS");

                setRecentList((prev) => [
                    {
                        id: data.record?.id || String(Date.now()),
                        name: data.user?.name || "Anggota",
                        kelas: data.user?.kelas,
                        position: data.user?.position || data.user?.role,
                        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
                        status: "PRESENT",
                    },
                    ...prev.slice(0, 7),
                ]);
            } else if (res.status === 200 && data.alreadyCheckedIn) {
                // Already Checked In
                setStatusType("ALREADY");
                setStatusMessage("SUDAH ABSEN SEBELUMNYA");
                setLastUser(data.user);
                playChime("ALREADY");
            } else {
                // Card Not Registered or Error
                setStatusType("ERROR");
                setStatusMessage(data.message || data.error || "KARTU BELUM TERDAFTAR");
                setLastUser({
                    id: "",
                    name: "Kartu Belum Dikenali",
                    rfidCard: uid,
                    role: "UNREGISTERED",
                });
                playChime("ERROR");
            }
        } catch (error) {
            setStatusType("ERROR");
            setStatusMessage("Koneksi gagal saat membaca kartu");
            playChime("ERROR");
        } finally {
            setIsProcessing(false);
            // Auto clear pop-up status after 5 seconds
            setTimeout(() => {
                setStatusType((current) => (current !== "IDLE" ? "IDLE" : current));
            }, 5000);
        }
    };

    if (loadingSession) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="text-sm font-bold text-slate-300">Menyiapkan Terminal Kartu RFID...</div>
                </div>
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
                    <div className="text-4xl">⚠️</div>
                    <h2 className="text-xl font-bold">Tidak Ada Sesi Presensi Aktif</h2>
                    <p className="text-xs text-slate-400">
                        Buka atau buat sesi presensi terlebih dahulu di panel admin sebelum mengaktifkan mode Terminal RFID.
                    </p>
                    <Link
                        href="/admin/attendance"
                        className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                    >
                        Ke Menu Presensi →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 select-none relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Hidden / Auto-focused RFID Scanner Input */}
            <form onSubmit={handleRfidSubmit} className="opacity-0 absolute -top-96 left-0">
                <input
                    ref={inputRef}
                    type="text"
                    autoFocus
                    value={rfidInput}
                    onChange={(e) => setRfidInput(e.target.value)}
                    placeholder="Scan RFID here..."
                />
                <button type="submit">Submit</button>
            </form>

            {/* Top Bar Navigation & Session Information */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 relative z-10">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/attendance"
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Keluar Kiosk</span>
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Terminal RFID Reader Standby
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">{sessionData.title}</h1>
                        <div className="text-xs text-slate-400 mt-0.5">
                            📍 {sessionData.location || "Ruang OSIS-MPK SMKN 11"} • ⏰ {sessionData.startTime || "-"} s.d. {sessionData.endTime || "-"} WIB
                        </div>
                    </div>
                </div>

                {/* Attendee Live Counter Badge */}
                <div className="flex items-center gap-3">
                    <div className="px-5 py-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-right shadow-lg">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Hadir</div>
                        <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
                            {attendeeCount} <span className="text-xs text-slate-400 font-normal">Orang</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Interactive Stage */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 my-6 items-center relative z-10">
                {/* Left Area: RFID Scanner Wave & Card Status */}
                <div className="lg:col-span-8 flex flex-col items-center justify-center text-center p-6 md:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm min-h-[420px]">
                    {statusType === "IDLE" ? (
                        <div className="space-y-6 animate-fade-in">
                            {/* Animated Concentric RFID Waves */}
                            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping duration-1000" />
                                <div className="absolute inset-4 rounded-full border border-emerald-500/20 animate-pulse" />
                                <div className="absolute inset-8 rounded-full border-2 border-dashed border-emerald-500/40 animate-spin duration-700" />
                                <div className="w-24 h-24 rounded-2xl bg-emerald-600/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/20">
                                    💳
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-extrabold text-white">TEMPELKAN KARTU RFID ANDA</h2>
                                <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                                    Dekatkan Kartu Pelajar / Kartu Anggota OSIS-MPK SMKN 11 Bandung ke atas reader sensor.
                                </p>
                            </div>

                            {/* Manual Simulator Input for Testing */}
                            <div className="pt-4 max-w-xs mx-auto">
                                <form onSubmit={handleRfidSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ketik UID / NIS untuk test..."
                                        value={rfidInput}
                                        onChange={(e) => setRfidInput(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-center text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                                    />
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                                    >
                                        Tap
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        /* Tapped Card Pop-up Screen */
                        <div className="w-full max-w-md p-6 rounded-3xl bg-slate-800/90 border-2 border-emerald-500/60 shadow-2xl space-y-4 animate-scale-up">
                            <div
                                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${
                                    statusType === "SUCCESS"
                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                        : statusType === "ALREADY"
                                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                }`}
                            >
                                <span>{statusType === "SUCCESS" ? "✅" : statusType === "ALREADY" ? "ℹ️" : "⚠️"}</span>
                                <span>{statusMessage}</span>
                            </div>

                            {/* User Identity Card */}
                            {lastUser && (
                                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-center space-y-3 shadow-inner">
                                    <div className="w-20 h-20 rounded-2xl bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center text-3xl font-black text-emerald-300 mx-auto shadow-md">
                                        {lastUser.name ? lastUser.name.charAt(0).toUpperCase() : "?"}
                                    </div>

                                    <div>
                                        <div className="text-lg font-black text-white">{lastUser.name}</div>
                                        <div className="text-xs text-emerald-400 font-bold mt-0.5">
                                            {lastUser.kelas || "Siswa SMKN 11"} {lastUser.nis ? `• NIS: ${lastUser.nis}` : ""}
                                        </div>
                                    </div>

                                    <div className="inline-block px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700">
                                        {lastUser.position || lastUser.role.replace(/_/g, " ")}
                                    </div>

                                    {lastUser.rfidCard && (
                                        <div className="text-[10px] font-mono text-slate-500">
                                            UID Kartu: {lastUser.rfidCard}
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={() => setStatusType("IDLE")}
                                className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-colors"
                            >
                                Lanjut Tap Kartu Berikutnya (Spasi / Otomatis)
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Area: Real-Time Live Attendees Feed */}
                <div className="lg:col-span-4 bg-slate-900/80 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between h-full min-h-[420px]">
                    <div>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <span className="text-base">📋</span>
                                <h3 className="text-sm font-bold text-white">Daftar Kehadiran Terkini</h3>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-semibold uppercase">Live Feed</span>
                        </div>

                        {recentList.length === 0 ? (
                            <div className="py-16 text-center text-slate-500 text-xs">
                                <div className="text-2xl mb-2">📭</div>
                                Belum ada anggota yang tap kartu pada sesi ini.
                            </div>
                        ) : (
                            <div className="space-y-2.5 overflow-y-auto max-h-96 custom-scrollbar pr-1">
                                {recentList.map((item, idx) => (
                                    <div
                                        key={item.id + idx}
                                        className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs animate-fade-in"
                                    >
                                        <div className="min-w-0">
                                            <div className="font-bold text-white truncate">{item.name}</div>
                                            <div className="text-[11px] text-slate-400 truncate">
                                                {item.kelas || item.position || "Anggota"}
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-mono text-emerald-400 text-[11px] font-bold">
                                                {item.time}
                                            </div>
                                            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                                                HADIR
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-slate-800 text-center">
                        <div className="text-[11px] text-slate-500">
                            Sistem Presensi RFID Otomatis • OSIS-MPK SMKN 11 Bandung
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Status Bar */}
            <footer className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
                <div>
                    Status Sensor: <span className="text-emerald-400 font-bold font-mono">● READY FOR TAP</span>
                </div>
                <div className="text-slate-500">
                    Tekan tombol apa saja pada keyboard / reader untuk memicu scan RFID
                </div>
            </footer>
        </div>
    );
}

export default function AttendanceKioskPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Memuat...</div>}>
            <KioskContent />
        </Suspense>
    );
}
