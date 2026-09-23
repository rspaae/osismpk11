"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { DIVISIONS_METADATA } from "@/lib/permissions";

// ─── Types ──────────────────────────────────────────────────────────────────
interface AttendanceRecord {
    id: string;
    status: "PRESENT" | "LATE" | "PERMISSION" | "SICK" | "ABSENT";
    checkInTime: string;
    notes: string | null;
    isVerified: boolean;
    user: {
        id: string;
        name: string | null;
        nis: string | null;
        kelas: string | null;
        role: string;
        division: string | null;
        position: string | null;
        image: string | null;
    };
    verifiedBy: { id: string; name: string | null } | null;
}

interface SessionDetail {
    id: string;
    title: string;
    type: string;
    targetDivision: string;
    location: string | null;
    date: string;
    startTime: string | null;
    endTime: string | null;
    isOpen: boolean;
    passcode: string | null;
    description: string | null;
    creator: { name: string | null; role: string; position: string | null } | null;
    records: AttendanceRecord[];
}

interface Summary {
    total: number;
    present: number;
    late: number;
    permission: number;
    sick: number;
    absent: number;
    attendanceRate: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    PRESENT:    { label: "Hadir",       color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30" },
    LATE:       { label: "Terlambat",   color: "text-yellow-400",  bg: "bg-yellow-500/15 border-yellow-500/30" },
    PERMISSION: { label: "Izin",        color: "text-blue-400",    bg: "bg-blue-500/15 border-blue-500/30" },
    SICK:       { label: "Sakit",       color: "text-purple-400",  bg: "bg-purple-500/15 border-purple-500/30" },
    ABSENT:     { label: "Tidak Hadir", color: "text-red-400",     bg: "bg-red-500/15 border-red-500/30" },
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function AdminSekbidDetailPage() {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    const [detail, setDetail] = useState<SessionDetail | null>(null);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
    const [editStatus, setEditStatus] = useState<string>("");
    const [editNotes, setEditNotes] = useState<string>("");
    const [saving, setSaving] = useState(false);

    // Manual add attendance
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addUserId, setAddUserId] = useState("");
    const [addStatus, setAddStatus] = useState<string>("ABSENT");
    const [addNotes, setAddNotes] = useState("");
    const [addingManual, setAddingManual] = useState(false);

    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/attendance/sessions/${sessionId}`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            setDetail(json.data);
            setSummary(json.summary);
        } catch {
            showToast("Gagal memuat detail kegiatan", "error");
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => { fetchDetail(); }, [fetchDetail]);

    // ── Toggle Open/Close ─────────────────────────────────────────────────
    const handleToggle = async () => {
        if (!detail) return;
        setToggling(true);
        try {
            const res = await fetch(`/api/attendance/sessions/${sessionId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isOpen: !detail.isOpen }),
            });
            const json = await res.json();
            if (!res.ok) return showToast(json.error || "Gagal", "error");
            showToast(json.message);
            setDetail(d => d ? { ...d, isOpen: !d.isOpen } : d);
        } catch {
            showToast("Gagal mengubah status", "error");
        } finally {
            setToggling(false);
        }
    };

    // ── Edit Record Status ─────────────────────────────────────────────────
    const openEdit = (rec: AttendanceRecord) => {
        setEditingRecord(rec);
        setEditStatus(rec.status);
        setEditNotes(rec.notes || "");
    };

    const handleSaveEdit = async () => {
        if (!editingRecord) return;
        setSaving(true);
        try {
            const res = await fetch("/api/attendance/records", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recordId: editingRecord.id, status: editStatus, notes: editNotes }),
            });
            const json = await res.json();
            if (!res.ok) return showToast(json.error || "Gagal", "error");
            showToast("Status kehadiran diperbarui");
            setEditingRecord(null);
            // Update local state
            setDetail(d => {
                if (!d) return d;
                return {
                    ...d,
                    records: d.records.map(r =>
                        r.id === editingRecord.id
                            ? { ...r, status: editStatus as AttendanceRecord["status"], notes: editNotes }
                            : r
                    )
                };
            });
            // Recalculate summary
            fetchDetail();
        } catch {
            showToast("Gagal menyimpan perubahan", "error");
        } finally {
            setSaving(false);
        }
    };

    // ── Manual Add ─────────────────────────────────────────────────────────
    const handleManualAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addUserId.trim()) return showToast("User ID atau NIS diperlukan", "error");
        setAddingManual(true);
        try {
            // Use check-in endpoint with status override — officer can set any status
            const res = await fetch("/api/attendance/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, notes: addNotes }),
            });
            // Actually for manual add by officer, we need a different approach
            // Use the records PATCH to add a new record manually
            // Since check-in uses session.user.id, we need a workaround
            // Instead: POST directly to create a record — let's use a custom flow
            const res2 = await fetch("/api/attendance/records", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, userId: addUserId.trim(), status: addStatus, notes: addNotes }),
            });
            const json2 = await res2.json();
            if (!res2.ok) return showToast(json2.error || "Gagal menambah absensi", "error");
            showToast("Absensi manual berhasil ditambahkan");
            setIsAddOpen(false);
            setAddUserId("");
            setAddNotes("");
            fetchDetail();
        } catch {
            showToast("Gagal menambah absensi", "error");
        } finally {
            setAddingManual(false);
        }
    };

    // ── Filter records ────────────────────────────────────────────────────
    const filteredRecords = detail?.records.filter(r => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            r.user.name?.toLowerCase().includes(q) ||
            r.user.nis?.toLowerCase().includes(q) ||
            r.user.kelas?.toLowerCase().includes(q)
        );
    }) || [];

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 mb-4">Kegiatan tidak ditemukan</p>
                    <button onClick={() => router.push("/admin/attendance/sekbid")} className="text-emerald-400 font-bold hover:text-emerald-300">
                        ← Kembali
                    </button>
                </div>
            </div>
        );
    }

    const divMeta = DIVISIONS_METADATA[detail.targetDivision as keyof typeof DIVISIONS_METADATA];

    return (
        <div suppressHydrationWarning className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-bold shadow-2xl border ${
                    toast.type === "success"
                        ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-300"
                        : "bg-red-900/90 border-red-500/40 text-red-300"
                }`}>
                    {toast.type === "success" ? "✅" : "❌"} {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => router.push("/admin/attendance/sekbid")}
                    className="text-slate-400 hover:text-white text-sm font-semibold mb-4 flex items-center gap-1.5 transition-colors"
                >
                    ← Kembali ke Daftar Kegiatan
                </button>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                detail.isOpen
                                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                    : "bg-slate-700/50 text-slate-400 border-slate-600/30"
                            }`}>
                                {detail.isOpen ? "🟢 Absensi Dibuka" : "🔒 Absensi Ditutup"}
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                {divMeta?.icon} {divMeta?.label} — {divMeta?.name}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white">{detail.title}</h1>
                        <div className="flex flex-wrap gap-4 mt-2 text-slate-400 text-sm">
                            <span>📅 {new Date(detail.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                            {detail.startTime && <span>🕒 {detail.startTime}{detail.endTime ? ` — ${detail.endTime}` : ""}</span>}
                            {detail.location && <span>📍 {detail.location}</span>}
                        </div>
                        {detail.description && (
                            <p className="text-slate-500 text-sm mt-2">{detail.description}</p>
                        )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <button
                            onClick={handleToggle}
                            disabled={toggling}
                            className={`px-5 py-2.5 text-sm font-bold rounded-xl border transition-all disabled:opacity-50 ${
                                detail.isOpen
                                    ? "bg-red-900/40 hover:bg-red-900/70 text-red-400 border-red-800/50"
                                    : "bg-emerald-900/40 hover:bg-emerald-900/70 text-emerald-400 border-emerald-800/50"
                            }`}
                        >
                            {toggling ? "..." : detail.isOpen ? "🔒 Tutup Absensi" : "🔓 Buka Absensi"}
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            {summary && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                    {[
                        { label: "Total",       val: summary.total,      color: "text-white",          icon: "👥" },
                        { label: "Hadir",       val: summary.present,    color: "text-emerald-400",    icon: "✅" },
                        { label: "Terlambat",   val: summary.late,       color: "text-yellow-400",     icon: "⏰" },
                        { label: "Izin",        val: summary.permission,  color: "text-blue-400",       icon: "📋" },
                        { label: "Sakit",       val: summary.sick,       color: "text-purple-400",     icon: "🏥" },
                        { label: "Tidak Hadir", val: summary.absent,     color: "text-red-400",        icon: "❌" },
                    ].map(({ label, val, color, icon }) => (
                        <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                            <p className={`text-2xl font-black ${color}`}>{icon} {val}</p>
                            <p className="text-slate-500 text-[10px] font-semibold mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            )}

            {summary && summary.total > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-xs font-semibold">Tingkat Kehadiran</span>
                        <span className="text-white font-black">{summary.attendanceRate}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${summary.attendanceRate}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Tabel Peserta */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <h2 className="text-white font-black text-base">Daftar Absensi Peserta</h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Cari nama / NIS / kelas..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 w-48"
                        />
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                        >
                            + Tambah Manual
                        </button>
                        <button
                            onClick={fetchDetail}
                            className="px-3 py-2 border border-slate-700 rounded-xl text-slate-400 hover:text-white text-xs transition-all"
                        >
                            🔄
                        </button>
                    </div>
                </div>

                {filteredRecords.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 text-sm">
                        {detail.records.length === 0
                            ? "Belum ada peserta yang melakukan absensi."
                            : "Tidak ada peserta yang cocok dengan pencarian."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                    <th className="text-left px-5 py-3">Peserta</th>
                                    <th className="text-left px-5 py-3">NIS</th>
                                    <th className="text-left px-5 py-3">Kelas</th>
                                    <th className="text-left px-5 py-3">Status</th>
                                    <th className="text-left px-5 py-3">Waktu Check-in</th>
                                    <th className="text-left px-5 py-3">Catatan</th>
                                    <th className="text-left px-5 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredRecords.map((rec, idx) => {
                                    const st = STATUS_LABELS[rec.status];
                                    return (
                                        <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                                                        {rec.user.name?.charAt(0) || "?"}
                                                    </div>
                                                    <span className="text-white font-semibold">{rec.user.name || "—"}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{rec.user.nis || "—"}</td>
                                            <td className="px-5 py-3.5 text-slate-400">{rec.user.kelas || "—"}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.color}`}>
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                                                {rec.status === "PRESENT" || rec.status === "LATE"
                                                    ? new Date(rec.checkInTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                                                    : "—"}
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-500 text-xs max-w-[150px] truncate">
                                                {rec.notes || "—"}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button
                                                    onClick={() => openEdit(rec)}
                                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all"
                                                >
                                                    ✏️ Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Modal: Edit Status ─────────────────────────────────── */}
            {editingRecord && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget) setEditingRecord(null); }}
                >
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm">
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-white font-black text-base">✏️ Edit Status Kehadiran</h2>
                            <button onClick={() => setEditingRecord(null)} className="text-slate-400 hover:text-white text-xl">✕</button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="bg-slate-800/60 rounded-xl p-3">
                                <p className="text-white font-bold">{editingRecord.user.name}</p>
                                <p className="text-slate-400 text-xs">{editingRecord.user.kelas || editingRecord.user.nis}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Status Kehadiran</label>
                                <select
                                    value={editStatus}
                                    onChange={e => setEditStatus(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="PRESENT">✅ Hadir</option>
                                    <option value="LATE">⏰ Terlambat</option>
                                    <option value="PERMISSION">📋 Izin</option>
                                    <option value="SICK">🏥 Sakit</option>
                                    <option value="ABSENT">❌ Tidak Hadir</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Catatan</label>
                                <textarea
                                    value={editNotes}
                                    onChange={e => setEditNotes(e.target.value)}
                                    rows={2}
                                    placeholder="Catatan opsional..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditingRecord(null)}
                                    className="flex-1 py-3 border border-slate-700 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all"
                                >
                                    {saving ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: Tambah Manual ───────────────────────────────── */}
            {isAddOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={e => { if (e.target === e.currentTarget) setIsAddOpen(false); }}
                >
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm">
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-white font-black text-base">+ Tambah Absensi Manual</h2>
                            <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
                        </div>
                        <form onSubmit={handleManualAdd} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">User ID atau NIS *</label>
                                <input
                                    type="text"
                                    value={addUserId}
                                    onChange={e => setAddUserId(e.target.value)}
                                    placeholder="User ID (CUID) atau NIS peserta"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                                    required
                                />
                                <p className="text-slate-600 text-xs mt-1">Gunakan halaman Kelola Pengguna untuk mendapatkan User ID.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                                <select
                                    value={addStatus}
                                    onChange={e => setAddStatus(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="PRESENT">✅ Hadir</option>
                                    <option value="PERMISSION">📋 Izin</option>
                                    <option value="SICK">🏥 Sakit</option>
                                    <option value="ABSENT">❌ Tidak Hadir</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Catatan</label>
                                <input
                                    type="text"
                                    value={addNotes}
                                    onChange={e => setAddNotes(e.target.value)}
                                    placeholder="Keterangan opsional"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsAddOpen(false)}
                                    className="flex-1 py-3 border border-slate-700 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                                    Batal
                                </button>
                                <button type="submit" disabled={addingManual}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all">
                                    {addingManual ? "Menyimpan..." : "Tambahkan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
