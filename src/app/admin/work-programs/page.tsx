"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface WorkProgram {
    id: string;
    title: string;
    description: string;
    division: string;
    targetPeriod: string;
    budget: number;
    budgetPlanned?: number;
    budgetRealized?: number;
    status: "PLANNED" | "ONGOING" | "COMPLETED" | "EVALUATED" | "CANCELLED";
    personInCharge?: string | null;
    proposalUrl?: string | null;
    lpjUrl?: string | null;
    evaluationNotes?: string | null;
    author: {
        name: string;
        email: string;
    };
    createdAt: string;
}

const DIVISIONS = [
    { code: "ALL", label: "Semua Divisi" },
    { code: "BPH_OSIS", label: "BPH OSIS" },
    { code: "BPH_MPK", label: "BPH MPK" },
    { code: "SEKBID_1", label: "Sekbid 1 (Agama)" },
    { code: "SEKBID_2", label: "Sekbid 2 (Budi Pekerti)" },
    { code: "SEKBID_3", label: "Sekbid 3 (Kebangsaan)" },
    { code: "SEKBID_4", label: "Sekbid 4 (Kepribadian)" },
    { code: "SEKBID_5", label: "Sekbid 5 (Demokrasi)" },
    { code: "SEKBID_6", label: "Sekbid 6 (Jasmani)" },
    { code: "SEKBID_7", label: "Sekbid 7 (Seni Budaya)" },
    { code: "SEKBID_8", label: "Sekbid 8 (Lingkungan)" },
    { code: "SEKBID_9", label: "Sekbid 9 (IT & Sosmed)" },
    { code: "SEKBID_10", label: "Sekbid 10 (Kewirausahaan)" },
    { code: "KOMISI_A", label: "Komisi A (AD/ART)" },
    { code: "KOMISI_B", label: "Komisi B (Aspirasi)" },
    { code: "KOMISI_C", label: "Komisi C (Keuangan)" },
    { code: "KOMISI_D", label: "Komisi D (Pengawasan)" },
];

