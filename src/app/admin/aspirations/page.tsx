"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Aspiration {
    id: string;
    title: string;
    content: string;
    category: string;
    status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "RESOLVED";
    response?: string | null;
    respondedAt?: string | null;
    isAnonymous: boolean;
    attachmentUrl?: string | null;
    upvotesCount: number;
    targetDivision: string;
    createdAt: string;
    user: {
        name: string;
        email: string | null;
        nis?: string | null;
        kelas?: string | null;
    };
    respondedBy?: {
        name: string;
        position?: string | null;
    } | null;
}

export default function AdminAspirationsPage() {
    const { data: session } = useSession();
    const [aspirations, setAspirations] = useState<Aspiration[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    // Modal or active response input state
    const [activeReplyAsp, setActiveReplyAsp] = useState<Aspiration | null>(null);
    const [replyText, setReplyText] = useState("");
    const [replyStatus, setReplyStatus] = useState<string>("IN_REVIEW");
    const [isSavingReply, setIsSavingReply] = useState(false);

    useEffect(() => {
        fetchAspirations();
    }, []);

    const fetchAspirations = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/aspirations");
            if (res.ok) {
                const result = await res.json();
                const list = Array.isArray(result) ? result : result.data || [];
                setAspirations(list);
            } else {
                setAspirations([]);
            }
        } catch (error) {
            console.error("Gagal mengambil aspirasi:", error);
            setAspirations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveResponse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeReplyAsp || !replyText.trim()) return;

        try {
            setIsSavingReply(true);
            const res = await fetch(`/api/aspirations/${activeReplyAsp.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    response: replyText.trim(),
                    status: replyStatus,
                }),
            });

            if (res.ok) {
                await fetchAspirations();
                setActiveReplyAsp(null);
                setReplyText("");
            }
        } catch (error) {
            console.error("Gagal menyimpan respons aspirasi:", error);
        } finally {
            setIsSavingReply(false);
        }
    };

    const filteredAspirations = aspirations.filter((a) => {
        const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
        const matchCategory = categoryFilter === "ALL" || a.category === categoryFilter;
        const matchSearch =
            !searchQuery ||
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.user?.name && a.user.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchStatus && matchCategory && matchSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                        <span>🗳️</span> Kotak Aspirasi & Advokasi Siswa
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Pusat pengelolaan suara, keluhan, saran, dan aspirasi siswa SMKN 11 Bandung yang dikelola Komisi B MPK.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Status Aspirasi</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="PENDING">PENDING (Menunggu)</option>
                        <option value="IN_REVIEW">IN_REVIEW (Sedang Ditinjau)</option>
                        <option value="APPROVED">APPROVED (Disetujui/Diteruskan)</option>
                        <option value="RESOLVED">RESOLVED (Telah Selesai)</option>
                        <option value="REJECTED">REJECTED (Ditolak)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Kategori</label>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="ALL">Semua Kategori</option>
                        <option value="Fasilitas">🏫 Fasilitas Sekolah</option>
                        <option value="Akademik">📚 Pembelajaran & Akademik</option>
                        <option value="Kegiatan">🎉 Kegiatan & Event</option>
                        <option value="Tata Tertib">📜 Tata Tertib & Kedisiplinan</option>
                        <option value="Ekstrakurikuler">⚽ Ekstrakurikuler</option>
                        <option value="Lainnya">📝 Lainnya</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Cari Aspirasi</label>
                    <input
                        type="text"
                        placeholder="Cari judul, konten, nama siswa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                </div>
            </div>

            {/* Aspirations List */}
            {loading ? (
                <div className="py-12 text-center text-slate-500 text-xs">Memuat data aspirasi...</div>
            ) : filteredAspirations.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-800 rounded-3xl p-8">
                    <div className="text-3xl mb-2">🗳️</div>
                    <div className="text-sm font-bold text-slate-200">Belum ada aspirasi masuk</div>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        Aspirasi siswa yang disampaikan melalui formulir suara siswa akan masuk dan tercatat di sini.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAspirations.map((asp) => (
                        <div
                            key={asp.id}
                            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                                        {asp.category}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                        Target: {asp.targetDivision?.replace(/_/g, " ") || "Komisi B"}
                                    </span>
                                    {asp.isAnonymous && (
                                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold border border-slate-700">
                                            🔒 Anonim
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span
                                        className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                                            asp.status === "PENDING"
                                                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                                : asp.status === "RESOLVED" || asp.status === "APPROVED"
                                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                                : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                                        }`}
                                    >
                                        {asp.status}
                                    </span>
                                </div>
                            </div>

                            <div className="my-3">
                                <h3 className="text-base font-bold text-white">{asp.title}</h3>
                                <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">{asp.content}</p>
                            </div>

                            {/* Response Box if Exists */}
                            {asp.response && (
                                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 my-3">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                                        <span>💬</span>
                                        <span>Tanggapan Resmi Pengurus:</span>
                                    </div>
                                    <p className="text-xs text-emerald-100 whitespace-pre-line leading-relaxed">{asp.response}</p>
                                    <div className="text-[10px] text-emerald-400/70 mt-2">
                                        Ditanggapi pada: {asp.respondedAt ? new Date(asp.respondedAt).toLocaleString("id-ID") : "-"}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                                <div>
                                    Pengirim:{" "}
                                    <span className="font-semibold text-slate-300">
                                        {asp.isAnonymous ? "Siswa SMKN 11 (Anonim)" : `${asp.user?.name || "Siswa"} (${asp.user?.kelas || "-"})`}
                                    </span>{" "}
                                    • {new Date(asp.createdAt).toLocaleDateString("id-ID")}
                                </div>
                                <button
                                    onClick={() => {
                                        setActiveReplyAsp(asp);
                                        setReplyText(asp.response || "");
                                        setReplyStatus(asp.status === "PENDING" ? "IN_REVIEW" : asp.status);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all self-start sm:self-auto flex items-center gap-1.5"
                                >
                                    <span>💬</span>
                                    <span>{asp.response ? "Edit Tanggapan" : "Beri Tanggapan Resmi"}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Reply Aspiration */}
            {activeReplyAsp && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-white">Tanggapan Advokasi Aspirasi</h2>
                                <div className="text-xs text-emerald-400 font-semibold mt-0.5 truncate max-w-sm">
                                    {activeReplyAsp.title}
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveReplyAsp(null)}
                                className="text-slate-400 hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveResponse} className="space-y-4 mt-4">
                            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                                <div className="font-bold text-white mb-1">Aspirasi Siswa:</div>
                                {activeReplyAsp.content}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Status Penanganan</label>
                                <select
                                    value={replyStatus}
                                    onChange={(e) => setReplyStatus(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="IN_REVIEW">IN_REVIEW (Sedang Ditinjau & Dikoordinasikan)</option>
                                    <option value="APPROVED">APPROVED (Disetujui & Diteruskan ke Pihak Sekolah)</option>
                                    <option value="RESOLVED">RESOLVED (Telah Terealisasi / Selesai)</option>
                                    <option value="REJECTED">REJECTED (Tidak Dapat Ditindaklanjuti)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Tulis Tanggapan Resmi *</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tuliskan jawaban atau langkah tindak lanjut resmi dari MPK/OSIS..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setActiveReplyAsp(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingReply}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
                                >
                                    {isSavingReply ? "Menyimpan..." : "Kirim Tanggapan Resmi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
