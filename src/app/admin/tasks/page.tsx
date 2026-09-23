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
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                        <span>📌</span> Manajemen Tugas Pengurus
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Delegasi tugas internal, tracking tenggat waktu, dan verifikasi submission kerja anggota OSIS & MPK.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 self-start"
                >
                    <span>+</span>
                    <span>Berikan Tugas Baru</span>
                </button>
            </div>

            {/* Filter Status Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: "ALL", label: "Semua Tugas" },
                    { id: "TODO", label: "Belum Dikerjakan (Todo)" },
                    { id: "IN_PROGRESS", label: "Sedang Dikerjakan" },
                    { id: "SUBMITTED", label: "Diserahkan (Review)" },
                    { id: "COMPLETED", label: "Selesai Diverifikasi" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            statusFilter === tab.id
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tasks Grid */}
            {loading ? (
                <div className="py-12 text-center text-slate-500 text-xs">Memuat daftar tugas...</div>
            ) : filteredTasks.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-800 rounded-3xl p-8">
                    <div className="text-3xl mb-2">📌</div>
                    <div className="text-sm font-bold text-slate-200">Belum ada tugas dalam kategori ini</div>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        Gunakan tombol &ldquo;Berikan Tugas Baru&rdquo; untuk mendelegasikan tugas ke anggota atau pengurus.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                            task.priority === "URGENT"
                                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                                : task.priority === "HIGH"
                                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                                : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                        }`}
                                    >
                                        PRIORITAS {task.priority}
                                    </span>
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                            task.status === "COMPLETED"
                                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                                : task.status === "SUBMITTED"
                                                ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                                                : task.status === "IN_PROGRESS"
                                                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                                : "bg-slate-800 text-slate-400 border-slate-700"
                                        }`}
                                    >
                                        {task.status}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-white leading-snug">{task.title}</h3>
                                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{task.description}</p>

                                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                                    <div>
                                        👤 <span className="text-slate-500">Ditugaskan ke:</span>{" "}
                                        <span className="font-semibold text-white">{task.assignedTo?.name || "Anggota"}</span>
                                    </div>
                                    {task.dueDate && (
                                        <div>
                                            📅 <span className="text-slate-500">Tenggat:</span>{" "}
                                            <span className="text-amber-300 font-medium">
                                                {new Date(task.dueDate).toLocaleDateString("id-ID")}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {task.submissionLink && (
                                    <div className="mt-3 p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30 text-[11px]">
                                        <div className="font-bold text-purple-300 text-[10px] uppercase">Bukti Tugas:</div>
                                        <a
                                            href={task.submissionLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-400 underline truncate block mt-0.5"
                                        >
                                            {task.submissionLink}
                                        </a>
                                        {task.submissionNote && <div className="text-slate-300 mt-1 italic">{task.submissionNote}</div>}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500">Oleh: {task.creator?.name || "Admin"}</span>
                                <button
                                    onClick={() => {
                                        setActiveTask(task);
                                        setTaskStatus(task.status);
                                        setSubmissionNote(task.submissionNote || "");
                                        setSubmissionLink(task.submissionLink || "");
                                        setReviewNote(task.reviewNote || "");
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
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
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span>📌</span> Berikan Tugas Baru ke Anggota
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
                                <label className="block text-xs font-bold text-slate-300 mb-1">Judul Tugas *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Buat Rancangan Desain Banner Porseni 2026"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Pilih Anggota *</label>
                                    <select
                                        value={assignedToId}
                                        onChange={(e) => setAssignedToId(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Tingkat Prioritas *</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Divisi Terkait *</label>
                                    <select
                                        value={division}
                                        onChange={(e) => setDivision(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Tenggat Waktu (Due Date)</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Instruksi & Rincian Tugas *</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Jelaskan deliverable dan ekspektasi hasil tugas..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
                                    {isSubmitting ? "Mendelegasikan..." : "Kirim Tugas ke Anggota"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Update / Review Task */}
            {activeTask && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-white">Kelola & Review Tugas</h2>
                                <div className="text-xs text-emerald-400 font-semibold mt-0.5">{activeTask.title}</div>
                            </div>
                            <button
                                onClick={() => setActiveTask(null)}
                                className="text-slate-400 hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Status Pengerjaan</label>
                                <select
                                    value={taskStatus}
                                    onChange={(e) => setTaskStatus(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="TODO">TODO (Belum Dikerjakan)</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS (Sedang Dikerjakan)</option>
                                    <option value="SUBMITTED">SUBMITTED (Laporan Diserahkan)</option>
                                    <option value="COMPLETED">COMPLETED (Selesai & Diverifikasi)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Link Bukti Tugas / Hasil Kerja (Submission Link)</label>
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/... atau Figma link"
                                    value={submissionLink}
                                    onChange={(e) => setSubmissionLink(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Catatan Penyerahan (Submission Note)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Keterangan anggota saat menyerahkan tugas..."
                                    value={submissionNote}
                                    onChange={(e) => setSubmissionNote(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Catatan Evaluasi / Feedback Penilai</label>
                                <textarea
                                    rows={2}
                                    placeholder="Catatan dari koordinator atau ketua untuk revisi/apresiasi..."
                                    value={reviewNote}
                                    onChange={(e) => setReviewNote(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setActiveTask(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
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
