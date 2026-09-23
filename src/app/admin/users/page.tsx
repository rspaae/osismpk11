"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface UserItem {
    id: string;
    name: string;
    nis?: string | null;
    nisn?: string | null;
    email?: string | null;
    role: string;
    division?: string | null;
    position?: string | null;
    kelas?: string | null;
    major?: string | null;
    rfidCard?: string | null;
    isActive: boolean;
    createdAt: string;
}

interface MetaInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    totalStudents: number;
    totalOfficers: number;
    uniqueClasses: string[];
}

const ROLES = [
    { code: "ALL", label: "Semua Role" },
    { code: "STUDENT", label: "🎓 Siswa SMKN 11" },
    { code: "BPH_OSIS", label: "⭐ BPH OSIS (Ketua/Wakil/Sekre)" },
    { code: "BPH_MPK", label: "⭐ BPH MPK (Ketua/Wakil/Sekre)" },
    { code: "SEKBID_OFFICER", label: "🎖️ Pengurus Sekbid OSIS" },
    { code: "KOMISI_OFFICER", label: "🎖️ Pengurus Komisi MPK" },
    { code: "PEMBINA", label: "👔 Pembina OSIS-MPK" },
    { code: "KESISWAAN", label: "🏛️ Wakasek Kesiswaan" },
    { code: "KEPALA_SEKOLAH", label: "👑 Kepala Sekolah" },
    { code: "ADMINISTRATOR", label: "💻 Administrator IT" },
];

