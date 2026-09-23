"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    SAPA_PAGI_ROSTER,
    DANUS_ROSTER,
    getIndonesianDayName,
    getCalculatedPiketWeek,
    PiketOfficer,
    ScheduleSwap
} from "@/lib/piketSchedule";

interface ChecklistItem {
    id: string;
    name: string;
    org: "OSIS" | "MPK";
    division?: string;
    user: any | null;
    isChecked: boolean;
    status: "PRESENT" | "LATE" | "PERMISSION" | "SICK" | "ABSENT";
    checkInTime: string | null;
    isOnTime: boolean;
    notes: string | null;
    isSwapped?: boolean;
    swapInfo?: string;
}

interface SummaryData {
    totalScheduled: number;
    present: number;
    onTime: number;
    late: number;
    permission: number;
    absent: number;
}

const DAYS = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"] as const;

export default function AutoPiketAttendancePage() {
    const { data: session } = useSession();

    const userRole = (session?.user?.role as string) || "GUEST";
    const userDivision = session?.user?.division;

    const isSuperOrBPH = ["ADMINISTRATOR", "KESISWAAN", "PEMBINA", "KEPALA_SEKOLAH", "BPH_OSIS", "BPH_MPK"].includes(userRole);
    const hasSapaPagiAccess = isSuperOrBPH || userDivision === "SEKBID_2";
    const hasDanusAccess = isSuperOrBPH || userDivision === "SEKBID_6";

    // State Pengaturan Roster, Tanggal & Hari
    const [dutyType, setDutyType] = useState<"SAPA_PAGI" | "DANUS">("SAPA_PAGI");

    // Sinkronisasi tipe piket default berdasarkan divisi pengurus
    useEffect(() => {
        if (!hasSapaPagiAccess && hasDanusAccess) {
            setDutyType("DANUS");
            setExportType("DANUS");
        } else if (hasSapaPagiAccess && !hasDanusAccess) {
            setDutyType("SAPA_PAGI");
            setExportType("SAPA_PAGI");
        }
    }, [hasSapaPagiAccess, hasDanusAccess]);

    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [selectedWeek, setSelectedWeek] = useState<1 | 2>(1);
    const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>("SENIN");

    // Live Data Checklist
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [summary, setSummary] = useState<SummaryData>({
        totalScheduled: 0,
        present: 0,
        onTime: 0,
        late: 0,
        permission: 0,
        absent: 0,
    });
    const [loading, setLoading] = useState(true);

    // Fast RFID / Barcode Scan Input
    const [scanInput, setScanInput] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const scanInputRef = useRef<HTMLInputElement>(null);

    // Toast Notification & Audio Feedback
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);

    // Export Spreadsheet State
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [exportType, setExportType] = useState<"ALL" | "SAPA_PAGI" | "DANUS">("ALL");
    const [exportCategory, setExportCategory] = useState<
        "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "SPECIFIC_DATE" | "SPECIFIC_MONTH" | "CUSTOM_RANGE" | "FULL_PERIOD"
    >("THIS_MONTH");
    const [exportSpecificDate, setExportSpecificDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [exportMonth, setExportMonth] = useState<string>(new Date().toISOString().slice(0, 7));
    const [exportStartDate, setExportStartDate] = useState<string>("");
    const [exportEndDate, setExportEndDate] = useState<string>("");

    // ── Tukar Jadwal State ───────────────────────────────────────────────────
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [swapsList, setSwapsList] = useState<ScheduleSwap[]>([]);
    const [swapSourceWeek, setSwapSourceWeek] = useState<1 | 2>(1);
    const [swapSourceDay, setSwapSourceDay] = useState<string>("SENIN");
    const [swapSourceOfficer, setSwapSourceOfficer] = useState<string>("");
    const [swapTargetWeek, setSwapTargetWeek] = useState<1 | 2>(1);
    const [swapTargetDay, setSwapTargetDay] = useState<string>("SELASA");
    const [swapTargetOfficer, setSwapTargetOfficer] = useState<string>("");
    const [swapSpecificDate, setSwapSpecificDate] = useState<string>("");
    const [swapReason, setSwapReason] = useState<string>("");
    const [isSubmittingSwap, setIsSubmittingSwap] = useState(false);

    const showToast = (msg: string, type: "success" | "error" | "warning" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleDownloadExport = () => {
        let url = `/api/attendance/export?type=${exportType}&category=${exportCategory}`;
        if (exportCategory === "SPECIFIC_DATE" && exportSpecificDate) {
            url += `&date=${exportSpecificDate}`;
        } else if (exportCategory === "SPECIFIC_MONTH" && exportMonth) {
            url += `&month=${exportMonth}`;
        } else if (exportCategory === "CUSTOM_RANGE" && exportStartDate && exportEndDate) {
            url += `&startDate=${exportStartDate}&endDate=${exportEndDate}`;
        }
        window.open(url, "_blank");
        setIsExportOpen(false);
        showToast("Mengunduh rekapitulasi spreadsheet...", "success");
    };

    // Suara Chime Positif saat Tap Kartu
    const playChime = (isSuccess: boolean) => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (isSuccess) {
                osc.type = "sine";
                osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
                osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.35);
            } else {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            }
        } catch {
            // Audio not supported or blocked
        }
    };

    // Handler ganti tanggal spesifik di kalender dashboard
    const handleDateChange = (newDateStr: string) => {
        setSelectedDate(newDateStr);
        const target = new Date(newDateStr);
        const w = getCalculatedPiketWeek(target);
        const d = getIndonesianDayName(target);

        setSelectedWeek(w);
        if (DAYS.includes(d as any)) {
            setSelectedDay(d as any);
        }
    };

    const handleResetToday = () => {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        handleDateChange(todayStr);
    };

    // Inisialisasi Hari & Pekan Aktif saat pertama kali dimuat
    useEffect(() => {
        const today = new Date();
        const currentWeek = getCalculatedPiketWeek(today);
        const currentDay = getIndonesianDayName(today);

        setSelectedWeek(currentWeek);
        if (DAYS.includes(currentDay as any)) {
            setSelectedDay(currentDay as any);
        } else {
            setSelectedDay("SENIN");
        }
    }, []);

    // Fetch Data Otomatis
    const fetchAutoPiket = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/attendance/auto-piket?type=${dutyType}&week=${selectedWeek}&day=${selectedDay}&date=${selectedDate}`
            );
            const json = await res.json();
            if (json.success) {
                setChecklist(json.checklist || []);
                setSummary(json.summary || {
                    totalScheduled: 0,
                    present: 0,
                    onTime: 0,
                    late: 0,
                    permission: 0,
                    absent: 0,
                });
            }
        } catch (error) {
            console.error("Gagal memuat absensi otomatis:", error);
            showToast("Gagal memuat jadwal & absensi", "error");
        } finally {
            setLoading(false);
        }
    }, [dutyType, selectedWeek, selectedDay, selectedDate]);

    // Fetch Active Swaps
    const fetchSwaps = useCallback(async () => {
        try {
            const res = await fetch(`/api/attendance/swap-schedule?type=${dutyType}`);
            const json = await res.json();
            if (json.success) {
                setSwapsList(json.data || []);
            }
        } catch {}
    }, [dutyType]);

    useEffect(() => {
        fetchAutoPiket();
        fetchSwaps();
    }, [fetchAutoPiket, fetchSwaps]);

    // Handle Tap RFID / Barcode Scan / Nama
    const handleScanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = scanInput.trim();
        if (!query) return;

        setIsScanning(true);
        try {
            const res = await fetch("/api/attendance/auto-piket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    officerName: query,
                    rfidCard: query,
                    nis: query,
                    dutyType,
                    date: selectedDate,
                }),
            });
            const json = await res.json();

            if (res.ok && json.success) {
                playChime(true);
                showToast(json.message, json.isOnTime ? "success" : "warning");
                setScanInput("");
                fetchAutoPiket();
            } else {
                playChime(false);
                showToast(json.error || "Gagal mencatat kehadiran", "error");
            }
        } catch {
            playChime(false);
            showToast("Terjadi kesalahan jaringan", "error");
        } finally {
            setIsScanning(false);
            scanInputRef.current?.focus();
        }
    };

    // Handle Manual Mark (Hadir, Izin, Sakit, Reset)
    const handleQuickAction = async (officerName: string, status: "PRESENT" | "PERMISSION" | "SICK" | "ABSENT") => {
        try {
            const res = await fetch("/api/attendance/auto-piket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    officerName,
                    customStatus: status,
                    dutyType,
                    date: selectedDate,
                    notes: status === "PERMISSION" ? "Izin" : status === "SICK" ? "Sakit" : "Ditandai Pengurus",
                }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                showToast(json.message, "success");
                fetchAutoPiket();
            } else {
                showToast(json.error || "Gagal memperbarui status", "error");
            }
        } catch {
            showToast("Gagal memperbarui status kehadiran", "error");
        }
    };

    // Handle Create Schedule Swap
    const handleCreateSwap = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!swapSourceOfficer || !swapTargetOfficer) {
            return showToast("Pilih kedua nama pengurus yang bertukar jadwal", "warning");
        }
        setIsSubmittingSwap(true);
        try {
            const roster = dutyType === "SAPA_PAGI" ? SAPA_PAGI_ROSTER : DANUS_ROSTER;
            const srcList = roster[swapSourceWeek]?.[swapSourceDay] || [];
            const tgtList = roster[swapTargetWeek]?.[swapTargetDay] || [];

            const srcObj = srcList.find(o => o.name === swapSourceOfficer);
            const tgtObj = tgtList.find(o => o.name === swapTargetOfficer);

            const res = await fetch("/api/attendance/swap-schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: dutyType,
                    sourceWeek: swapSourceWeek,
                    sourceDay: swapSourceDay,
                    sourceOfficer: swapSourceOfficer,
                    sourceOrg: srcObj?.org || "OSIS",
                    targetWeek: swapTargetWeek,
                    targetDay: swapTargetDay,
                    targetOfficer: swapTargetOfficer,
                    targetOrg: tgtObj?.org || "OSIS",
                    specificDate: swapSpecificDate || undefined,
                    reason: swapReason,
                }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                showToast(json.message, "success");
                setIsSwapModalOpen(false);
                setSwapReason("");
                fetchAutoPiket();
                fetchSwaps();
            } else {
                showToast(json.error || "Gagal menukar jadwal", "error");
            }
        } catch {
            showToast("Gagal terhubung ke server", "error");
        } finally {
            setIsSubmittingSwap(false);
        }
    };

    // Handle Delete Swap
    const handleDeleteSwap = async (swapId: string) => {
        try {
            const res = await fetch(`/api/attendance/swap-schedule?id=${swapId}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (res.ok && json.success) {
                showToast(json.message, "success");
                fetchAutoPiket();
                fetchSwaps();
            } else {
                showToast(json.error || "Gagal membatalkan tukar jadwal", "error");
            }
        } catch {
            showToast("Gagal membatalkan tukar jadwal", "error");
        }
    };

    const currentCalendarWeek = getCalculatedPiketWeek();
    const currentCalendarDay = getIndonesianDayName();
    const isTodaySelected = selectedDate === new Date().toISOString().split("T")[0];

    // Roster for Swap Modal Dropdowns
    const roster = dutyType === "SAPA_PAGI" ? SAPA_PAGI_ROSTER : DANUS_ROSTER;
    const sourceCandidates = roster[swapSourceWeek]?.[swapSourceDay] || [];
    const targetCandidates = roster[swapTargetWeek]?.[swapTargetDay] || [];

    const isSekbid2 = userDivision === "SEKBID_2";
    const isSekbid6 = userDivision === "SEKBID_6";

    return (
        <div suppressHydrationWarning className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl border transition-all flex items-center gap-2 ${
                        toast.type === "success"
                            ? "bg-emerald-900/95 border-emerald-500/50 text-emerald-200"
                            : toast.type === "warning"
                            ? "bg-amber-900/95 border-amber-500/50 text-amber-200"
                            : "bg-red-900/95 border-red-500/50 text-red-200"
                    }`}
                >
                    <span>{toast.type === "success" ? "✅" : toast.type === "warning" ? "⏰" : "❌"}</span>
                    <span>{toast.msg}</span>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            ⚡ Otomatisasi Jadwal Aktif
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            ⏰ Batas Hadir: Maksimal 06:00 WIB
                        </span>
                        {dutyType === "SAPA_PAGI" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                🌟 Kelola Khusus: Sekbid 2 (Budi Pekerti)
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                🛒 Kelola Khusus: Sekbid 6 (Danus)
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                        <span>📋</span> Absensi Jadwal: Sapa Pagi & Danus
                    </h1>
                    <p className="text-slate-400 text-xs md:text-sm mt-1">
                        Sistem otomatis mendeteksi jadwal piket harian. Setiap tap kartu langsung menceklis kehadiran pengurus secara real-time.
                    </p>
                </div>

                {/* Actions & Duty Switcher */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Tombol Tukar Jadwal */}
                    <button
                        onClick={() => {
                            setIsSwapModalOpen(true);
                            setSwapSourceOfficer(sourceCandidates[0]?.name || "");
                            setSwapTargetOfficer(targetCandidates[0]?.name || "");
                        }}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2 border border-blue-400/40"
                    >
                        <span>🔄</span> Tukar Jadwal Piket
                        {swapsList.length > 0 && (
                            <span className="px-1.5 py-0.2 bg-blue-900 text-blue-200 text-[10px] rounded-full font-black">
                                {swapsList.length}
                            </span>
                        )}
                    </button>

                    {/* Tombol Export */}
                    <button
                        onClick={() => setIsExportOpen(true)}
                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2 border border-emerald-500/40"
                    >
                        <span>📥</span> Export Spreadsheet
                    </button>

                    {/* Duty Switcher (Sapa Pagi vs Danus) */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
                        {hasSapaPagiAccess && (
                            <button
                                onClick={() => setDutyType("SAPA_PAGI")}
                                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                                    dutyType === "SAPA_PAGI"
                                        ? "bg-amber-600 text-white shadow-lg shadow-amber-900/40"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                <span>🌟</span> Sapa Pagi (Sekbid 2)
                            </button>
                        )}
                        {hasDanusAccess && (
                            <button
                                onClick={() => setDutyType("DANUS")}
                                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                                    dutyType === "DANUS"
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                <span>🛒</span> Danus (Sekbid 6)
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Fast RFID & Barcode Scan Bar */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-3xl p-5 md:p-6 mb-8 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-base font-black text-white flex items-center gap-2">
                            <span>💳</span> Terminal Tap Kartu RFID / Scan Barcode Pengurus
                        </h2>
                        <p className="text-slate-400 text-xs mt-0.5">
                            Tempelkan kartu RFID fisik atau ketik nama pengurus untuk ceklis kehadiran instan pada tanggal ini.
                        </p>
                    </div>
                    <Link
                        href="/admin/attendance/kiosk"
                        target="_blank"
                        className="self-start md:self-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
                    >
                        <span>📺</span> Buka Layar Kiosk RFID Full-Screen
                    </Link>
                </div>

                <form onSubmit={handleScanSubmit} className="flex gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">⚡</span>
                        <input
                            ref={scanInputRef}
                            type="text"
                            value={scanInput}
                            onChange={(e) => setScanInput(e.target.value)}
                            placeholder="Tempelkan kartu RFID atau ketik nama pengurus..."
                            disabled={isScanning}
                            className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isScanning || !scanInput.trim()}
                        className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-emerald-900/30 whitespace-nowrap"
                    >
                        {isScanning ? "Memproses..." : "Ceklis Hadir"}
                    </button>
                </form>
            </div>

            {/* Date Picker & Navigation Control Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Specific Date Picker */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                📅 Tanggal Spesifik:
                            </span>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                            />
                        </div>

                        {!isTodaySelected && (
                            <button
                                onClick={handleResetToday}
                                className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                            >
                                <span>📌</span> Kembali ke Hari Ini
                            </button>
                        )}
                    </div>

                    {/* Week Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pekan:</span>
                        <button
                            onClick={() => setSelectedWeek(1)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                selectedWeek === 1
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                            }`}
                        >
                            <span>📅</span> Minggu Ke-1
                            {currentCalendarWeek === 1 && (
                                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse ml-1" />
                            )}
                        </button>
                        <button
                            onClick={() => setSelectedWeek(2)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                selectedWeek === 2
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                            }`}
                        >
                            <span>📅</span> Minggu Ke-2
                            {currentCalendarWeek === 2 && (
                                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse ml-1" />
                            )}
                        </button>
                    </div>

                    {/* Day Tabs */}
                    <div className="flex flex-wrap gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-2xl">
                        {DAYS.map((day) => {
                            const isToday = currentCalendarDay === day;
                            const isSelected = selectedDay === day;
                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        isSelected
                                            ? "bg-slate-800 text-white shadow border border-slate-700"
                                            : "text-slate-400 hover:text-slate-200"
                                    }`}
                                >
                                    {day}
                                    {isToday && (
                                        <span className="ml-1 text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                                            Hari ini
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Total Terjadwal</p>
                    <p className="text-2xl font-black text-white">🎯 {summary.totalScheduled}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-emerald-500/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Tepat Waktu (≤06:00)</p>
                    <p className="text-2xl font-black text-emerald-400">✅ {summary.onTime}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-amber-500/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Terlambat (&gt;06:00)</p>
                    <p className="text-2xl font-black text-amber-400">⏰ {summary.late}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                    <p className="text-blue-500/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Izin / Sakit</p>
                    <p className="text-2xl font-black text-blue-400">📋 {summary.permission}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
                    <p className="text-red-500/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Belum Absen</p>
                    <p className="text-2xl font-black text-red-400">⏳ {summary.absent}</p>
                </div>
            </div>

            {/* Checklist Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-white font-black text-base flex items-center gap-2">
                            <span>📋</span> Daftar Pengurus Bertugas ({dutyType === "SAPA_PAGI" ? "Sapa Pagi" : "Danus"} — Minggu {selectedWeek}, {selectedDay})
                        </h2>
                        <p className="text-slate-500 text-xs mt-0.5">
                            Tanggal: <strong className="text-slate-300">{new Date(selectedDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong> · Sinkronisasi real-time
                        </p>
                    </div>
                    <button
                        onClick={fetchAutoPiket}
                        className="self-start sm:self-auto px-3 py-1.5 border border-slate-700 rounded-xl text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1"
                    >
                        🔄 Segarkan
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">
                        <div className="w-8 h-8 border-2 border-slate-600 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
                        Menyinkronkan jadwal pengurus...
                    </div>
                ) : checklist.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 text-sm">
                        Tidak ada pengurus yang terjadwal untuk shift ini.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                    <th className="text-center px-4 py-3.5 w-12">No</th>
                                    <th className="text-left px-5 py-3.5">Pengurus</th>
                                    <th className="text-left px-4 py-3.5">Organisasi</th>
                                    <th className="text-left px-5 py-3.5">Status Kehadiran</th>
                                    <th className="text-left px-4 py-3.5">Waktu Tap</th>
                                    <th className="text-right px-5 py-3.5">Aksi Cepat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {checklist.map((item, idx) => {
                                    const isHadir = item.isChecked && (item.status === "PRESENT" || item.status === "LATE");
                                    const isLate = item.isChecked && (!item.isOnTime || item.status === "LATE");

                                    return (
                                        <tr
                                            key={item.name}
                                            className={`transition-colors ${
                                                isHadir
                                                    ? isLate
                                                        ? "bg-amber-950/20 hover:bg-amber-950/30"
                                                        : "bg-emerald-950/20 hover:bg-emerald-950/30"
                                                    : "hover:bg-slate-800/30"
                                            }`}
                                        >
                                            {/* Number */}
                                            <td className="px-4 py-4 text-center text-slate-500 font-mono text-xs">
                                                {idx + 1}
                                            </td>

                                            {/* Name & Avatar */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                                                            isHadir
                                                                ? isLate
                                                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                                                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                                                : "bg-slate-800 text-slate-400 border border-slate-700"
                                                        }`}
                                                    >
                                                        {item.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-white font-bold text-sm leading-tight">{item.name}</p>
                                                            {item.isSwapped && (
                                                                <span
                                                                    className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1"
                                                                    title={item.swapInfo}
                                                                >
                                                                    <span>🔄</span> Tukar Jadwal
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-500 text-[11px] mt-0.5">
                                                            {dutyType === "SAPA_PAGI" ? "Piket Gerbang Sapa Pagi" : "Piket Stand Danus"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Org Badge */}
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                                        item.org === "MPK"
                                                            ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                                                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                                    }`}
                                                >
                                                    {item.org === "MPK" ? "⚖️ MPK" : "⚡ OSIS"}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-5 py-4">
                                                {item.isChecked ? (
                                                    item.status === "PRESENT" && item.isOnTime ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                            <span>✅</span> Hadir Tepat Waktu
                                                        </span>
                                                    ) : item.status === "LATE" || !item.isOnTime ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                            <span>⏰</span> Terlambat (&gt; 06:00)
                                                        </span>
                                                    ) : item.status === "PERMISSION" ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                                            <span>📋</span> Izin
                                                        </span>
                                                    ) : item.status === "SICK" ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                                                            <span>🏥</span> Sakit
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                                                            <span>❌</span> Tidak Hadir
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                                        <span>⏳</span> Belum Absen
                                                    </span>
                                                )}
                                            </td>

                                            {/* Check-in Time */}
                                            <td className="px-4 py-4 font-mono text-xs text-slate-300">
                                                {item.checkInTime ? (
                                                    <div>
                                                        <span className="font-bold">
                                                            {new Date(item.checkInTime).toLocaleTimeString("id-ID", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit",
                                                            })}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 block">WIB</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-600">—</span>
                                                )}
                                            </td>

                                            {/* Quick Actions */}
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {!item.isChecked ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleQuickAction(item.name, "PRESENT")}
                                                                className="px-2.5 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all"
                                                                title="Tandai Hadir"
                                                            >
                                                                ✓ Hadir
                                                            </button>
                                                            <button
                                                                onClick={() => handleQuickAction(item.name, "PERMISSION")}
                                                                className="px-2.5 py-1 bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-all"
                                                                title="Tandai Izin"
                                                            >
                                                                Izin
                                                            </button>
                                                            <button
                                                                onClick={() => handleQuickAction(item.name, "SICK")}
                                                                className="px-2.5 py-1 bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold rounded-lg transition-all"
                                                                title="Tandai Sakit"
                                                            >
                                                                Sakit
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleQuickAction(item.name, "ABSENT")}
                                                            className="px-2.5 py-1 bg-slate-800 hover:bg-red-900/50 border border-slate-700 hover:border-red-700 text-slate-400 hover:text-red-300 text-xs font-bold rounded-lg transition-all"
                                                            title="Reset Status"
                                                        >
                                                            🔄 Reset
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Modal: Tukar Jadwal Piket (Malam Sebelumnya) ──────────── */}
            {isSwapModalOpen && (
                <div
                    className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !isSubmittingSwap) setIsSwapModalOpen(false);
                    }}
                >
                    <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                            <div>
                                <h2 className="text-white font-black text-lg flex items-center gap-2">
                                    <span>🔄</span> Tukar Jadwal Piket ({dutyType === "SAPA_PAGI" ? "Sapa Pagi" : "Danus"})
                                </h2>
                                <p className="text-slate-400 text-xs mt-0.5">
                                    Tukar jadwal pada malam sebelumnya agar esok hari otomatis tercatat atas nama pengurus baru.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsSwapModalOpen(false)}
                                className="text-slate-400 hover:text-white text-xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateSwap} className="p-6 space-y-5">
                            {/* Kotak Pengurus 1 (Asal) */}
                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                    <span>👤</span> 1. Pengurus Yang Berhalangan (Asal)
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Pekan:</label>
                                        <select
                                            value={swapSourceWeek}
                                            onChange={(e) => setSwapSourceWeek(parseInt(e.target.value) as 1 | 2)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value={1}>Minggu Ke-1</option>
                                            <option value={2}>Minggu Ke-2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Hari:</label>
                                        <select
                                            value={swapSourceDay}
                                            onChange={(e) => setSwapSourceDay(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                        >
                                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Nama Pengurus:</label>
                                    <select
                                        value={swapSourceOfficer}
                                        onChange={(e) => setSwapSourceOfficer(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                                        required
                                    >
                                        <option value="">-- Pilih Pengurus --</option>
                                        {sourceCandidates.map((o) => (
                                            <option key={o.name} value={o.name}>
                                                {o.name} ({o.org})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Kotak Pengurus 2 (Pengganti) */}
                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                <div className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                                    <span>🔄</span> 2. Pengurus Pengganti (Tujuan Pertukaran)
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Pekan:</label>
                                        <select
                                            value={swapTargetWeek}
                                            onChange={(e) => setSwapTargetWeek(parseInt(e.target.value) as 1 | 2)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value={1}>Minggu Ke-1</option>
                                            <option value={2}>Minggu Ke-2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Hari:</label>
                                        <select
                                            value={swapTargetDay}
                                            onChange={(e) => setSwapTargetDay(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                        >
                                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Nama Pengurus Pengganti:</label>
                                    <select
                                        value={swapTargetOfficer}
                                        onChange={(e) => setSwapTargetOfficer(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                                        required
                                    >
                                        <option value="">-- Pilih Pengurus Pengganti --</option>
                                        {targetCandidates.map((o) => (
                                            <option key={o.name} value={o.name}>
                                                {o.name} ({o.org})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Alasan & Tanggal Spesifik */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Hanya Tanggal Ini (Opsional):</label>
                                    <input
                                        type="date"
                                        value={swapSpecificDate}
                                        onChange={(e) => setSwapSpecificDate(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    />
                                    <span className="text-[10px] text-slate-500">Kosongkan jika tukar permanen</span>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Alasan / Catatan:</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Ada ulangan harian"
                                        value={swapReason}
                                        onChange={(e) => setSwapReason(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Tombol Simpan Tukar Jadwal */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsSwapModalOpen(false)}
                                    className="flex-1 py-3 border border-slate-700 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingSwap}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
                                >
                                    <span>🔄</span> {isSubmittingSwap ? "Menyimpan..." : "Konfirmasi Tukar Jadwal"}
                                </button>
                            </div>

                            {/* Daftar Pertukaran Jadwal Aktif */}
                            {swapsList.length > 0 && (
                                <div className="pt-4 border-t border-slate-800 space-y-2">
                                    <p className="text-xs font-bold text-slate-300">Daftar Pertukaran Jadwal Aktif ({swapsList.length})</p>
                                    <div className="max-h-40 overflow-y-auto space-y-2">
                                        {swapsList.map((sw) => (
                                            <div
                                                key={sw.id}
                                                className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                                            >
                                                <div>
                                                    <p className="text-white font-bold">
                                                        {sw.sourceOfficer} ({sw.sourceDay}) ⇄ {sw.targetOfficer} ({sw.targetDay})
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        {sw.specificDate ? `Tanggal: ${sw.specificDate} · ` : "Permanen · "}
                                                        {sw.reason || "Tukar jadwal"}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteSwap(sw.id)}
                                                    className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg text-[10px] font-bold"
                                                >
                                                    Batal
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* ── Modal: Export ke Spreadsheet (Excel / CSV) ─────────────── */}
            {isExportOpen && (
                <div
                    className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsExportOpen(false);
                    }}
                >
                    <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                            <div>
                                <h2 className="text-white font-black text-lg flex items-center gap-2">
                                    <span>📥</span> Export Rekapitulasi Absensi
                                </h2>
                                <p className="text-slate-400 text-xs mt-0.5">
                                    Pilih Kategori Tanggal Spesifik (Format Excel / CSV)
                                </p>
                            </div>
                            <button
                                onClick={() => setIsExportOpen(false)}
                                className="text-slate-400 hover:text-white text-xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Jenis Piket Sesuai Wewenang */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                    1. Pilih Jenis Piket (Sesuai Jobdesk Wewenang)
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[
                                        ...(isSuperOrBPH ? [{ id: "ALL", label: "Semua Piket" }] : []),
                                        ...(hasSapaPagiAccess ? [{ id: "SAPA_PAGI", label: "🌟 Sapa Pagi (Sekbid 2)" }] : []),
                                        ...(hasDanusAccess ? [{ id: "DANUS", label: "🛒 Danus (Sekbid 6)" }] : []),
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setExportType(opt.id as any)}
                                            className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                                                exportType === opt.id
                                                    ? "bg-emerald-600 border-emerald-500 text-white shadow"
                                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Kategori Tanggal Spesifik */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                    2. Kategori Tanggal Rekapitulasi
                                </label>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {[
                                        { id: "TODAY", label: "🟢 Hari Ini" },
                                        { id: "THIS_WEEK", label: "📅 Minggu Ini (Sen-Jum)" },
                                        { id: "THIS_MONTH", label: "📆 Bulan Berjalan" },
                                        { id: "FULL_PERIOD", label: "🏛️ 1 Periode Penuh" },
                                        { id: "SPECIFIC_DATE", label: "🎯 Tanggal Tertentu" },
                                        { id: "SPECIFIC_MONTH", label: "🗓️ Bulan Tertentu" },
                                        { id: "CUSTOM_RANGE", label: "↔️ Rentang Kustom", colSpan: "col-span-2" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setExportCategory(opt.id as any)}
                                            className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${opt.colSpan || ""} ${
                                                exportCategory === opt.id
                                                    ? "bg-emerald-600 border-emerald-500 text-white shadow"
                                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Dynamic Input based on Selected Category */}
                                {exportCategory === "SPECIFIC_DATE" && (
                                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                                        <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Pilih Tanggal Spesifik:</label>
                                        <input
                                            type="date"
                                            value={exportSpecificDate}
                                            onChange={(e) => setExportSpecificDate(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                                        />
                                    </div>
                                )}

                                {exportCategory === "SPECIFIC_MONTH" && (
                                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                                        <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Pilih Bulan & Tahun:</label>
                                        <input
                                            type="month"
                                            value={exportMonth}
                                            onChange={(e) => setExportMonth(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                                        />
                                    </div>
                                )}

                                {exportCategory === "CUSTOM_RANGE" && (
                                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Dari Tanggal:</label>
                                                <input
                                                    type="date"
                                                    value={exportStartDate}
                                                    onChange={(e) => setExportStartDate(e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Sampai Tanggal:</label>
                                                <input
                                                    type="date"
                                                    value={exportEndDate}
                                                    onChange={(e) => setExportEndDate(e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Box */}
                            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
                                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                                    <span>🛡️</span> Siap Buka di Excel & Google Sheets
                                </p>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    Data dilengkapi ringkasan KPI, evaluasi batas jam 06:00 WIB, identitas organisasi OSIS/MPK, dan encoding UTF-8 BOM anti-korup.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsExportOpen(false)}
                                    className="flex-1 py-3 border border-slate-700 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDownloadExport}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
                                >
                                    <span>📥</span> Unduh Spreadsheet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
