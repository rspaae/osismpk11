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
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                        <span>📋</span> Program Kerja & Anggaran
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Perencanaan, alokasi anggaran, dan pengawasan proker 10 Sekbid OSIS & 4 Komisi MPK SMKN 11.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 self-start"
                >
                    <span>+</span>
                    <span>Tambah Program Kerja</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Divisi / Sekbid / Komisi</label>
                    <select
                        value={selectedDivision}
                        onChange={(e) => setSelectedDivision(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                        {DIVISIONS.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Status Proker</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
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
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Pencarian</label>
                    <input
                        type="text"
                        placeholder="Cari judul proker, PIC..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                </div>
            </div>

            {/* Proker Cards List */}
            {loading ? (
                <div className="py-12 text-center text-slate-500 text-xs">Memuat daftar program kerja...</div>
            ) : filteredProkers.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-800 rounded-3xl p-8">
                    <div className="text-3xl mb-2">📋</div>
                    <div className="text-sm font-bold text-slate-200">Belum ada program kerja yang terdaftar</div>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        Klik tombol &ldquo;Tambah Program Kerja&rdquo; di atas untuk mendaftarkan rencana kegiatan baru.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProkers.map((proker) => (
                        <div
                            key={proker.id}
                            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                                        {proker.division.replace(/_/g, " ")}
                                    </div>
                                    <span
                                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                            proker.status === "PLANNED"
                                                ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                                                : proker.status === "ONGOING"
                                                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                                : proker.status === "COMPLETED"
                                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                                : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                                        }`}
                                    >
                                        {proker.status}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-white leading-snug">{proker.title}</h3>
                                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{proker.description}</p>

                                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <div className="text-[10px] text-slate-500">Anggaran Rencana (RAB)</div>
                                        <div className="font-bold text-slate-200">
                                            Rp {(proker.budget || proker.budgetPlanned || 0).toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500">Target Pelaksanaan</div>
                                        <div className="font-bold text-slate-200">{proker.targetPeriod || "-"}</div>
                                    </div>
                                    {proker.personInCharge && (
                                        <div className="col-span-2 text-[11px] text-slate-400">
                                            <span className="text-slate-500">PIC:</span> {proker.personInCharge}
                                        </div>
                                    )}
                                </div>

                                {proker.evaluationNotes && (
                                    <div className="mt-3 p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30 text-[11px] text-purple-200">
                                        <div className="font-bold text-purple-300 text-[10px] uppercase">Evaluasi MPK:</div>
                                        {proker.evaluationNotes}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500">
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
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
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
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span>📋</span> Tambah Program Kerja Baru
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
                                <label className="block text-xs font-bold text-slate-300 mb-1">Judul Program Kerja *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Latihan Dasar Kepemimpinan (LDKS) 2026"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Divisi Pelaksana *</label>
                                    <select
                                        value={division}
                                        onChange={(e) => setDivision(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        {DIVISIONS.filter((d) => d.code !== "ALL").map((d) => (
                                            <option key={d.code} value={d.code}>
                                                {d.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Target Waktu *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Oktober 2026"
                                        value={targetPeriod}
                                        onChange={(e) => setTargetPeriod(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Anggaran Rencana (Rp)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Penanggung Jawab (PIC)</label>
                                    <input
                                        type="text"
                                        placeholder="Nama Anggota / Koordinator"
                                        value={personInCharge}
                                        onChange={(e) => setPersonInCharge(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Deskripsi & Tujuan Proker *</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Jelaskan rincian agenda, target peserta, dan output kegiatan..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Link Dokumen Proposal (Opsional)</label>
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/..."
                                    value={proposalUrl}
                                    onChange={(e) => setProposalUrl(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
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
                                    {isSubmitting ? "Menyimpan..." : "Simpan Program Kerja"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit / Evaluasi Proker */}
            {editingProker && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-white">Kelola & Evaluasi Proker</h2>
                                <div className="text-xs text-emerald-400 font-semibold mt-0.5">{editingProker.title}</div>
                            </div>
                            <button
                                onClick={() => setEditingProker(null)}
                                className="text-slate-400 hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Status Proker</label>
                                <select
                                    value={evalStatus}
                                    onChange={(e) => setEvalStatus(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="PLANNED">PLANNED (Direncanakan)</option>
                                    <option value="ONGOING">ONGOING (Sedang Berjalan)</option>
                                    <option value="COMPLETED">COMPLETED (Selesai Terlaksana)</option>
                                    <option value="EVALUATED">EVALUATED (Telah Dievaluasi MPK)</option>
                                    <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Realisasi Anggaran Terpakai (Rp)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={evalRealized}
                                    onChange={(e) => setEvalRealized(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Catatan Evaluasi (Komisi D MPK / Pembina)</label>
                                <textarea
                                    rows={3}
                                    placeholder="Tuliskan evaluasi pelaksanaan, kendala, saran ke depan..."
                                    value={evalNotes}
                                    onChange={(e) => setEvalNotes(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Link Dokumen LPJ (Laporan Pertanggungjawaban)</label>
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/..."
                                    value={evalLpj}
                                    onChange={(e) => setEvalLpj(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingProker(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
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