export default function WorkProgramsPage() {
    const { data: session } = useSession();
    const [prokers, setProkers] = useState<WorkProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDivision, setSelectedDivision] = useState("ALL");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [division, setDivision] = useState("SEKBID_1");
    const [targetPeriod, setTargetPeriod] = useState("");
    const [budget, setBudget] = useState("0");
    const [personInCharge, setPersonInCharge] = useState("");
    const [proposalUrl, setProposalUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit/Evaluate Modal State
    const [editingProker, setEditingProker] = useState<WorkProgram | null>(null);
    const [evalStatus, setEvalStatus] = useState<string>("PLANNED");
    const [evalNotes, setEvalNotes] = useState("");
    const [evalRealized, setEvalRealized] = useState("0");
    const [evalLpj, setEvalLpj] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchProkers();
    }, []);

    const fetchProkers = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/work-programs");
            if (res.ok) {
                const result = await res.json();
                const list = Array.isArray(result) ? result : result.data || [];
                setProkers(list);
            } else {
                setProkers([]);
            }
        } catch (error) {
            console.error("Gagal mengambil data proker:", error);
            setProkers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        try {
            setIsSubmitting(true);
            const res = await fetch("/api/work-programs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    division,
                    targetPeriod,
                    budget: parseFloat(budget) || 0,
                    personInCharge,
                    proposalUrl,
                }),
            });

            if (res.ok) {
                await fetchProkers();
                setIsCreateOpen(false);
                setTitle("");
                setDescription("");
                setTargetPeriod("");
                setBudget("0");
                setPersonInCharge("");
                setProposalUrl("");
            }
        } catch (error) {
            console.error("Gagal membuat proker:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProker) return;

        try {
            setIsUpdating(true);
            const res = await fetch("/api/work-programs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingProker.id,
                    status: evalStatus,
                    evaluationNotes: evalNotes,
                    budgetRealized: parseFloat(evalRealized) || 0,
                    lpjUrl: evalLpj,
                }),
            });

            if (res.ok) {
                await fetchProkers();
                setEditingProker(null);
            }
        } catch (error) {
            console.error("Gagal memperbarui proker:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredProkers = prokers.filter((p) => {
        const matchDiv = selectedDivision === "ALL" || p.division === selectedDivision;
        const matchStat = selectedStatus === "ALL" || p.status === selectedStatus;
        const matchSearch =
            !searchQuery ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.personInCharge && p.personInCharge.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchDiv && matchStat && matchSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#202924] dark:text-[#f0f5f2] tracking-tight">
                        Program Kerja & Anggaran
                    </h1>
                    <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mt-1">
                        Perencanaan, alokasi anggaran, dan pengawasan proker 10 Sekbid OSIS & 4 Komisi MPK SMKN 11 Bandung.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-2 self-start cursor-pointer"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Tambah Program Kerja</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#718579] dark:text-[#8ba093] mb-1.5">Divisi / Sekbid / Komisi</label>
                    <select
                        value={selectedDivision}
                        onChange={(e) => setSelectedDivision(e.target.value)}
                        className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-[#f0f5f2] focus:outline-none focus:border-[#468366]"
                    >
                        {DIVISIONS.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#718579] dark:text-[#8ba093] mb-1.5">Status Proker</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-[#f0f5f2] focus:outline-none focus:border-[#468366]"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="PLANNED">Planned (Direncanakan)</option>
                        <option value="ONGOING">Ongoing (Sedang Berjalan)</option>
                        <option value="COMPLETED">Completed (Terlaksana)</option>
                        <option value="EVALUATED">Evaluated (Telah Dievaluasi)</option>
                        <option value="CANCELLED">Cancelled (Dibatalkan)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#718579] dark:text-[#8ba093] mb-1.5">Pencarian</label>
                    <input
                        type="text"
                        placeholder="Cari judul proker, PIC..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                    />
                </div>
            </div>

            {/* Proker Cards List */}
            {loading ? (
                <div className="py-12 text-center text-[#718579] text-xs">Memuat daftar program kerja...</div>
            ) : filteredProkers.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-8 bg-white dark:bg-[#19241f]">
                    <div className="text-sm font-bold text-[#202924] dark:text-[#f0f5f2]">Belum ada program kerja yang terdaftar</div>
                    <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mt-1 max-w-md mx-auto">
                        Klik tombol &ldquo;Tambah Program Kerja&rdquo; di atas untuk mendaftarkan rencana kegiatan baru.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProkers.map((proker) => (
                        <div
                            key={proker.id}
                            className="p-5 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] hover:border-[#468366]/40 transition-all flex flex-col justify-between shadow-xs"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#e8f2ec] text-[#396953] text-[10px] font-semibold uppercase tracking-wider">
                                        {proker.division.replace(/_/g, " ")}
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md ${
                                            proker.status === "PLANNED"
                                                ? "bg-[#eaf1f8] text-[#2c6194]"
                                                : proker.status === "ONGOING"
                                                ? "bg-[#faf3e1] text-[#785a21]"
                                                : proker.status === "COMPLETED"
                                                ? "bg-[#e8f2ec] text-[#2e5845]"
                                                : "bg-[#f2f6f3] text-[#5f7167]"
                                        }`}
                                    >
                                        {proker.status}
                                    </span>
                                </div>

                                <h3 className="text-sm font-bold text-[#202924] dark:text-[#f0f5f2] leading-snug">{proker.title}</h3>
                                <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mt-1.5 line-clamp-2">{proker.description}</p>

                                <div className="mt-3.5 pt-3 border-t border-[#e3ece6] dark:border-[#24342c] grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <div className="text-[10px] text-[#718579] dark:text-[#8ba093]">Anggaran Rencana (RAB)</div>
                                        <div className="font-bold text-[#202924] dark:text-[#f0f5f2]">
                                            Rp {(proker.budget || proker.budgetPlanned || 0).toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-[#718579] dark:text-[#8ba093]">Target Pelaksanaan</div>
                                        <div className="font-bold text-[#202924] dark:text-[#f0f5f2]">{proker.targetPeriod || "-"}</div>
                                    </div>
                                    {proker.personInCharge && (
                                        <div className="col-span-2 text-[11px] text-[#5f7167] dark:text-[#a5b8ad]">
                                            <span className="text-[#718579]">PIC:</span> {proker.personInCharge}
                                        </div>
                                    )}
                                </div>

                                {proker.evaluationNotes && (
                                    <div className="mt-3 p-2.5 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] text-[11px] text-[#2c3831] dark:text-[#dce6e0]">
                                        <div className="font-semibold text-[#468366] text-[10px] uppercase">Evaluasi MPK:</div>
                                        {proker.evaluationNotes}
                                    </div>
                                )}
                            </div>

                            <div className="mt-3.5 pt-3 border-t border-[#e3ece6] dark:border-[#24342c] flex items-center justify-between">
                                <span className="text-[10px] text-[#718579] dark:text-[#8ba093]">
                                    Dibuat: {new Date(proker.createdAt).toLocaleDateString("id-ID")}
                                </span>
                                <button
                                    onClick={() => {
                                        setEditingProker(proker);
                                        setEvalStatus(proker.status);
                                        setEvalNotes(proker.evaluationNotes || "");
                                        setEvalRealized(String(proker.budgetRealized || 0));
                                        setEvalLpj(proker.lpjUrl || "");
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#f2f6f3] dark:bg-[#1e2a23] hover:bg-[#e8f0eb] text-xs font-semibold text-[#2e5845] dark:text-[#a3d4bd] border border-[#d4e6db] dark:border-[#24342c] transition-colors cursor-pointer"
                                >
                                    Kelola & Evaluasi
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Create Proker */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e3ece6] dark:border-[#24342c]">
                            <h2 className="text-base font-bold text-[#202924] dark:text-[#f0f5f2]">
                                Tambah Program Kerja Baru
                            </h2>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="text-[#718579] hover:text-[#202924] text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Judul Program Kerja *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Latihan Dasar Kepemimpinan (LDKS) 2026"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Divisi Pelaksana *</label>
                                    <select
                                        value={division}
                                        onChange={(e) => setDivision(e.target.value)}
                                        className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-[#f0f5f2] focus:outline-none focus:border-[#468366]"
                                    >
                                        {DIVISIONS.filter((d) => d.code !== "ALL").map((d) => (
                                            <option key={d.code} value={d.code}>
                                                {d.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Target Waktu *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Oktober 2026"
                                        value={targetPeriod}
                                        onChange={(e) => setTargetPeriod(e.target.value)}
                                        className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Anggaran Rencana (Rp)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-[#f0f5f2] focus:outline-none focus:border-[#468366]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Penanggung Jawab (PIC)</label>
                                    <input
                                        type="text"
                                        placeholder="Nama Anggota / Koordinator"
                                        value={personInCharge}
                                        onChange={(e) => setPersonInCharge(e.target.value)}
                                        className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Deskripsi & Tujuan Proker *</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Jelaskan rincian agenda, target peserta, dan output kegiatan..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl p-3 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Link Dokumen Proposal (Opsional)</label>
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/..."
                                    value={proposalUrl}
                                    onChange={(e) => setProposalUrl(e.target.value)}
                                    className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3ece6] dark:border-[#24342c]">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5f7167] hover:text-[#202924] cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                                >
                                    {isSubmitting ? "Menyimpan..." : "Simpan Program Kerja"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit / Evaluasi Proker */}
            {editingProker && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e3ece6] dark:border-[#24342c]">
                            <div>
                                <h2 className="text-base font-bold text-[#202924] dark:text-[#f0f5f2]">Kelola & Evaluasi Proker</h2>
                                <div className="text-xs text-[#468366] font-medium mt-0.5">{editingProker.title}</div>
                            </div>
                            <button
                                onClick={() => setEditingProker(null)}
                                className="text-[#718579] hover:text-[#202924] text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Status Proker</label>
                                <select
                                    value={evalStatus}
                                    onChange={(e) => setEvalStatus(e.target.value)}
                                    className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-[#f0f5f2] focus:outline-none focus:border-[#468366]"
                                >
                                    <option value="PLANNED">PLANNED (Direncanakan)</option>
                                    <option value="ONGOING">ONGOING (Sedang Berjalan)</option>
                                    <option value="COMPLETED">COMPLETED (Selesai Terlaksana)</option>
                                    <option value="EVALUATED">EVALUATED (Telah Dievaluasi MPK)</option>
                                    <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Realisasi Anggaran Terpakai (Rp)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={evalRealized}
                                    onChange={(e) => setEvalRealized(e.target.value)}
                                    className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-[#f0f5f2] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Catatan Evaluasi (Komisi D MPK / Pembina)</label>
                                <textarea
                                    rows={3}
                                    placeholder="Tuliskan evaluasi pelaksanaan, kendala, saran ke depan..."
                                    value={evalNotes}
                                    onChange={(e) => setEvalNotes(e.target.value)}
                                    className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl p-3 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#2c3831] dark:text-[#dce6e0] mb-1">Link Dokumen LPJ (Laporan Pertanggungjawaban)</label>
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/..."
                                    value={evalLpj}
                                    onChange={(e) => setEvalLpj(e.target.value)}
                                    className="w-full bg-[#f7faf7] dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-[#f0f5f2] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3ece6] dark:border-[#24342c]">
                                <button
                                    type="button"
                                    onClick={() => setEditingProker(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5f7167] hover:text-[#202924] cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-5 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                                >
                                    {isUpdating ? "Memperbarui..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
