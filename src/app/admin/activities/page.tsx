"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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

export default function AdminActivitiesPage() {
    const { data: session } = useSession();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal Create Activity
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Kepemimpinan");
    const [division, setDivision] = useState("GENERAL");
    const [coverImage, setCoverImage] = useState("");
    const [status, setStatus] = useState<string>("PUBLISHED");
    const [eventDate, setEventDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/activities?status=PUBLISHED");
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        try {
            setIsSubmitting(true);
            const res = await fetch("/api/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    excerpt,
                    content,
                    category,
                    division,
                    coverImage: coverImage || undefined,
                    status,
                    eventDate: eventDate || undefined,
                }),
            });

            if (res.ok) {
                await fetchActivities();
                setIsCreateOpen(false);
                setTitle("");
                setExcerpt("");
                setContent("");
                setCoverImage("");
                setEventDate("");
            }
        } catch (error) {
            console.error("Gagal membuat kegiatan:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                        <span>📰</span> Publikasi Berita & Dokumentasi
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Kelola berita, galeri, dan dokumentasi event resmi OSIS-MPK yang tampil pada web publik.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 self-start"
                >
                    <span>+</span>
                    <span>Tulis Berita Baru</span>
                </button>
            </div>

            {/* Activities List */}
            {loading ? (
                <div className="py-12 text-center text-slate-500 text-xs">Memuat daftar berita...</div>
            ) : activities.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-800 rounded-3xl p-8">
                    <div className="text-3xl mb-2">📰</div>
                    <div className="text-sm font-bold text-slate-200">Belum ada berita / dokumentasi kegiatan</div>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        Klik tombol &ldquo;Tulis Berita Baru&rdquo; untuk mempublikasikan dokumentasi proker atau event sekolah.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map((item) => (
                        <div
                            key={item.id}
                            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                                        {item.category}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                        {item.status}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
                                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                                    {item.excerpt || item.content}
                                </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                                <span>Oleh: {item.author?.name || "Admin"}</span>
                                <span>👁️ {item.views} views</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Create Activity */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span>📰</span> Tulis Berita & Dokumentasi Baru
                            </h2>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="text-slate-400 hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Judul Artikel / Kegiatan *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Sukses Digelar, Porseni SMKN 11 Bandung Lahirkan Bibit Unggul"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Kategori *</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="Kepemimpinan">Kepemimpinan</option>
                                        <option value="Olahraga">Olahraga & Kesehatan</option>
                                        <option value="Seni & Budaya">Seni & Budaya</option>
                                        <option value="Keagamaan">Keagamaan</option>
                                        <option value="Lingkungan">Lingkungan Hidup</option>
                                        <option value="Teknologi">Teknologi & Informasi</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Divisi Terkait *</label>
                                    <select
                                        value={division}
                                        onChange={(e) => setDivision(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="GENERAL">Umum (OSIS-MPK)</option>
                                        <option value="BPH_OSIS">BPH OSIS</option>
                                        <option value="BPH_MPK">BPH MPK</option>
                                        <option value="SEKBID_7">Sekbid 7 (Seni)</option>
                                        <option value="SEKBID_6">Sekbid 6 (Olahraga)</option>
                                        <option value="SEKBID_9">Sekbid 9 (IT & Medinfo)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Ringkasan Singkat (Excerpt)</label>
                                <input
                                    type="text"
                                    placeholder="Ringkasan 1-2 kalimat untuk preview feed..."
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Isi Lengkap Berita *</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Tuliskan berita lengkap dokumentasi kegiatan di sini..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">URL Foto Cover</label>
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/..."
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Tanggal Event</label>
                                    <input
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
                                >
                                    {isSubmitting ? "Mempublikasikan..." : "Publikasikan Berita"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
