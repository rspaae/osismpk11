"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    content: string;
    coverImage?: string | null;
    category: string;
    division: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    eventDate?: string | null;
    views: number;
    author: {
        name: string;
        role: string;
    };
    createdAt: string;
}

const CATEGORIES = [
    "Kepemimpinan", "Olahraga & Kesehatan", "Seni & Budaya",
    "Keagamaan", "Lingkungan Hidup", "Teknologi & Informasi",
    "Sosial & Kemasyarakatan", "Akademik", "Aspirasi & Advokasi", "Umum"
];

const DIVISIONS = [
    { value: "GENERAL", label: "Umum (OSIS-MPK)" },
    { value: "BPH_OSIS", label: "BPH OSIS" },
    { value: "BPH_MPK", label: "BPH MPK" },
    { value: "SEKBID_1", label: "Sekbid 1 – Keimanan & Ketaqwaan" },
    { value: "SEKBID_2", label: "Sekbid 2 – Budi Pekerti" },
    { value: "SEKBID_3", label: "Sekbid 3 – Wawasan Kebangsaan" },
    { value: "SEKBID_4", label: "Sekbid 4 – Kepribadian Bangsa" },
    { value: "SEKBID_5", label: "Sekbid 5 – Demokrasi" },
    { value: "SEKBID_6", label: "Sekbid 6 – Olahraga & Kesehatan" },
    { value: "SEKBID_7", label: "Sekbid 7 – Seni & Budaya" },
    { value: "SEKBID_8", label: "Sekbid 8 – Lingkungan Hidup" },
    { value: "SEKBID_9", label: "Sekbid 9 – Teknologi & Informasi" },
    { value: "SEKBID_10", label: "Sekbid 10 – Kewirausahaan" },
    { value: "KOMISI_A", label: "Komisi A – Keorganisasian" },
    { value: "KOMISI_B", label: "Komisi B – Aspirasi & Advokasi" },
    { value: "KOMISI_C", label: "Komisi C – Keuangan" },
    { value: "KOMISI_D", label: "Komisi D – Pengawasan" },
];

const EMPTY_FORM = {
    title: "", excerpt: "", content: "", category: "Kepemimpinan",
    division: "GENERAL", coverImage: "", eventDate: "", status: "PUBLISHED"
};