export default function UserManagementPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState<MetaInfo>({
        total: 0,
        page: 1,
        limit: 25,
        totalPages: 1,
        totalStudents: 0,
        totalOfficers: 0,
        uniqueClasses: [],
    });

    // Query & Filter States
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [kelasFilter, setKelasFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState("25");

    // Selection State untuk Bulk Actions
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Modals State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isBulkActionModalOpen, setIsBulkActionModalOpen] = useState(false);
    const [bulkActionType, setBulkActionType] = useState<"RESET_PASSWORD" | "UPDATE_CLASS" | "UPDATE_MAJOR" | "DEACTIVATE" | "ACTIVATE" | "DELETE">("RESET_PASSWORD");
    const [bulkParamValue, setBulkParamValue] = useState("");
    const [isBulkExecuting, setIsBulkExecuting] = useState(false);
    const [bulkResultMsg, setBulkResultMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Single Create Form State
    const [name, setName] = useState("");
    const [nis, setNis] = useState("");
    const [nisn, setNisn] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("password123");
    const [role, setRole] = useState("STUDENT");
    const [division, setDivision] = useState("GENERAL");
    const [position, setPosition] = useState("");
    const [kelas, setKelas] = useState("");
    const [major, setMajor] = useState("");
    const [rfidCard, setRfidCard] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Pairing RFID Modal State
    const [pairingUser, setPairingUser] = useState<UserItem | null>(null);
    const [pairingUid, setPairingUid] = useState("");
    const [isPairingSubmitting, setIsPairingSubmitting] = useState(false);
    const [pairingMsg, setPairingMsg] = useState({ type: "", text: "" });

    // CSV Bulk Import State
    const [importFile, setImportFile] = useState<File | null>(null);
    const [parsedRows, setParsedRows] = useState<any[]>([]);
    const [importProgress, setImportProgress] = useState<{ current: number; total: number; percent: number } | null>(null);
    const [importSummary, setImportSummary] = useState<{
        totalProcessed: number;
        createdCount: number;
        updatedCount: number;
        skippedCount: number;
        errors: { row: number; identifier: string; error: string }[];
    } | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Search Debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset ke hal 1 saat query berubah
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset pagination jika filter berubah
    useEffect(() => {
        setPage(1);
    }, [roleFilter, kelasFilter, limit]);

    // Fetch data setiap kali query/filter/pagination berubah
    useEffect(() => {
        fetchUsers();
    }, [page, limit, roleFilter, kelasFilter, debouncedSearch]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.set("page", page.toString());
            params.set("limit", limit);
            if (roleFilter !== "ALL") params.set("role", roleFilter);
            if (kelasFilter !== "ALL") params.set("kelas", kelasFilter);
            if (debouncedSearch) params.set("q", debouncedSearch);

            const res = await fetch(`/api/admin/users?${params.toString()}`);
            if (res.ok) {
                const result = await res.json();
                const userList = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
                setUsers(userList);

                const m = result.meta || result.pagination || {};
                setMeta({
                    total: typeof m.total === "number" ? m.total : userList.length,
                    page: typeof m.page === "number" ? m.page : page,
                    limit: typeof m.limit === "number" ? m.limit : parseInt(limit) || 25,
                    totalPages: typeof m.totalPages === "number" ? m.totalPages : 1,
                    totalStudents: typeof m.totalStudents === "number" ? m.totalStudents : userList.filter((u: any) => u.role === "STUDENT").length,
                    totalOfficers: typeof m.totalOfficers === "number" ? m.totalOfficers : userList.filter((u: any) => u.role !== "STUDENT").length,
                    uniqueClasses: Array.isArray(m.uniqueClasses) ? m.uniqueClasses : (Array.isArray(result.classes) ? result.classes : []),
                });
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Gagal memuat data pengguna:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Multi-Select Handlers
    const handleSelectAllCurrentPage = (checked: boolean) => {
        const next = new Set(selectedIds);
        if (checked) {
            users.forEach((u) => next.add(u.id));
        } else {
            users.forEach((u) => next.delete(u.id));
        }
        setSelectedIds(next);
    };

    const handleToggleSelect = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedIds(next);
    };

    const isAllCurrentPageSelected = users.length > 0 && users.every((u) => selectedIds.has(u.id));

    // Eksekusi Bulk Action
    const handleExecuteBulkAction = async () => {
        if (selectedIds.size === 0) return;
        setIsBulkExecuting(true);
        setBulkResultMsg(null);

        try {
            const payload: any = {
                action: bulkActionType,
                userIds: Array.from(selectedIds),
            };

            if (bulkActionType === "RESET_PASSWORD") {
                payload.newPassword = bulkParamValue || "password123";
            } else if (bulkActionType === "UPDATE_CLASS") {
                payload.targetKelas = bulkParamValue;
            } else if (bulkActionType === "UPDATE_MAJOR") {
                payload.targetMajor = bulkParamValue;
            }

            const res = await fetch("/api/admin/users/bulk-action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                setBulkResultMsg({ type: "success", text: data.message });
                setSelectedIds(new Set());
                await fetchUsers();
                setTimeout(() => {
                    setIsBulkActionModalOpen(false);
                    setBulkParamValue("");
                    setBulkResultMsg(null);
                }, 1500);
            } else {
                setBulkResultMsg({ type: "error", text: data.error || "Gagal menjalankan aksi massal" });
            }
        } catch (err: any) {
            setBulkResultMsg({ type: "error", text: "Terjadi kesalahan jaringan atau server" });
        } finally {
            setIsBulkExecuting(false);
        }
    };

    // Single Create User Handler
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            setIsSubmitting(true);
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    nis: nis || undefined,
                    nisn: nisn || undefined,
                    email,
                    password,
                    role,
                    division,
                    position,
                    kelas,
                    major,
                    rfidCard: rfidCard || undefined,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                await fetchUsers();
                setIsCreateOpen(false);
                setName("");
                setNis("");
                setNisn("");
                setEmail("");
                setPassword("password123");
                setPosition("");
                setKelas("");
                setMajor("");
                setRfidCard("");
            } else {
                setErrorMsg(data.error || "Gagal membuat pengguna");
            }
        } catch (error) {
            setErrorMsg("Terjadi kesalahan sistem saat menambahkan pengguna");
        } finally {
            setIsSubmitting(false);
        }
    };

    // RFID Pairing Handler
    const handlePairRfid = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pairingUser) return;
        setPairingMsg({ type: "", text: "" });

        try {
            setIsPairingSubmitting(true);
            const res = await fetch("/api/admin/users/rfid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: pairingUser.id,
                    rfidCard: pairingUid || null,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setPairingMsg({ type: "success", text: data.message });
                await fetchUsers();
                setTimeout(() => {
                    setPairingUser(null);
                    setPairingUid("");
                    setPairingMsg({ type: "", text: "" });
                }, 1000);
            } else {
                setPairingMsg({ type: "error", text: data.error || "Gagal menautkan kartu" });
            }
        } catch (err) {
            setPairingMsg({ type: "error", text: "Terjadi kesalahan sistem saat pairing kartu" });
        } finally {
            setIsPairingSubmitting(false);
        }
    };

    // CSV Parse & Bulk Import Chunking
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportFile(file);
        setImportSummary(null);
        setImportProgress(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) return;

            // Simple Robust CSV Parsing (detect delimiter comma or semicolon)
            const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
            if (lines.length <= 1) {
                alert("File CSV kosong atau hanya memiliki header!");
                return;
            }

            const headerLine = lines[0];
            const delimiter = headerLine.includes(";") && !headerLine.includes(",") ? ";" : ",";

            const rawHeaders = headerLine.split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, "").toLowerCase());

            // Map header indexes
            const idxName = rawHeaders.findIndex((h) => h.includes("nama"));
            const idxNis = rawHeaders.findIndex((h) => h.includes("nis") && !h.includes("nisn"));
            const idxNisn = rawHeaders.findIndex((h) => h.includes("nisn"));
            const idxKelas = rawHeaders.findIndex((h) => h.includes("kelas"));
            const idxMajor = rawHeaders.findIndex((h) => h.includes("jurusan") || h.includes("major"));
            const idxEmail = rawHeaders.findIndex((h) => h.includes("email"));
            const idxPass = rawHeaders.findIndex((h) => h.includes("pass"));
            const idxRfid = rawHeaders.findIndex((h) => h.includes("rfid") || h.includes("kartu"));
            const idxRole = rawHeaders.findIndex((h) => h.includes("role") || h.includes("peran"));

            const parsed: any[] = [];
            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""));
                if (row.length === 0 || !row[idxName >= 0 ? idxName : 0]) continue;

                parsed.push({
                    name: idxName >= 0 ? row[idxName] : row[0],
                    nis: idxNis >= 0 ? row[idxNis] : row[1],
                    nisn: idxNisn >= 0 ? row[idxNisn] : undefined,
                    kelas: idxKelas >= 0 ? row[idxKelas] : undefined,
                    major: idxMajor >= 0 ? row[idxMajor] : undefined,
                    email: idxEmail >= 0 ? row[idxEmail] : undefined,
                    password: idxPass >= 0 ? row[idxPass] : undefined,
                    rfidCard: idxRfid >= 0 ? row[idxRfid] : undefined,
                    role: idxRole >= 0 ? row[idxRole] : "STUDENT",
                });
            }

            setParsedRows(parsed);
        };
        reader.readAsText(file, "UTF-8");
    };

    const handleStartBulkImport = async () => {
        if (parsedRows.length === 0) return;
        setIsImporting(true);
        setImportSummary(null);

        const CHUNK_SIZE = 100;
        const totalItems = parsedRows.length;
        let processedCount = 0;
        let createdTotal = 0;
        let updatedTotal = 0;
        let skippedTotal = 0;
        const allErrors: any[] = [];

        try {
            for (let i = 0; i < totalItems; i += CHUNK_SIZE) {
                const chunk = parsedRows.slice(i, i + CHUNK_SIZE);
                setImportProgress({
                    current: Math.min(i + CHUNK_SIZE, totalItems),
                    total: totalItems,
                    percent: Math.round((Math.min(i + CHUNK_SIZE, totalItems) / totalItems) * 100),
                });

                const res = await fetch("/api/admin/users/bulk-import", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        users: chunk,
                        defaultPassword: "password123",
                        updateIfExists: true,
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    createdTotal += data.createdCount || 0;
                    updatedTotal += data.updatedCount || 0;
                    skippedTotal += data.skippedCount || 0;
                    if (data.errors && data.errors.length > 0) {
                        allErrors.push(...data.errors);
                    }
                } else {
                    const errData = await res.json();
                    allErrors.push({
                        row: i + 1,
                        identifier: `Batch ${i / CHUNK_SIZE + 1}`,
                        error: errData.error || "Gagal memproses batch",
                    });
                }
            }

            setImportSummary({
                totalProcessed: totalItems,
                createdCount: createdTotal,
                updatedCount: updatedTotal,
                skippedCount: skippedTotal,
                errors: allErrors,
            });

            await fetchUsers();
        } catch (err: any) {
            alert("Terjadi kegagalan saat import massal: " + err.message);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header & Main Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="p-2 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-2xl">
                            👥
                        </span>
                        <span>Manajemen Pengguna & Data Siswa</span>
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Sistem pengelolaan skala besar untuk 1.700+ siswa SMKN 11, pengurus OSIS-MPK, pembina, serta pairing kartu RFID.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Export Data Pengguna */}
                    <a
                        href={`/api/admin/users/export?kelas=${kelasFilter}&role=${roleFilter}&q=${encodeURIComponent(debouncedSearch)}`}
                        download={`data_pengguna_smkn11_${new Date().toISOString().slice(0, 10)}.csv`}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                        title="Export data pengguna sesuai filter pencarian yang sedang aktif"
                    >
                        <span>📤</span>
                        <span>Export Data (CSV)</span>
                    </a>

                    {/* Download Template CSV */}
                    <a
                        href="/api/admin/users/template"
                        download="template_import_siswa_smkn11.csv"
                        className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                        title="Download Template Format CSV untuk import 1.700+ data siswa"
                    >
                        <span>📄</span>
                        <span>Download Template</span>
                    </a>

                    {/* Import Massal CSV */}
                    <button
                        onClick={() => {
                            setImportFile(null);
                            setParsedRows([]);
                            setImportSummary(null);
                            setImportProgress(null);
                            setIsImportOpen(true);
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                        <span>📥</span>
                        <span>Import Siswa (CSV)</span>
                    </button>

                    {/* Tambah Pengguna Manual */}
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                    >
                        <span>+</span>
                        <span>Tambah Manual</span>
                    </button>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-bold">
                        👥
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Akun</div>
                        <div className="text-xl md:text-2xl font-black text-white">{meta.total}</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
                        🎓
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Siswa Terdaftar</div>
                        <div className="text-xl md:text-2xl font-black text-emerald-400">{meta.totalStudents}</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold">
                        ⭐
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pengurus / Guru</div>
                        <div className="text-xl md:text-2xl font-black text-amber-400">{meta.totalOfficers}</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xl font-bold">
                        🏫
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kelas Aktif</div>
                        <div className="text-xl md:text-2xl font-black text-purple-400">{meta.uniqueClasses?.length || 0}</div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Box */}
                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                        🔍 Cari Akun / NIS / UID RFID
                    </label>
                    <input
                        type="text"
                        placeholder="Ketik Nama, NIS, NISN, RFID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>

                {/* Filter Role */}
                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Filter Peran (Role)</label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                        {ROLES.map((r) => (
                            <option key={r.code} value={r.code}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filter Kelas */}
                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Filter Kelas</label>
                    <select
                        value={kelasFilter}
                        onChange={(e) => setKelasFilter(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="ALL">Semua Kelas ({meta.uniqueClasses?.length || 0})</option>
                        {meta.uniqueClasses?.map((k) => (
                            <option key={k} value={k}>
                                {k}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tampilan Per Halaman */}
                <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Tampilkan per Halaman</label>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="25">25 Baris</option>
                        <option value="50">50 Baris</option>
                        <option value="100">100 Baris</option>
                        <option value="250">250 Baris</option>
                        <option value="500">500 Baris</option>
                    </select>
                </div>
            </div>

            {/* Selection Summary Notice */}
            {selectedIds.size > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>
                            Terpilih <strong>{selectedIds.size}</strong> akun pengguna dari berbagai halaman.
                        </span>
                    </div>
                    <button
                        onClick={() => setSelectedIds(new Set())}
                        className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-[11px] font-bold text-emerald-200 transition-colors"
                    >
                        Batalkan Pilihan
                    </button>
                </div>
            )}

            {/* Users Data Table */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-800/90 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800 select-none">
                            <tr>
                                <th className="px-4 py-3.5 w-10 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllCurrentPageSelected}
                                        onChange={(e) => handleSelectAllCurrentPage(e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                        title="Pilih semua baris di halaman ini"
                                    />
                                </th>
                                <th className="px-4 py-3.5">Nama Siswa / Pengguna</th>
                                <th className="px-4 py-3.5">NIS / NISN / Kelas</th>
                                <th className="px-4 py-3.5">Role & Jabatan</th>
                                <th className="px-4 py-3.5">Kartu RFID (UID)</th>
                                <th className="px-4 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-slate-500">
                                        <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                        <div>Memuat data pengguna dari database...</div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-slate-500">
                                        <div className="text-3xl mb-2">🔍</div>
                                        <div className="font-semibold text-slate-400">Tidak ada data pengguna yang ditemukan.</div>
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            Coba sesuaikan kata kunci pencarian atau reset filter kelas / role.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const isSelected = selectedIds.has(u.id);
                                    return (
                                        <tr
                                            key={u.id}
                                            className={`transition-colors ${
                                                isSelected ? "bg-emerald-950/20 hover:bg-emerald-950/30" : "hover:bg-slate-800/40"
                                            }`}
                                        >
                                            <td className="px-4 py-3.5 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleToggleSelect(u.id)}
                                                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-bold text-white text-sm">{u.name || "Tanpa Nama"}</div>
                                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email || "-"}</div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-mono text-emerald-400 font-semibold">{u.nis || "-"}</div>
                                                <div className="text-slate-300 font-medium text-[11px] mt-0.5">
                                                    {u.kelas || <span className="text-slate-500 italic">Tanpa Kelas</span>}
                                                    {u.major ? ` (${u.major})` : ""}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-200">
                                                    {u.role.replace(/_/g, " ")}
                                                </span>
                                                {u.position && (
                                                    <div className="text-[11px] text-amber-300/90 font-medium mt-1">
                                                        ⭐ {u.position}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {u.rfidCard ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold">
                                                        💳 {u.rfidCard}
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-500 italic">Belum ditautkan</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    onClick={() => {
                                                        setPairingUser(u);
                                                        setPairingUid(u.rfidCard || "");
                                                        setPairingMsg({ type: "", text: "" });
                                                    }}
                                                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
                                                >
                                                    💳 {u.rfidCard ? "Ganti Kartu" : "Pairing RFID"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls Footer */}
                <div className="p-4 bg-slate-800/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                    <div>
                        Menampilkan baris <strong>{users.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0}</strong> s/d{" "}
                        <strong>{Math.min(meta.page * meta.limit, meta.total)}</strong> dari total <strong>{meta.total}</strong> akun
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setPage(1)}
                            disabled={meta.page <= 1 || loading}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-all"
                            title="Halaman Pertama"
                        >
                            «
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={meta.page <= 1 || loading}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all"
                        >
                            ‹ Sebelumnya
                        </button>

                        <span className="px-3 py-1.5 font-bold text-white bg-slate-900 rounded-lg border border-slate-700">
                            Hal {meta.page} / {meta.totalPages || 1}
                        </span>

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                            disabled={meta.page >= meta.totalPages || loading}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-all"
                        >
                            Berikutnya ›
                        </button>
                        <button
                            onClick={() => setPage(meta.totalPages)}
                            disabled={meta.page >= meta.totalPages || loading}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-all"
                            title="Halaman Terakhir"
                        >
                            »
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Bulk Actions Bar (Muncul saat ada item terpilih) */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 inset-x-4 max-w-4xl mx-auto z-40 bg-slate-900/95 backdrop-blur-md border-2 border-emerald-500/40 rounded-3xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
                    <div className="flex items-center gap-2.5 text-xs text-white">
                        <span className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md">
                            {selectedIds.size}
                        </span>
                        <div>
                            <div className="font-bold">Akun Terpilih</div>
                            <div className="text-[11px] text-slate-400">Pilih tindakan massal yang ingin diterapkan:</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Reset Password Massal */}
                        <button
                            onClick={() => {
                                setBulkActionType("RESET_PASSWORD");
                                setBulkParamValue("password123");
                                setIsBulkActionModalOpen(true);
                            }}
                            className="px-3 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                            <span>🔑</span>
                            <span>Reset Password</span>
                        </button>

                        {/* Pindah Kelas Massal */}
                        <button
                            onClick={() => {
                                setBulkActionType("UPDATE_CLASS");
                                setBulkParamValue("");
                                setIsBulkActionModalOpen(true);
                            }}
                            className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                            <span>🏫</span>
                            <span>Pindah Kelas</span>
                        </button>

                        {/* Nonaktifkan Massal */}
                        <button
                            onClick={() => {
                                setBulkActionType("DEACTIVATE");
                                setIsBulkActionModalOpen(true);
                            }}
                            className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                            <span>🔒</span>
                            <span>Nonaktifkan</span>
                        </button>

                        {/* Batal */}
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Bulk Actions Confirmation */}
            {isBulkActionModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <span>⚡</span> Konfirmasi Aksi Massal ({selectedIds.size} Pengguna)
                            </h2>
                            <button
                                onClick={() => setIsBulkActionModalOpen(false)}
                                className="text-slate-400 hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        {bulkResultMsg && (
                            <div
                                className={`p-3 rounded-xl text-xs font-semibold ${
                                    bulkResultMsg.type === "success"
                                        ? "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
                                        : "bg-rose-950/60 border border-rose-800 text-rose-300"
                                }`}
                            >
                                {bulkResultMsg.text}
                            </div>
                        )}

                        <div className="space-y-3 text-xs text-slate-300">
                            {bulkActionType === "RESET_PASSWORD" && (
                                <>
                                    <p>
                                        Semua <strong>{selectedIds.size} akun</strong> yang dipilih akan direset kata sandinya.
                                    </p>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Password Baru</label>
                                        <input
                                            type="text"
                                            value={bulkParamValue}
                                            onChange={(e) => setBulkParamValue(e.target.value)}
                                            placeholder="password123"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </>
                            )}

                            {bulkActionType === "UPDATE_CLASS" && (
                                <>
                                    <p>
                                        Pindahkan <strong>{selectedIds.size} siswa</strong> ke kelas baru secara serentak (contoh saat kenaikan kelas).
                                    </p>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Target Nama Kelas Baru *</label>
                                        <input
                                            type="text"
                                            value={bulkParamValue}
                                            onChange={(e) => setBulkParamValue(e.target.value)}
                                            placeholder="Contoh: XI PPLG 1 atau XII TKJ 2"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </>
                            )}

                            {bulkActionType === "DEACTIVATE" && (
                                <p className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300">
                                    ⚠️ Akun-akun yang dinonaktifkan tidak akan dapat login ke sistem OSIM11 sampai diaktifkan kembali.
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsBulkActionModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleExecuteBulkAction}
                                disabled={isBulkExecuting}
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
                            >
                                {isBulkExecuting ? "Memproses..." : "Terapkan Sekarang"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Import Siswa Massal (CSV) */}
            {isImportOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span>📥</span> Import Data Siswa Massal (CSV)
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Unggah berkas CSV untuk mendaftarkan atau memperbarui hingga 1.700+ akun siswa sekaligus.
                                </p>
                            </div>
                            <button onClick={() => setIsImportOpen(false)} className="text-slate-400 hover:text-white text-sm">
                                ✕
                            </button>
                        </div>

                        {/* File Upload Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="p-8 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl bg-slate-800/40 hover:bg-slate-800/60 transition-all cursor-pointer text-center space-y-3"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,text/csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="text-4xl">📄</div>
                            <div>
                                <div className="text-sm font-bold text-white">
                                    {importFile ? importFile.name : "Klik atau Seret Berkas CSV ke Sini"}
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                    {importFile
                                        ? `${parsedRows.length} baris data siswa siap diproses`
                                        : "Mendukung delimiter koma (,) atau titik-koma (;). Header otomatis dideteksi."}
                                </div>
                            </div>
                        </div>

                        {/* Preview 5 Baris Pertama */}
                        {parsedRows.length > 0 && !importSummary && (
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                                    <span>Pratinjau Data ({parsedRows.length} Siswa Ditemukan):</span>
                                    <span className="text-[11px] text-emerald-400 font-mono">5 baris pertama</span>
                                </div>
                                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                                    <table className="w-full text-left text-[11px] text-slate-300">
                                        <thead className="bg-slate-800/80 text-slate-400 font-bold border-b border-slate-800">
                                            <tr>
                                                <th className="px-3 py-2">Nama</th>
                                                <th className="px-3 py-2">NIS</th>
                                                <th className="px-3 py-2">Kelas</th>
                                                <th className="px-3 py-2">Jurusan</th>
                                                <th className="px-3 py-2">RFID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {parsedRows.slice(0, 5).map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-3 py-1.5 font-medium text-white">{row.name}</td>
                                                    <td className="px-3 py-1.5 font-mono text-emerald-400">{row.nis || "-"}</td>
                                                    <td className="px-3 py-1.5">{row.kelas || "-"}</td>
                                                    <td className="px-3 py-1.5">{row.major || "-"}</td>
                                                    <td className="px-3 py-1.5 font-mono text-slate-400">{row.rfidCard || "-"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Progress Bar */}
                        {importProgress && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-300">Memproses Data Siswa ke Database...</span>
                                    <span className="text-emerald-400 font-mono">
                                        {importProgress.current} / {importProgress.total} ({importProgress.percent}%)
                                    </span>
                                </div>
                                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                                        style={{ width: `${importProgress.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Import Result Summary */}
                        {importSummary && (
                            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                                <div className="text-xs font-bold text-white flex items-center gap-2">
                                    <span>🎉</span> Proses Import Selesai!
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                                        <div className="font-bold text-base">{importSummary.createdCount}</div>
                                        <div className="text-[10px] text-emerald-400">Akun Baru Dibuat</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-300">
                                        <div className="font-bold text-base">{importSummary.updatedCount}</div>
                                        <div className="text-[10px] text-blue-400">Akun Diperbarui</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300">
                                        <div className="font-bold text-base">{importSummary.errors.length}</div>
                                        <div className="text-[10px] text-rose-400">Gagal / Error</div>
                                    </div>
                                </div>

                                {importSummary.errors.length > 0 && (
                                    <div className="max-h-32 overflow-y-auto space-y-1 text-[11px] text-rose-300 font-mono p-2 rounded-xl bg-slate-950 border border-rose-900/50">
                                        {importSummary.errors.map((err, idx) => (
                                            <div key={idx}>
                                                Baris {err.row} ({err.identifier}): {err.error}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions Footer */}
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsImportOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                            >
                                {importSummary ? "Tutup" : "Batal"}
                            </button>
                            {!importSummary && (
                                <button
                                    type="button"
                                    onClick={handleStartBulkImport}
                                    disabled={parsedRows.length === 0 || isImporting}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                                >
                                    {isImporting ? (
                                        <>
                                            <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            <span>Mengimport...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>⚡</span>
                                            <span>Mulai Import {parsedRows.length} Siswa</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Pairing Kartu RFID */}
            {pairingUser && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div>
                                <h2 className="text-base font-bold text-white flex items-center gap-2">
                                    <span>💳</span> Tautkan Kartu Fisik RFID
                                </h2>
                                <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                                    {pairingUser.name} ({pairingUser.kelas || pairingUser.role})
                                </div>
                            </div>
                            <button onClick={() => setPairingUser(null)} className="text-slate-400 hover:text-white text-sm">
                                ✕
                            </button>
                        </div>

                        {pairingMsg.text && (
                            <div
                                className={`p-3 rounded-xl text-xs font-semibold ${
                                    pairingMsg.type === "success"
                                        ? "bg-emerald-950/50 border border-emerald-800 text-emerald-300"
                                        : "bg-rose-950/50 border border-rose-800 text-rose-300"
                                }`}
                            >
                                {pairingMsg.text}
                            </div>
                        )}

                        <form onSubmit={handlePairRfid} className="space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-center space-y-2">
                                <div className="text-3xl animate-bounce">💳</div>
                                <div className="text-xs font-bold text-white">Tempelkan Kartu RFID ke Sensor Reader</div>
                                <p className="text-[11px] text-slate-400">
                                    Sensor reader USB akan otomatis mengetik nomor UID kartu di bawah ini.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Nomor UID Kartu RFID *</label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Contoh: 0014298172 atau A3F912C8"
                                    value={pairingUid}
                                    onChange={(e) => setPairingUid(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-emerald-400 text-center placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                                {pairingUser.rfidCard && (
                                    <button
                                        type="button"
                                        onClick={() => setPairingUid("")}
                                        className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30"
                                    >
                                        Hapus Kartu
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setPairingUser(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPairingSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
                                >
                                    {isPairingSubmitting ? "Menyimpan..." : "Simpan Kartu RFID"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Tambah Pengguna Manual */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span>👥</span> Tambah Pengguna Baru
                            </h2>
                            <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white text-sm">
                                ✕
                            </button>
                        </div>

                        {errorMsg && (
                            <div className="p-3 my-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                                ⚠️ {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Muhammad Rizky Pratama"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Email Resmi *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="nama@smkn11bdg.sch.id"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Password Awal *</label>
                                    <input
                                        type="text"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Peran / Role *</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="STUDENT">Siswa (STUDENT)</option>
                                        <option value="SEKBID_OFFICER">Pengurus Sekbid OSIS</option>
                                        <option value="KOMISI_OFFICER">Pengurus Komisi MPK</option>
                                        <option value="BPH_OSIS">BPH OSIS</option>
                                        <option value="BPH_MPK">BPH MPK</option>
                                        <option value="PEMBINA">Pembina OSIS-MPK</option>
                                        <option value="KESISWAAN">Wakasek Kesiswaan</option>
                                        <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                                        <option value="ADMINISTRATOR">Administrator IT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Divisi Terkait</label>
                                    <select
                                        value={division}
                                        onChange={(e) => setDivision(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="GENERAL">GENERAL (Umum)</option>
                                        <option value="BPH_OSIS">BPH OSIS</option>
                                        <option value="BPH_MPK">BPH MPK</option>
                                        <option value="SEKBID_1">Sekbid 1 (Agama)</option>
                                        <option value="SEKBID_2">Sekbid 2 (Budi Pekerti)</option>
                                        <option value="SEKBID_3">Sekbid 3 (Kebangsaan)</option>
                                        <option value="SEKBID_4">Sekbid 4 (Kepribadian)</option>
                                        <option value="SEKBID_5">Sekbid 5 (Demokrasi)</option>
                                        <option value="SEKBID_6">Sekbid 6 (Jasmani & Danus)</option>
                                        <option value="SEKBID_7">Sekbid 7 (Seni)</option>
                                        <option value="SEKBID_8">Sekbid 8 (Lingkungan)</option>
                                        <option value="SEKBID_9">Sekbid 9 (IT & Medinfo)</option>
                                        <option value="SEKBID_10">Sekbid 10 (Kewirausahaan)</option>
                                        <option value="KOMISI_A">Komisi A (Hukum & AD/ART)</option>
                                        <option value="KOMISI_B">Komisi B (Aspirasi)</option>
                                        <option value="KOMISI_C">Komisi C (Keuangan)</option>
                                        <option value="KOMISI_D">Komisi D (Pengawasan)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">NIS (Nomor Induk Siswa)</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: 24250002"
                                        value={nis}
                                        onChange={(e) => setNis(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 mb-1">Kelas</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: XII RPL 1"
                                        value={kelas}
                                        onChange={(e) => setKelas(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">UID Kartu RFID (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="Tempelkan kartu RFID atau ketik UID..."
                                    value={rfidCard}
                                    onChange={(e) => setRfidCard(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 mb-1">Jabatan Spesifik</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Ketua OSIS / Sekretaris 1 / Bendahara 1 / Pembina"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-2"
                                />
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        { label: "Ketua OSIS", r: "BPH_OSIS", d: "BPH_OSIS" },
                                        { label: "Wakil Ketua OSIS", r: "BPH_OSIS", d: "BPH_OSIS" },
                                        { label: "Ketua MPK", r: "BPH_MPK", d: "BPH_MPK" },
                                        { label: "Wakil Ketua MPK", r: "BPH_MPK", d: "BPH_MPK" },
                                        { label: "Sekretaris 1", r: "BPH_OSIS", d: "BPH_OSIS" },
                                        { label: "Sekretaris 2", r: "BPH_OSIS", d: "BPH_OSIS" },
                                        { label: "Bendahara 1", r: "BPH_OSIS", d: "BPH_OSIS" },
                                        { label: "Bendahara 2", r: "BPH_OSIS", d: "BPH_OSIS" },
                                        { label: "Pembina OSIS-MPK", r: "PEMBINA", d: "PEMBINA" },
                                        { label: "Wakasek Kesiswaan", r: "KESISWAAN", d: "KESISWAAN" },
                                    ].map((preset) => (
                                        <button
                                            key={preset.label}
                                            type="button"
                                            onClick={() => {
                                                setPosition(preset.label);
                                                setRole(preset.r);
                                                setDivision(preset.d);
                                            }}
                                            className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all"
                                        >
                                            + {preset.label}
                                        </button>
                                    ))}
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
                                    {isSubmitting ? "Mendaftarkan..." : "Daftarkan Pengguna"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
