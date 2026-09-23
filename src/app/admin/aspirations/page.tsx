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
                    <h1 className="text-2xl font-bold text-[#202924] dark:text-[#f0f5f2] tracking-tight">
                        Kotak Aspirasi & Advokasi Siswa
                    </h1>
                    <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mt-1">
                        Pusat pengelolaan suara, keluhan fasilitas, dan usulan siswa SMKN 11 Bandung yang dikelola Komisi B MPK.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#718579] dark:text-[#8ba093] mb-1.5">Status Aspirasi</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-[#f0f5f2] focus:outline-none focus:border-[#468366]"
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
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#718579] dark:text-[#8ba093] mb-1.5">Kategori</label>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-[#f0f5f2] focus:outline-none focus:border-[#468366]"
                    >
                        <option value="ALL">Semua Kategori</option>
                        <option value="Fasilitas">Fasilitas Sekolah</option>
                        <option value="Akademik">Pembelajaran & Akademik</option>
                        <option value="Kegiatan">Kegiatan & Event</option>
                        <option value="Tata Tertib">Tata Tertib & Kedisiplinan</option>
                        <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#718579] dark:text-[#8ba093] mb-1.5">Cari Aspirasi</label>
                    <input
                        type="text"
                        placeholder="Cari judul, konten, nama siswa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                    />
                </div>
            </div>

            {/* Aspirations List */}
            {loading ? (
                <div className="py-12 text-center text-[#718579] text-xs">Memuat data aspirasi...</div>
            ) : filteredAspirations.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-8 bg-white dark:bg-[#19241f]">
                    <div className="text-sm font-bold text-[#202924] dark:text-[#f0f5f2]">Belum ada aspirasi masuk</div>
                    <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mt-1 max-w-md mx-auto">
                        Aspirasi siswa yang disampaikan melalui portal suara siswa akan otomatis tercatat di sini.
                    </p>
                </div>
            ) : (
                <div className="space-y-3.5">
                    {filteredAspirations.map((asp) => (
                        <div
                            key={asp.id}
                            className="p-5 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] hover:border-[#468366]/40 transition-all shadow-xs"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#e3ece6] dark:border-[#24342c]">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-[#e8f2ec] text-[#396953] text-[10px] font-semibold uppercase tracking-wider">
                                        {asp.category}
                                    </span>
                                    <span className="text-[11px] text-[#718579] dark:text-[#8ba093]">
                                        Tujuan: {asp.targetDivision?.replace(/_/g, " ") || "Komisi B"}
                                    </span>
                                    {asp.isAnonymous && (
                                        <span className="px-2 py-0.5 rounded-md bg-[#f2f6f3] text-[#5f7167] text-[10px] font-semibold">
                                            Anonim
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span
                                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md ${
                                            asp.status === "PENDING"
                                                ? "bg-[#faf3e1] text-[#785a21]"
                                                : asp.status === "RESOLVED" || asp.status === "APPROVED"
                                                ? "bg-[#e8f2ec] text-[#2e5845]"
                                                : "bg-[#eaf1f8] text-[#2c6194]"
                                        }`}
                                    >
                                        {asp.status === "PENDING" ? "Menunggu Tanggapan" : asp.status}
                                    </span>
                                </div>
                            </div>

                            <div className="my-3">
                                <h3 className="text-sm font-bold text-[#202924] dark:text-[#f0f5f2]">{asp.title}</h3>
                                <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mt-1.5 leading-relaxed whitespace-pre-line">{asp.content}</p>
                            </div>

                            {/* Response Box if Exists */}
                            {asp.response && (
                                <div className="p-3.5 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] my-3">
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#468366] mb-1">
                                        Tanggapan Resmi Pengurus:
                                    </div>
                                    <p className="text-xs text-[#2c3831] dark:text-[#dce6e0] whitespace-pre-line leading-relaxed">{asp.response}</p>
                                    <div className="text-[10px] text-[#718579] mt-1.5">
                                        Ditanggapi pada: {asp.respondedAt ? new Date(asp.respondedAt).toLocaleString("id-ID") : "-"}
                                    </div>
                                </div>
                            )}

                            <div className="mt-3 pt-3 border-t border-[#e3ece6] dark:border-[#24342c] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#718579] dark:text-[#8ba093]">
                                <div>
                                    Pengirim:{" "}
                                    <span className="font-semibold text-[#2c3831] dark:text-[#dce6e0]">
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
                                    className="px-3.5 py-1.5 rounded-lg bg-[#f2f6f3] dark:bg-[#1e2a23] hover:bg-[#e8f0eb] text-[#2e5845] dark:text-[#a3d4bd] border border-[#d4e6db] dark:border-[#24342c] text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
                                >
                                    {asp.response ? "Edit Tanggapan" : "Beri Tanggapan Resmi"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Reply Aspiration */}
            {activeReplyAsp && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e3ece6] dark:border-[#24342c]">
                            <div>
                                <h2 className="text-base font-bold text-[#202924] dark:text-[#f0f5f2]">Tanggapan Aspirasi</h2>
                                <div className="text-xs text-[#468366] font-medium mt-0.5 truncate max-w-sm">
                                    {activeReplyAsp.title}
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveReplyAsp(null)}
                                className="text-[#718579] hover:text-[#202924] dark:hover:text-[#f0f5f2] text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveResponse} className="space-y-4 mt-4">
                            <div className="p-3 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] text-xs text-[#5f7167] dark:text-[#a5b8ad]">
                                <div className="font-semibold text-[#202924] dark:text-[#f0f5f2] mb-1">Aspirasi Siswa:</div>
                                {activeReplyAsp.content}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Status Penanganan</label>
                                <select
                                    value={replyStatus}
                                    onChange={(e) => setReplyStatus(e.target.value)}
                                    className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-[#f0f5f2] focus:outline-none focus:border-[#468366]"
                                >
                                    <option value="IN_REVIEW">IN_REVIEW (Sedang Ditinjau & Dikoordinasikan)</option>
                                    <option value="APPROVED">APPROVED (Disetujui & Diteruskan ke Pihak Sekolah)</option>
                                    <option value="RESOLVED">RESOLVED (Telah Terealisasi / Selesai)</option>
                                    <option value="REJECTED">REJECTED (Tidak Dapat Ditindaklanjuti)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Tulis Tanggapan Resmi *</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tuliskan jawaban atau langkah tindak lanjut resmi dari MPK/OSIS..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl p-3 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3ece6] dark:border-[#24342c]">
                                <button
                                    type="button"
                                    onClick={() => setActiveReplyAsp(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5f7167] hover:text-[#202924] cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingReply}
                                    className="px-5 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
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
