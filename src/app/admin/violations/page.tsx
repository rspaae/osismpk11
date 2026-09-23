"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Violation {
    id: string;
    studentName: string;
    studentClass: string;
    violationType: string;
    context: string | null;
    notes: string | null;
    severity: "RINGAN" | "SEDANG" | "BERAT";
    date: string;
    pointDeduction: number;
    recordedBy: { name: string; position?: string | null } | null;
    createdAt: string;
}

interface RecapItem {
    studentClass: string;
    _count: { id: number };
}

// ─── Constants ───────────────────────────────────────────────────────────────
const KELAS_LIST = [
    "X RPL 1", "X RPL 2", "X TKJ 1", "X TKJ 2", "X AKL 1", "X AKL 2",
    "X DKV 1", "X DKV 2", "X MPLB 1", "X MPLB 2",
    "XI RPL 1", "XI RPL 2", "XI TKJ 1", "XI TKJ 2", "XI AKL 1", "XI AKL 2",
    "XI DKV 1", "XI DKV 2", "XI MPLB 1", "XI MPLB 2",
    "XII RPL 1", "XII RPL 2", "XII TKJ 1", "XII TKJ 2", "XII AKL 1", "XII AKL 2",
    "XII DKV 1", "XII DKV 2", "XII MPLB 1", "XII MPLB 2",
];

const VIOLATION_PRESETS = [
    "Tidak hadir Sapa Pagi",
    "Terlambat Sapa Pagi",
    "Seragam tidak lengkap",
    "Tidak memakai atribut sekolah",
    "Tidak membawa kartu pelajar",
    "Membuang sampah sembarangan",
    "Tidak mengucapkan salam",
    "Bolos / tidak masuk tanpa keterangan",
    "Membuat keributan",
    "Menggunakan HP saat pelajaran",
    "Tidak piket Danus",
    "Lainnya",
];

const CONTEXT_PRESETS = [
    "Sapa Pagi", "Danus", "Upacara", "Rapat", "Kegiatan Sekolah", "Piket Umum",
];

