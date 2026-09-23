"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface MemberTask {
    id: string;
    title: string;
    description: string;
    division: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status: "TODO" | "IN_PROGRESS" | "SUBMITTED" | "COMPLETED";
    dueDate?: string | null;
    submissionNote?: string | null;
    submissionLink?: string | null;
    reviewNote?: string | null;
    completedAt?: string | null;
    assignedTo: {
        id: string;
        name: string;
        role: string;
        position?: string | null;
        kelas?: string | null;
    };
    creator: {
        name: string;
        position?: string | null;
    };
    createdAt: string;
}

interface UserOption {
    id: string;
    name: string;
    role: string;
    position?: string | null;
    division?: string | null;
}

export default function TasksPage() {
    const { data: session } = useSession();
    const [tasks, setTasks] = useState<MemberTask[]>([]);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Modal Create Task
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [division, setDivision] = useState("SEKBID_1");
    const [assignedToId, setAssignedToId] = useState("");
    const [priority, setPriority] = useState<string>("MEDIUM");
    const [dueDate, setDueDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal Update Task
    const [activeTask, setActiveTask] = useState<MemberTask | null>(null);
    const [taskStatus, setTaskStatus] = useState<string>("TODO");
    const [submissionNote, setSubmissionNote] = useState("");
    const [submissionLink, setSubmissionLink] = useState("");
    const [reviewNote, setReviewNote] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/tasks");
            if (res.ok) {
                const data = await res.json();
                setTasks(data.data || []);
            }
        } catch (error) {
            console.error("Gagal memuat tugas:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const result = await res.json();
                const list = Array.isArray(result) ? result : result.data || [];
                setUsers(list);
                if (list.length > 0) setAssignedToId(list[0].id);
            }
        } catch (error) {
            console.error("Gagal memuat users:", error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !assignedToId) return;

        try {
            setIsSubmitting(true);
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    division,
                    assignedToId,
                    priority,
                    dueDate: dueDate || undefined,
                }),
            });

            if (res.ok) {
                await fetchTasks();
                setIsCreateOpen(false);
                setTitle("");
                setDescription("");
                setDueDate("");
            }
        } catch (error) {
            console.error("Gagal membuat tugas:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeTask) return;

        try {
            setIsUpdating(true);
            const res = await fetch("/api/tasks", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: activeTask.id,
                    status: taskStatus,
                    submissionNote,
                    submissionLink,
                    reviewNote,
                }),
            });

            if (res.ok) {
                await fetchTasks();
                setActiveTask(null);
            }
        } catch (error) {
            console.error("Gagal memperbarui tugas:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredTasks = tasks.filter((t) => {
        if (statusFilter === "ALL") return true;
        return t.status === statusFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#202924] dark:text-white tracking-tight flex items-center gap-2.5">
                        <span className="w-10 h-10 rounded-xl bg-[#e8f2ec] dark:bg-[#1c2823] text-[#468366] flex items-center justify-center border border-[#d4e6db] dark:border-[#2a3c33] text-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </span>
                        <span>Penugasan Pengurus</span>
                    </h1>
                    <p className="text-sm text-[#5f7167] dark:text-slate-400 mt-1">
                        Delegasi tugas internal, pemantauan tenggat waktu, dan verifikasi laporan kerja anggota OSIS & MPK.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2 self-start"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Berikan Tugas Baru</span>
                </button>
            </div>

            {/* Filter Status Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: "ALL", label: "Semua Tugas" },
                    { id: "TODO", label: "Belum Dikerjakan" },
                    { id: "IN_PROGRESS", label: "Sedang Dikerjakan" },
                    { id: "SUBMITTED", label: "Menunggu Review" },
                    { id: "COMPLETED", label: "Selesai Diverifikasi" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                            statusFilter === tab.id
                                ? "bg-[#468366] text-white"
                                : "bg-white dark:bg-[#19241f] text-[#5f7167] dark:text-slate-300 hover:bg-[#f5f8f6] dark:hover:bg-[#202d27] border border-[#d4e6db] dark:border-[#2a3c33]"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tasks Grid */}
            {loading ? (
                <div className="py-12 text-center text-[#718579] text-xs">Memuat daftar tugas...</div>
            ) : filteredTasks.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-[#d4e6db] dark:border-[#2a3c33] rounded-2xl p-8 bg-white/50 dark:bg-[#19241f]/50">
                    <div className="w-12 h-12 rounded-full bg-[#e8f2ec] text-[#468366] flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                        📋
                    </div>
                    <div className="text-sm font-bold text-[#202924] dark:text-white">Belum ada tugas dalam kategori ini</div>
                    <p className="text-xs text-[#718579] mt-1 max-w-md mx-auto">
                        Gunakan tombol &ldquo;Berikan Tugas Baru&rdquo; untuk mendelegasikan tugas ke pengurus OSIS atau MPK.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="p-5 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] hover:border-[#c4ded0] transition-all flex flex-col justify-between shadow-sm"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2.5">
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                            task.priority === "URGENT"
                                                ? "bg-[#fdf2f2] text-[#9c3838] border-[#f5c7c7]"
                                                : task.priority === "HIGH"
                                                ? "bg-[#fdf3e7] text-[#8b6534] border-[#f0d5b5]"
                                                : "bg-[#eef3fb] text-[#3b6ea5] border-[#c6daf4]"
                                        }`}
                                    >
                                        PRIORITAS {task.priority}
                                    </span>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                            task.status === "COMPLETED"
                                                ? "bg-[#e8f2ec] text-[#2e5845] border-[#c4ded0]"
                                                : task.status === "SUBMITTED"
                                                ? "bg-[#f4effa] text-[#6b4c9a] border-[#e2d5f1]"
                                                : task.status === "IN_PROGRESS"
                                                ? "bg-[#fdf3e7] text-[#8b6534] border-[#f0d5b5]"
                                                : "bg-[#f5f8f6] text-[#5f7167] border-[#d4e6db]"
                                        }`}
                                    >
                                        {task.status}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-[#202924] dark:text-white leading-snug">{task.title}</h3>
                                <p className="text-xs text-[#5f7167] dark:text-slate-400 mt-1.5 line-clamp-2">{task.description}</p>

                                <div className="mt-4 pt-3 border-t border-[#edf3ef] dark:border-[#24342c] space-y-1 text-xs text-[#5f7167] dark:text-slate-400">
                                    <div>
                                        👤 <span className="text-[#718579]">Ditugaskan ke:</span>{" "}
                                        <span className="font-semibold text-[#202924] dark:text-white">{task.assignedTo?.name || "Anggota"}</span>
                                    </div>
                                    {task.dueDate && (
                                        <div>
                                            📅 <span className="text-[#718579]">Tenggat:</span>{" "}
                                            <span className="text-[#8b6534] dark:text-[#e4a86b] font-medium">
                                                {new Date(task.dueDate).toLocaleDateString("id-ID")}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {task.submissionLink && (
                                    <div className="mt-3 p-2.5 rounded-xl bg-[#f4effa] dark:bg-[#20182c] border border-[#e2d5f1] dark:border-[#382650] text-[11px]">
                                        <div className="font-bold text-[#6b4c9a] dark:text-[#c4a8ee] text-[10px] uppercase">Bukti Tugas:</div>
                                        <a
                                            href={task.submissionLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#468366] dark:text-[#7cc49e] underline truncate block mt-0.5"
                                        >
                                            {task.submissionLink}
                                        </a>
                                        {task.submissionNote && <div className="text-[#5f7167] dark:text-slate-300 mt-1 italic">{task.submissionNote}</div>}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#edf3ef] dark:border-[#24342c] flex items-center justify-between">
                                <span className="text-[10px] text-[#718579]">Oleh: {task.creator?.name || "Admin"}</span>
                                <button
                                    onClick={() => {
                                        setActiveTask(task);
                                        setTaskStatus(task.status);
                                        setSubmissionNote(task.submissionNote || "");
                                        setSubmissionLink(task.submissionLink || "");
                                        setReviewNote(task.reviewNote || "");
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#f5f8f6] dark:bg-[#141d18] hover:bg-[#edf3ef] text-xs font-semibold text-[#202924] dark:text-slate-200 border border-[#d4e6db] dark:border-[#2a3c33] transition-colors shadow-sm"
                                >
                                    Kelola Tugas
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Create Task */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-[#e3ece6] dark:border-[#24342c]">
                            <h2 className="text-lg font-bold text-[#202924] dark:text-white flex items-center gap-2">
                                <span>📌</span> Berikan Tugas Baru
                            </h2>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="text-[#718579] hover:text-[#202924] dark:hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Judul Tugas *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Buat Rancangan Desain Banner Porseni 2026"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-white placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Pilih Anggota *</label>
                                    <select
                                        value={assignedToId}
                                        onChange={(e) => setAssignedToId(e.target.value)}
                                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3 py-2.5 text-xs text-[#202924] dark:text-white focus:outline-none focus:border-[#468366]"
                                    >
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Tingkat Prioritas *</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3 py-2.5 text-xs text-[#202924] dark:text-white focus:outline-none focus:border-[#468366]"
                                    >
                                        <option value="LOW">Rendah (Low)</option>
                                        <option value="MEDIUM">Sedang (Medium)</option>
                                        <option value="HIGH">Tinggi (High)</option>
                                        <option value="URGENT">Mendesak (Urgent)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Divisi Terkait *</label>
                                    <select
                                        value={division}
                                        onChange={(e) => setDivision(e.target.value)}
                                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3 py-2.5 text-xs text-[#202924] dark:text-white focus:outline-none focus:border-[#468366]"
                                    >
                                        <option value="BPH_OSIS">BPH OSIS</option>
                                        <option value="BPH_MPK">BPH MPK</option>
                                        <option value="SEKBID_1">Sekbid 1 (Agama)</option>
                                        <option value="SEKBID_2">Sekbid 2 (Budi Pekerti)</option>
                                        <option value="SEKBID_3">Sekbid 3 (Kebangsaan)</option>
                                        <option value="SEKBID_4">Sekbid 4 (Kepribadian)</option>
                                        <option value="SEKBID_5">Sekbid 5 (Demokrasi)</option>
                                        <option value="SEKBID_6">Sekbid 6 (Jasmani)</option>
                                        <option value="SEKBID_7">Sekbid 7 (Seni)</option>
                                        <option value="SEKBID_8">Sekbid 8 (Lingkungan)</option>
                                        <option value="SEKBID_9">Sekbid 9 (IT & Sosmed)</option>
                                        <option value="SEKBID_10">Sekbid 10 (Kewirausahaan)</option>
                                        <option value="KOMISI_A">Komisi A (Hukum)</option>
                                        <option value="KOMISI_B">Komisi B (Aspirasi)</option>
                                        <option value="KOMISI_C">Komisi C (Keuangan)</option>
                                        <option value="KOMISI_D">Komisi D (Pengawasan)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Tenggat Waktu</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-white focus:outline-none focus:border-[#468366]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Instruksi & Rincian Tugas *</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Jelaskan deliverable dan ekspektasi hasil tugas..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl p-3 text-xs text-[#202924] dark:text-white placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3ece6] dark:border-[#24342c]">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718579] hover:text-[#202924]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold transition-all shadow-sm"
                                >
                                    {isSubmitting ? "Mendelegasikan..." : "Kirim Tugas ke Anggota"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Update / Review Task */}
            {activeTask && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-[#e3ece6] dark:border-[#24342c]">
                            <div>
                                <h2 className="text-lg font-bold text-[#202924] dark:text-white">Kelola & Review Tugas</h2>
                                <div className="text-xs text-[#468366] dark:text-[#7cc49e] font-semibold mt-0.5">{activeTask.title}</div>
                            </div>
                            <button
                                onClick={() => setActiveTask(null)}
                                className="text-[#718579] hover:text-[#202924] dark:hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Status Pengerjaan</label>
                                <select
                                    value={taskStatus}
                                    onChange={(e) => setTaskStatus(e.target.value)}
                                    className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3 py-2.5 text-xs text-[#202924] dark:text-white focus:outline-none focus:border-[#468366]"
                                >
                                    <option value="TODO">TODO (Belum Dikerjakan)</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS (Sedang Dikerjakan)</option>
                                    <option value="SUBMITTED">SUBMITTED (Laporan Diserahkan)</option>
                                    <option value="COMPLETED">COMPLETED (Selesai & Diverifikasi)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Link Bukti Tugas / Hasil Kerja</label>
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/... atau Figma link"
                                    value={submissionLink}
                                    onChange={(e) => setSubmissionLink(e.target.value)}
                                    className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-white placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Catatan Penyerahan</label>
                                <textarea
                                    rows={2}
                                    placeholder="Keterangan anggota saat menyerahkan tugas..."
                                    value={submissionNote}
                                    onChange={(e) => setSubmissionNote(e.target.value)}
                                    className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl p-3 text-xs text-[#202924] dark:text-white placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Catatan Evaluasi / Feedback Penilai</label>
                                <textarea
                                    rows={2}
                                    placeholder="Catatan dari koordinator atau ketua untuk revisi/apresiasi..."
                                    value={reviewNote}
                                    onChange={(e) => setReviewNote(e.target.value)}
                                    className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl p-3 text-xs text-[#202924] dark:text-white placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3ece6] dark:border-[#24342c]">
                                <button
                                    type="button"
                                    onClick={() => setActiveTask(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718579] hover:text-[#202924]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-5 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold transition-all shadow-sm"
                                >
                                    {isUpdating ? "Memperbarui..." : "Simpan Status Tugas"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