export default function AdminActivitiesPage() {
    const { data: session } = useSession();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("PUBLISHED");

    // Form state
    const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    // Delete confirm
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    useEffect(() => { fetchActivities(); }, [filterStatus]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/activities?status=${filterStatus}&limit=50`);
            if (res.ok) {
                const data = await res.json();
                setActivities(data.data || []);
            }
        } catch (error) {
            console.error("Gagal memuat kegiatan:", error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const openCreate = () => {
        setForm({ ...EMPTY_FORM });
        setEditingId(null);
        setModalMode("create");
    };

    const openEdit = (item: Activity) => {
        setForm({
            title: item.title,
            excerpt: item.excerpt || "",
            content: item.content,
            category: item.category,
            division: item.division,
            coverImage: item.coverImage || "",
            eventDate: item.eventDate ? item.eventDate.split("T")[0] : "",
            status: item.status,
        });
        setEditingId(item.id);
        setModalMode("edit");
    };

    const closeModal = () => {
        setModalMode(null);
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) return;

        try {
            setIsSubmitting(true);

            if (modalMode === "create") {
                const res = await fetch("/api/activities", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: form.title,
                        excerpt: form.excerpt || undefined,
                        content: form.content,
                        category: form.category,
                        division: form.division,
                        coverImage: form.coverImage || undefined,
                        status: form.status,
                        eventDate: form.eventDate || undefined,
                    }),
                });
                if (res.ok) {
                    showToast("✅ Artikel berhasil dipublikasikan!");
                    closeModal();
                    fetchActivities();
                } else {
                    const err = await res.json();
                    showToast(err.error || "Gagal mempublikasikan", "error");
                }
            } else if (modalMode === "edit" && editingId) {
                const res = await fetch(`/api/activities/${editingId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: form.title,
                        excerpt: form.excerpt || undefined,
                        content: form.content,
                        category: form.category,
                        division: form.division,
                        coverImage: form.coverImage || undefined,
                        status: form.status,
                        eventDate: form.eventDate || undefined,
                    }),
                });
                if (res.ok) {
                    showToast("✅ Artikel berhasil diperbarui!");
                    closeModal();
                    fetchActivities();
                } else {
                    const err = await res.json();
                    showToast(err.error || "Gagal memperbarui", "error");
                }
            }
        } catch {
            showToast("Terjadi kesalahan jaringan", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
            if (res.ok) {
                showToast("🗑️ Artikel berhasil dihapus");
                setDeleteConfirmId(null);
                fetchActivities();
            } else {
                showToast("Gagal menghapus artikel", "error");
            }
        } catch {
            showToast("Terjadi kesalahan jaringan", "error");
        }
    };

    const inputClass = "w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366] transition-all";
    const labelClass = "block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1.5";

    return (
        <div className="space-y-6">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl text-xs font-semibold shadow-lg border ${
                            toast.type === "success"
                                ? "bg-[#e8f2ec] border-[#468366] text-[#2e5845]"
                                : "bg-[#fbf2f2] border-[#e07171] text-[#b91c1c]"
                        }`}
                    >
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#202924] dark:text-[#f0f5f2] tracking-tight">
                        Publikasi & Dokumentasi Kegiatan
                    </h1>
                    <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mt-1">
                        Kelola berita, foto dokumentasi, dan artikel resmi OSIS-MPK SMKN 11 Bandung yang tampil di halaman publik.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="px-4 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-2 self-start shrink-0 cursor-pointer"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Tulis Artikel Baru</span>
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
                {["PUBLISHED", "DRAFT", "ARCHIVED"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            filterStatus === s
                                ? "bg-[#468366] text-white shadow-xs"
                                : "bg-white dark:bg-[#19241f] text-[#5f7167] dark:text-[#a5b8ad] border border-[#e3ece6] dark:border-[#24342c] hover:border-[#468366]/50"
                        }`}
                    >
                        {s === "PUBLISHED" ? "Dipublikasikan" : s === "DRAFT" ? "Draft" : "Diarsipkan"}
                    </button>
                ))}
                <span className="text-xs text-[#718579] dark:text-[#8ba093] ml-auto">{activities.length} artikel</span>
            </div>

            {/* Articles List */}
            {loading ? (
                <div className="py-12 text-center text-[#718579] text-xs">Memuat daftar artikel...</div>
            ) : activities.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-8 bg-white dark:bg-[#19241f]">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#e8f2ec] text-[#396953] flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <div className="text-sm font-bold text-[#202924] dark:text-[#f0f5f2]">Belum ada artikel dipublikasikan</div>
                    <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mt-1 max-w-md mx-auto">
                        Klik tombol &ldquo;Tulis Artikel Baru&rdquo; untuk mulai mempublikasikan dokumentasi kegiatan periode 2026/2027.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {activities.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] hover:border-[#468366]/40 transition-all flex flex-col overflow-hidden shadow-xs"
                        >
                            {/* Cover Image */}
                            {item.coverImage && (
                                <div className="aspect-[16/7] w-full overflow-hidden bg-[#f0f5f2] dark:bg-[#141c18]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.coverImage}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                </div>
                            )}

                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-[#e8f2ec] text-[#396953] text-[10px] font-semibold uppercase tracking-wider">
                                        {item.category}
                                    </span>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                        item.status === "PUBLISHED"
                                            ? "bg-[#e8f2ec] text-[#2e5845]"
                                            : item.status === "DRAFT"
                                                ? "bg-[#faf3e1] text-[#785a21]"
                                                : "bg-[#f2f6f3] text-[#5f7167]"
                                    }`}>
                                        {item.status === "PUBLISHED" ? "Publik" : item.status === "DRAFT" ? "Draft" : "Arsip"}
                                    </span>
                                </div>

                                <h3 className="text-sm font-bold text-[#202924] dark:text-[#f0f5f2] leading-snug mb-1 line-clamp-2">{item.title}</h3>
                                <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] line-clamp-2 flex-1">
                                    {item.excerpt || item.content}
                                </p>

                                <div className="mt-3 pt-3 border-t border-[#e3ece6] dark:border-[#24342c] flex items-center justify-between">
                                    <span className="text-[11px] text-[#718579] dark:text-[#8ba093]">
                                        {item.author?.name || "Admin"} · {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="text-xs font-semibold text-[#468366] hover:underline cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmId(item.id)}
                                            className="text-xs font-semibold text-[#c53030]/70 hover:text-[#c53030] transition-colors cursor-pointer"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirm Dialog */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-6 shadow-xl text-center"
                        >
                            <h3 className="text-sm font-bold text-[#202924] dark:text-[#f0f5f2] mb-1">Hapus Artikel Ini?</h3>
                            <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mb-5">Tindakan ini tidak bisa dibatalkan. Artikel akan terhapus dari database.</p>
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5f7167] hover:text-[#202924] border border-[#d4e6db] dark:border-[#24342c] transition-all cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirmId)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#c53030] hover:bg-red-700 text-white transition-all cursor-pointer"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create / Edit Modal */}
            <AnimatePresence>
                {modalMode && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 12 }}
                            className="w-full max-w-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl shadow-xl my-6"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-[#e3ece6] dark:border-[#24342c]">
                                <h2 className="text-base font-bold text-[#202924] dark:text-[#f0f5f2]">
                                    {modalMode === "create" ? "Tulis Artikel & Dokumentasi Baru" : "Edit Artikel"}
                                </h2>
                                <button onClick={closeModal} className="text-[#5f7167] hover:text-[#202924] dark:hover:text-[#f0f5f2] transition-colors text-sm cursor-pointer">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                {/* Judul */}
                                <div>
                                    <label className={labelClass}>Judul Artikel *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Porseni SMKN 11 2026 — Mempererat Kebersamaan Antar Kelas"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>

                                {/* Kategori & Divisi */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Kategori *</label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            className={inputClass}
                                        >
                                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Divisi Terkait *</label>
                                        <select
                                            value={form.division}
                                            onChange={(e) => setForm({ ...form, division: e.target.value })}
                                            className={inputClass}
                                        >
                                            {DIVISIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Ringkasan */}
                                <div>
                                    <label className={labelClass}>Ringkasan Singkat <span className="text-[#718579] font-normal">(tampil sebagai preview)</span></label>
                                    <input
                                        type="text"
                                        placeholder="1–2 kalimat ringkasan untuk preview artikel di halaman publik..."
                                        value={form.excerpt}
                                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>

                                {/* Isi Konten */}
                                <div>
                                    <label className={labelClass}>Isi Lengkap Berita / Dokumentasi *</label>
                                    <textarea
                                        required
                                        rows={7}
                                        placeholder="Tuliskan laporan lengkap kegiatan di sini. Deskripsikan apa yang terjadi, siapa yang terlibat, hasil yang dicapai, dan kesan peserta..."
                                        value={form.content}
                                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                                        className={`${inputClass} resize-y`}
                                    />
                                </div>

                                {/* Cover Image URL */}
                                <div>
                                    <label className={labelClass}>
                                        URL Foto Cover
                                        <span className="text-[#718579] font-normal ml-1">— tautan foto online (Google Drive / imgbb, dll.)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="https://i.ibb.co/... atau https://drive.google.com/uc?id=..."
                                        value={form.coverImage}
                                        onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                                        className={inputClass}
                                    />
                                    {form.coverImage && (
                                        <div className="mt-2 rounded-xl overflow-hidden border border-[#d4e6db] dark:border-[#24342c] h-28 bg-[#f7faf7] dark:bg-[#141c18]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={form.coverImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Tanggal & Status */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Tanggal Kegiatan</label>
                                        <input
                                            type="date"
                                            value={form.eventDate}
                                            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Status Publikasi</label>
                                        <select
                                            value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                            className={inputClass}
                                        >
                                            <option value="PUBLISHED">Publikasikan Langsung</option>
                                            <option value="DRAFT">Simpan sebagai Draft</option>
                                            <option value="ARCHIVED">Arsipkan</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3ece6] dark:border-[#24342c]">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5f7167] hover:text-[#202924] dark:hover:text-[#f0f5f2] cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] disabled:opacity-60 text-white text-xs font-semibold transition-all cursor-pointer"
                                    >
                                        {isSubmitting
                                            ? (modalMode === "create" ? "Mempublikasikan..." : "Menyimpan...")
                                            : (modalMode === "create" ? "Publikasikan Artikel" : "Simpan Perubahan")}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