const SEVERITY_CONFIG = {
    RINGAN: { label: "Ringan", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    SEDANG: { label: "Sedang", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
    BERAT:  { label: "Berat",  color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ViolationsPage() {
    const { data: session } = useSession();
    const [violations, setViolations] = useState<Violation[]>([]);
    const [recap, setRecap] = useState<RecapItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterClass, setFilterClass] = useState("");
    const [filterSeverity, setFilterSeverity] = useState("");
    const [filterSearch, setFilterSearch] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");
    const [activeTab, setActiveTab] = useState<"list" | "recap">("list");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [studentName, setStudentName] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [violationType, setViolationType] = useState("");
    const [violationCustom, setViolationCustom] = useState("");
    const [context, setContext] = useState("");
    const [notes, setNotes] = useState("");
    const [severity, setSeverity] = useState("RINGAN");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [pointDeduction, setPointDeduction] = useState(0);

    const fetchViolations = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filterClass) params.set("class", filterClass);
            if (filterSeverity) params.set("severity", filterSeverity);
            if (filterSearch) params.set("search", filterSearch);
            if (filterDateFrom) params.set("dateFrom", filterDateFrom);
            if (filterDateTo) params.set("dateTo", filterDateTo);

            const res = await fetch(`/api/violations?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setViolations(data.data || []);
                setRecap(data.recap || []);
            }
        } catch (err) {
            console.error("Gagal memuat pelanggaran:", err);
        } finally {
            setLoading(false);
        }
    }, [filterClass, filterSeverity, filterSearch, filterDateFrom, filterDateTo]);

    useEffect(() => {
        fetchViolations();
    }, [fetchViolations]);

    const resetForm = () => {
        setStudentName("");
        setStudentClass("");
        setViolationType("");
        setViolationCustom("");
        setContext("");
        setNotes("");
        setSeverity("RINGAN");
        setDate(new Date().toISOString().split("T")[0]);
        setPointDeduction(0);
    };

    const handleSubmit = async () => {
        const finalViolationType = violationType === "Lainnya" ? violationCustom : violationType;
        if (!studentName.trim() || !studentClass || !finalViolationType.trim()) {
            alert("Nama siswa, kelas, dan jenis pelanggaran wajib diisi.");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/violations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentName,
                    studentClass,
                    violationType: finalViolationType,
                    context: context || null,
                    notes: notes || null,
                    severity,
                    date,
                    pointDeduction,
                }),
            });
            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                fetchViolations();
            } else {
                const err = await res.json();
                alert(err.error || "Gagal mencatat pelanggaran");
            }
        } catch {
            alert("Terjadi kesalahan. Coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus catatan pelanggaran ini?")) return;
        try {
            const res = await fetch(`/api/violations/${id}`, { method: "DELETE" });
            if (!res.ok) alert("Gagal menghapus data.");
            else fetchViolations();
        } catch {
            alert("Terjadi kesalahan.");
        }
    };

    const totalToday = violations.filter((v) => {
        const d = new Date(v.date);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    }).length;

    const totalBerat = violations.filter((v) => v.severity === "BERAT").length;
    const sortedRecap = [...recap].sort((a, b) => b._count.id - a._count.id);

    return (
        <div className="min-h-screen bg-[#f5f8f6] font-sans">
            {/* ── Header ── */}
            <div className="bg-white border-b border-[#e3ece6] px-6 py-5 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-[#1a2620]">Pencatat Pelanggaran Siswa</h1>
                        <p className="text-sm text-[#5f7167] mt-0.5">Rekam & rekap data pelanggaran tata tertib sekolah</p>
                    </div>
                    <button
                        id="btn-tambah-pelanggaran"
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#468366] hover:bg-[#3a7057] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Catat Pelanggaran
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "Total Tercatat", value: violations.length, icon: "📋", color: "#468366" },
                        { label: "Hari Ini", value: totalToday, icon: "📅", color: "#2563eb" },
                        { label: "Kategori Berat", value: totalBerat, icon: "🔴", color: "#dc2626" },
                        { label: "Kelas Terlibat", value: new Set(violations.map(v => v.studentClass)).size, icon: "🏫", color: "#7c3aed" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl border border-[#e3ece6] p-4">
                            <div className="text-2xl mb-1">{stat.icon}</div>
                            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                            <div className="text-xs text-[#5f7167] mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-1 bg-[#e8f2ec] rounded-xl p-1 w-fit">
                    {(["list", "recap"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === tab
                                    ? "bg-white text-[#468366] shadow-sm"
                                    : "text-[#5f7167] hover:text-[#2c3831]"
                            }`}
                        >
                            {tab === "list" ? "Daftar Pelanggaran" : "Rekap per Kelas"}
                        </button>
                    ))}
                </div>

                {activeTab === "list" && (
                    <>
                        {/* ── Filters ── */}
                        <div className="bg-white rounded-2xl border border-[#e3ece6] p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                <input
                                    id="filter-search"
                                    type="text"
                                    placeholder="Cari nama / pelanggaran..."
                                    value={filterSearch}
                                    onChange={(e) => setFilterSearch(e.target.value)}
                                    className="col-span-2 sm:col-span-1 px-3 py-2 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa]"
                                />
                                <select
                                    id="filter-kelas"
                                    value={filterClass}
                                    onChange={(e) => setFilterClass(e.target.value)}
                                    className="px-3 py-2 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] text-[#2c3831]"
                                >
                                    <option value="">Semua Kelas</option>
                                    {KELAS_LIST.map((k) => <option key={k}>{k}</option>)}
                                </select>
                                <select
                                    id="filter-severity"
                                    value={filterSeverity}
                                    onChange={(e) => setFilterSeverity(e.target.value)}
                                    className="px-3 py-2 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] text-[#2c3831]"
                                >
                                    <option value="">Semua Tingkat</option>
                                    <option value="RINGAN">Ringan</option>
                                    <option value="SEDANG">Sedang</option>
                                    <option value="BERAT">Berat</option>
                                </select>
                                <input
                                    type="date" value={filterDateFrom}
                                    onChange={(e) => setFilterDateFrom(e.target.value)}
                                    title="Dari tanggal"
                                    className="px-3 py-2 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] text-[#2c3831]"
                                />
                                <input
                                    type="date" value={filterDateTo}
                                    onChange={(e) => setFilterDateTo(e.target.value)}
                                    title="Sampai tanggal"
                                    className="px-3 py-2 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] text-[#2c3831]"
                                />
                            </div>
                        </div>

                        {/* ── Violations List ── */}
                        {loading ? (
                            <div className="text-center py-16 text-[#5f7167]">
                                <div className="text-4xl mb-3">⏳</div>
                                <p className="text-sm">Memuat data pelanggaran...</p>
                            </div>
                        ) : violations.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-[#e3ece6] py-16 text-center">
                                <div className="text-5xl mb-3">✅</div>
                                <p className="text-[#2c3831] font-semibold">Tidak ada pelanggaran ditemukan</p>
                                <p className="text-sm text-[#5f7167] mt-1">Semua siswa taat tata tertib, atau belum ada catatan.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {violations.map((v) => {
                                    const sev = SEVERITY_CONFIG[v.severity];
                                    const dateObj = new Date(v.date);
                                    return (
                                        <div key={v.id} className="bg-white rounded-2xl border border-[#e3ece6] p-4 hover:border-[#b6d5c4] transition-colors">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                        <span className="font-bold text-[#1a2620] text-sm">{v.studentName}</span>
                                                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#e8f2ec] text-[#468366]">{v.studentClass}</span>
                                                        <span
                                                            className="text-xs px-2 py-0.5 rounded-full font-semibold border"
                                                            style={{ color: sev.color, backgroundColor: sev.bg, borderColor: sev.border }}
                                                        >
                                                            {sev.label}
                                                        </span>
                                                        {v.context && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#f0f5ff] text-[#4f6daf] border border-[#dde5ff]">{v.context}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-[#2c3831] font-medium">{v.violationType}</p>
                                                    {v.notes && <p className="text-xs text-[#5f7167] mt-1">{v.notes}</p>}
                                                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#7a9486]">
                                                        <span>📅 {dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                                                        {v.recordedBy && <span>👤 Dicatat oleh {v.recordedBy.name}</span>}
                                                        {v.pointDeduction > 0 && <span className="text-red-500">−{v.pointDeduction} poin</span>}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(v.id)}
                                                    className="shrink-0 p-2 rounded-xl text-[#9fb8ab] hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Hapus catatan"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {activeTab === "recap" && (
                    <div className="bg-white rounded-2xl border border-[#e3ece6] overflow-hidden">
                        <div className="px-5 py-4 border-b border-[#e3ece6]">
                            <h2 className="font-semibold text-[#1a2620]">Rekap Pelanggaran per Kelas</h2>
                            <p className="text-xs text-[#5f7167] mt-0.5">Urut berdasarkan jumlah pelanggaran terbanyak</p>
                        </div>
                        {sortedRecap.length === 0 ? (
                            <div className="py-12 text-center text-[#5f7167] text-sm">Belum ada data rekap.</div>
                        ) : (
                            <div className="divide-y divide-[#f0f5f2]">
                                {sortedRecap.map((item, i) => {
                                    const max = sortedRecap[0]._count.id;
                                    const pct = Math.round((item._count.id / max) * 100);
                                    return (
                                        <div key={item.studentClass} className="px-5 py-3.5 flex items-center gap-4">
                                            <span className="w-6 text-center text-xs font-bold text-[#9fb8ab]">{i + 1}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-semibold text-[#2c3831]">{item.studentClass}</span>
                                                    <span className="text-sm font-bold text-[#468366]">{item._count.id} pelanggaran</span>
                                                </div>
                                                <div className="h-2 bg-[#e8f2ec] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${pct}%`,
                                                            background: pct > 66 ? "#dc2626" : pct > 33 ? "#d97706" : "#468366",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════════════════════════════════════
                Modal — Catat Pelanggaran
            ══════════════════════════════════════════════════════════════════════ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-[#e3ece6] px-6 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl">
                            <div>
                                <h2 className="font-bold text-[#1a2620]">Catat Pelanggaran Siswa</h2>
                                <p className="text-xs text-[#5f7167] mt-0.5">Isi data pelanggaran tata tertib</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-[#f0f5f2] text-[#5f7167] transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Kelas */}
                            <div>
                                <label className="text-xs font-semibold text-[#2c3831] uppercase tracking-wide mb-1.5 block">Kelas *</label>
                                <select
                                    id="form-kelas"
                                    value={studentClass}
                                    onChange={(e) => setStudentClass(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] text-[#2c3831]"
                                >
                                    <option value="">— Pilih Kelas —</option>
                                    {KELAS_LIST.map((k) => <option key={k}>{k}</option>)}
                                </select>
                            </div>

                            {/* Nama Siswa */}
                            <div>
                                <label className="text-xs font-semibold text-[#2c3831] uppercase tracking-wide mb-1.5 block">Nama Siswa *</label>
                                <input
                                    id="form-nama-siswa"
                                    type="text"
                                    placeholder="Nama lengkap siswa..."
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] placeholder-[#b0c4ba]"
                                />
                            </div>

                            {/* Jenis Pelanggaran */}
                            <div>
                                <label className="text-xs font-semibold text-[#2c3831] uppercase tracking-wide mb-1.5 block">Jenis Pelanggaran *</label>
                                <select
                                    id="form-jenis-pelanggaran"
                                    value={violationType}
                                    onChange={(e) => setViolationType(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] text-[#2c3831]"
                                >
                                    <option value="">— Pilih Jenis —</option>
                                    {VIOLATION_PRESETS.map((v) => <option key={v}>{v}</option>)}
                                </select>
                                {violationType === "Lainnya" && (
                                    <input
                                        type="text"
                                        placeholder="Tuliskan pelanggaran..."
                                        value={violationCustom}
                                        onChange={(e) => setViolationCustom(e.target.value)}
                                        className="mt-2 w-full px-3 py-2.5 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] placeholder-[#b0c4ba]"
                                    />
                                )}
                            </div>

                            {/* Konteks Kegiatan */}
                            <div>
                                <label className="text-xs font-semibold text-[#2c3831] uppercase tracking-wide mb-1.5 block">Konteks Kegiatan</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {CONTEXT_PRESETS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setContext(context === c ? "" : c)}
                                            className={`px-3 py-1 text-xs rounded-full border font-medium transition-all ${
                                                context === c
                                                    ? "bg-[#468366] text-white border-[#468366]"
                                                    : "bg-white text-[#5f7167] border-[#d1ddd6] hover:border-[#468366]"
                                            }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="atau ketik konteks lain..."
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] placeholder-[#b0c4ba]"
                                />
                            </div>

                            {/* Tingkat Keparahan */}
                            <div>
                                <label className="text-xs font-semibold text-[#2c3831] uppercase tracking-wide mb-1.5 block">Tingkat Keparahan</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["RINGAN", "SEDANG", "BERAT"] as const).map((s) => {
                                        const cfg = SEVERITY_CONFIG[s];
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setSeverity(s)}
                                                className="py-2.5 rounded-xl border text-xs font-semibold transition-all"
                                                style={
                                                    severity === s
                                                        ? { backgroundColor: cfg.color, borderColor: cfg.color, color: "white" }
                                                        : { backgroundColor: cfg.bg, borderColor: cfg.border, color: cfg.color }
                                                }
                                            >
                                                {cfg.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tanggal & Poin */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-[#2c3831] uppercase tracking-wide mb-1.5 block">Tanggal</label>
                                    <input
                                        id="form-tanggal"
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-3 py-2.5 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] text-[#2c3831]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#2c3831] uppercase tracking-wide mb-1.5 block">Pengurangan Poin</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={pointDeduction}
                                        onChange={(e) => setPointDeduction(Number(e.target.value))}
                                        className="w-full px-3 py-2.5 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] text-[#2c3831]"
                                    />
                                </div>
                            </div>

                            {/* Catatan */}
                            <div>
                                <label className="text-xs font-semibold text-[#2c3831] uppercase tracking-wide mb-1.5 block">Catatan Tambahan</label>
                                <textarea
                                    id="form-catatan"
                                    rows={3}
                                    placeholder="Keterangan situasi, saksi, tindakan, dll..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-[#d1ddd6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#468366]/30 focus:border-[#468366] bg-[#f9fbfa] placeholder-[#b0c4ba] resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-[#e3ece6] px-6 py-4 flex gap-3 rounded-b-2xl sm:rounded-b-3xl">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-2.5 rounded-xl border border-[#d1ddd6] text-sm font-semibold text-[#5f7167] hover:bg-[#f0f5f2] transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                id="btn-simpan-pelanggaran"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 rounded-xl bg-[#468366] hover:bg-[#3a7057] text-white text-sm font-semibold transition-colors disabled:opacity-60"
                            >
                                {isSubmitting ? "Menyimpan..." : "Simpan Catatan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
