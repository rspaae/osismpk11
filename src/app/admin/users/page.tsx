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
                    <h1 className="text-2xl md:text-3xl font-bold text-[#202924] dark:text-white tracking-tight flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-[#e8f2ec] dark:bg-[#1c2823] text-[#468366] flex items-center justify-center border border-[#d4e6db] dark:border-[#2a3c33] text-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                        <span>Data Siswa & Pengguna</span>
                    </h1>
                    <p className="text-sm text-[#5f7167] dark:text-slate-400 mt-1">
                        Sistem pengelolaan data siswa SMKN 11, pengurus OSIS-MPK, pembina, serta penautan kartu fisik RFID.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Export Data Pengguna */}
                    <a
                        href={`/api/admin/users/export?kelas=${kelasFilter}&role=${roleFilter}&q=${encodeURIComponent(debouncedSearch)}`}
                        download={`data_pengguna_smkn11_${new Date().toISOString().slice(0, 10)}.csv`}
                        className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#19241f] hover:bg-[#f0f5f2] dark:hover:bg-[#202d27] text-[#2e5845] dark:text-[#a3d9bc] border border-[#d4e6db] dark:border-[#2a3c33] text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
                        title="Export data pengguna sesuai filter pencarian yang sedang aktif"
                    >
                        <svg className="w-4 h-4 text-[#468366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Export CSV</span>
                    </a>

                    {/* Download Template CSV */}
                    <a
                        href="/api/admin/users/template"
                        download="template_import_siswa_smkn11.csv"
                        className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#19241f] hover:bg-[#f0f5f2] dark:hover:bg-[#202d27] text-[#5f7167] dark:text-slate-300 border border-[#d4e6db] dark:border-[#2a3c33] text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
                        title="Download Template Format CSV untuk import 1.700+ data siswa"
                    >
                        <svg className="w-4 h-4 text-[#718579]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Unduh Template</span>
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
                        className="px-3.5 py-2 rounded-xl bg-[#e8f2ec] hover:bg-[#d8e9df] dark:bg-[#1e3026] dark:hover:bg-[#253c30] text-[#2e5845] dark:text-[#a3d9bc] border border-[#c4ded0] dark:border-[#2d4738] text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Import CSV Siswa</span>
                    </button>

                    {/* Tambah Pengguna Manual */}
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2 rounded-xl bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Tambah Pengguna</span>
                    </button>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-sm flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#e8f2ec] dark:bg-[#15231c] text-[#468366] flex items-center justify-center font-bold">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[11px] font-semibold text-[#718579] dark:text-slate-400 uppercase tracking-wider">Total Akun</div>
                        <div className="text-xl md:text-2xl font-bold text-[#202924] dark:text-white">{meta.total}</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-sm flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#e8f2ec] dark:bg-[#15231c] text-[#468366] flex items-center justify-center font-bold">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[11px] font-semibold text-[#718579] dark:text-slate-400 uppercase tracking-wider">Siswa Terdaftar</div>
                        <div className="text-xl md:text-2xl font-bold text-[#468366] dark:text-[#7cc49e]">{meta.totalStudents}</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-sm flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#fdf3e7] dark:bg-[#2b2214] text-[#b87333] flex items-center justify-center font-bold">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[11px] font-semibold text-[#718579] dark:text-slate-400 uppercase tracking-wider">Pengurus / Guru</div>
                        <div className="text-xl md:text-2xl font-bold text-[#b87333] dark:text-[#e4a86b]">{meta.totalOfficers}</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-sm flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#eef3fb] dark:bg-[#192534] text-[#3b6ea5] flex items-center justify-center font-bold">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[11px] font-semibold text-[#718579] dark:text-slate-400 uppercase tracking-wider">Kelas Aktif</div>
                        <div className="text-xl md:text-2xl font-bold text-[#3b6ea5] dark:text-[#7bb0e7]">{meta.uniqueClasses?.length || 0}</div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Box */}
                <div>
                    <label className="block text-[11px] font-bold uppercase text-[#718579] dark:text-slate-400 mb-1.5">
                        Cari Nama / NIS / UID RFID
                    </label>
                    <input
                        type="text"
                        placeholder="Ketik Nama, NIS, NISN, RFID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2 text-xs text-[#202924] dark:text-slate-200 placeholder-[#8ba093] focus:outline-none focus:border-[#468366] transition-colors"
                    />
                </div>

                {/* Filter Role */}
                <div>
                    <label className="block text-[11px] font-bold uppercase text-[#718579] dark:text-slate-400 mb-1.5">Filter Peran (Role)</label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-slate-200 focus:outline-none focus:border-[#468366]"
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
                    <label className="block text-[11px] font-bold uppercase text-[#718579] dark:text-slate-400 mb-1.5">Filter Kelas</label>
                    <select
                        value={kelasFilter}
                        onChange={(e) => setKelasFilter(e.target.value)}
                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-slate-200 focus:outline-none focus:border-[#468366]"
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
                    <label className="block text-[11px] font-bold uppercase text-[#718579] dark:text-slate-400 mb-1.5">Tampilkan per Halaman</label>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3 py-2 text-xs text-[#202924] dark:text-slate-200 focus:outline-none focus:border-[#468366]"
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
                <div className="p-3.5 rounded-2xl bg-[#e8f2ec] dark:bg-[#1e3026] border border-[#c4ded0] dark:border-[#2d4738] flex items-center justify-between text-xs text-[#2e5845] dark:text-[#a3d9bc] animate-in fade-in duration-200 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#468366] animate-pulse"></span>
                        <span>
                            Terpilih <strong>{selectedIds.size}</strong> akun pengguna dari daftar.
                        </span>
                    </div>
                    <button
                        onClick={() => setSelectedIds(new Set())}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#141d18] hover:bg-[#d8e9df] text-[11px] font-bold text-[#2e5845] dark:text-[#a3d9bc] border border-[#c4ded0] dark:border-[#2d4738] transition-colors"
                    >
                        Batalkan Pilihan
                    </button>
                </div>
            )}

            {/* Users Data Table */}
            <div className="rounded-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#202924] dark:text-slate-300">
                        <thead className="bg-[#f5f8f6] dark:bg-[#141d18] text-[#5f7167] dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-[#e3ece6] dark:border-[#24342c] select-none">
                            <tr>
                                <th className="px-4 py-3.5 w-10 text-center">
                                    <input
                                        type="checkbox"
                                        checked={isAllCurrentPageSelected}
                                        onChange={(e) => handleSelectAllCurrentPage(e.target.checked)}
                                        className="rounded border-[#d4e6db] text-[#468366] focus:ring-0 cursor-pointer"
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
                        <tbody className="divide-y divide-[#edf3ef] dark:divide-[#24342c]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-[#718579]">
                                        <div className="inline-block w-6 h-6 border-2 border-[#468366] border-t-transparent rounded-full animate-spin mb-2"></div>
                                        <div>Memuat data pengguna dari database...</div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-[#718579]">
                                        <div className="w-12 h-12 rounded-full bg-[#e8f2ec] text-[#468366] flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                                            🔍
                                        </div>
                                        <div className="font-semibold text-[#202924] dark:text-white">Tidak ada data pengguna yang ditemukan.</div>
                                        <p className="text-[11px] text-[#718579] mt-1">
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
                                                isSelected ? "bg-[#eef6f1] dark:bg-[#1c2e25]" : "hover:bg-[#f8faf9] dark:hover:bg-[#16211b]"
                                            }`}
                                        >
                                            <td className="px-4 py-3.5 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleToggleSelect(u.id)}
                                                    className="rounded border-[#d4e6db] text-[#468366] focus:ring-0 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-bold text-[#202924] dark:text-white text-sm">{u.name || "Tanpa Nama"}</div>
                                                <div className="text-[11px] text-[#718579] dark:text-slate-400 font-mono mt-0.5">{u.email || "-"}</div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="font-mono text-[#468366] dark:text-[#7cc49e] font-semibold">{u.nis || "-"}</div>
                                                <div className="text-[#5f7167] dark:text-slate-300 font-medium text-[11px] mt-0.5">
                                                    {u.kelas || <span className="text-[#8ba093] italic">Tanpa Kelas</span>}
                                                    {u.major ? ` (${u.major})` : ""}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8f2ec] dark:bg-[#1c2823] border border-[#d4e6db] dark:border-[#2a3c33] text-[#2e5845] dark:text-[#a3d9bc]">
                                                    {u.role.replace(/_/g, " ")}
                                                </span>
                                                {u.position && (
                                                    <div className="text-[11px] text-[#8b6534] dark:text-[#e4a86b] font-medium mt-1">
                                                        ⭐ {u.position}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {u.rfidCard ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#e8f2ec] text-[#2e5845] border border-[#d4e6db] font-mono text-[11px] font-bold">
                                                        💳 {u.rfidCard}
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-[#8ba093] italic">Belum ditautkan</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    onClick={() => {
                                                        setPairingUser(u);
                                                        setPairingUid(u.rfidCard || "");
                                                        setPairingMsg({ type: "", text: "" });
                                                    }}
                                                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#19241f] hover:bg-[#f0f5f2] dark:hover:bg-[#202d27] text-[#2e5845] dark:text-[#a3d9bc] border border-[#d4e6db] dark:border-[#2a3c33] text-xs font-semibold transition-all shadow-sm"
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
                <div className="p-4 bg-[#f5f8f6] dark:bg-[#141d18] border-t border-[#e3ece6] dark:border-[#24342c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5f7167] dark:text-slate-400">
                    <div>
                        Menampilkan <strong>{users.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0}</strong> s/d{" "}
                        <strong>{Math.min(meta.page * meta.limit, meta.total)}</strong> dari total <strong>{meta.total}</strong> akun
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setPage(1)}
                            disabled={meta.page <= 1 || loading}
                            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#19241f] border border-[#d4e6db] dark:border-[#2a3c33] hover:bg-[#edf3ef] disabled:opacity-40 disabled:cursor-not-allowed text-[#202924] dark:text-white font-bold transition-all shadow-sm"
                            title="Halaman Pertama"
                        >
                            «
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={meta.page <= 1 || loading}
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#19241f] border border-[#d4e6db] dark:border-[#2a3c33] hover:bg-[#edf3ef] disabled:opacity-40 disabled:cursor-not-allowed text-[#202924] dark:text-white font-semibold transition-all shadow-sm"
                        >
                            ‹ Sebelumnya
                        </button>

                        <span className="px-3 py-1.5 font-bold text-[#2e5845] dark:text-[#a3d9bc] bg-[#e8f2ec] dark:bg-[#1c2823] rounded-lg border border-[#d4e6db] dark:border-[#2a3c33]">
                            Hal {meta.page} / {meta.totalPages || 1}
                        </span>

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                            disabled={meta.page >= meta.totalPages || loading}
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#19241f] border border-[#d4e6db] dark:border-[#2a3c33] hover:bg-[#edf3ef] disabled:opacity-40 disabled:cursor-not-allowed text-[#202924] dark:text-white font-semibold transition-all shadow-sm"
                        >
                            Berikutnya ›
                        </button>
                        <button
                            onClick={() => setPage(meta.totalPages)}
                            disabled={meta.page >= meta.totalPages || loading}
                            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#19241f] border border-[#d4e6db] dark:border-[#2a3c33] hover:bg-[#edf3ef] disabled:opacity-40 disabled:cursor-not-allowed text-[#202924] dark:text-white font-bold transition-all shadow-sm"
                            title="Halaman Terakhir"
                        >
                            »
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Bulk Actions Bar (Muncul saat ada item terpilih) */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 inset-x-4 max-w-4xl mx-auto z-40 bg-white/95 dark:bg-[#19241f]/95 backdrop-blur-md border border-[#c4ded0] dark:border-[#2d4738] rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
                    <div className="flex items-center gap-2.5 text-xs text-[#202924] dark:text-white">
                        <span className="w-8 h-8 rounded-full bg-[#468366] flex items-center justify-center font-bold text-white shadow-sm">
                            {selectedIds.size}
                        </span>
                        <div>
                            <div className="font-bold">Akun Terpilih</div>
                            <div className="text-[11px] text-[#718579] dark:text-slate-400">Pilih tindakan massal yang ingin diterapkan:</div>
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
                            className="px-3 py-2 rounded-xl bg-[#fdf3e7] hover:bg-[#fae8d4] text-[#8b6534] border border-[#f0d5b5] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
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
                            className="px-3 py-2 rounded-xl bg-[#eef3fb] hover:bg-[#dde8f8] text-[#3b6ea5] border border-[#c6daf4] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
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
                            className="px-3 py-2 rounded-xl bg-[#fdf2f2] hover:bg-[#fae4e4] text-[#9c3838] border border-[#f5c7c7] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                            <span>🔒</span>
                            <span>Nonaktifkan</span>
                        </button>

                        {/* Batal */}
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-3 py-2 rounded-xl bg-white dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] text-[#5f7167] dark:text-slate-300 text-xs font-semibold transition-all shadow-sm"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Bulk Actions Confirmation */}
            {isBulkActionModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e3ece6] dark:border-[#24342c]">
                            <h2 className="text-base font-bold text-[#202924] dark:text-white flex items-center gap-2">
                                <span>⚡</span> Konfirmasi Aksi Massal ({selectedIds.size} Pengguna)
                            </h2>
                            <button
                                onClick={() => setIsBulkActionModalOpen(false)}
                                className="text-[#718579] hover:text-[#202924] dark:hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        {bulkResultMsg && (
                            <div
                                className={`p-3 rounded-xl text-xs font-semibold ${
                                    bulkResultMsg.type === "success"
                                        ? "bg-[#e8f2ec] border border-[#c4ded0] text-[#2e5845]"
                                        : "bg-[#fdf2f2] border border-[#f5c7c7] text-[#9c3838]"
                                }`}
                            >
                                {bulkResultMsg.text}
                            </div>
                        )}

                        <div className="space-y-3 text-xs text-[#5f7167] dark:text-slate-300">
                            {bulkActionType === "RESET_PASSWORD" && (
                                <>
                                    <p>
                                        Semua <strong>{selectedIds.size} akun</strong> yang dipilih akan direset kata sandinya.
                                    </p>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#202924] dark:text-slate-200 mb-1">Password Baru</label>
                                        <input
                                            type="text"
                                            value={bulkParamValue}
                                            onChange={(e) => setBulkParamValue(e.target.value)}
                                            placeholder="password123"
                                            className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#468366] focus:outline-none focus:border-[#468366]"
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
                                        <label className="block text-[11px] font-bold text-[#202924] dark:text-slate-200 mb-1">Target Nama Kelas Baru *</label>
                                        <input
                                            type="text"
                                            value={bulkParamValue}
                                            onChange={(e) => setBulkParamValue(e.target.value)}
                                            placeholder="Contoh: XI PPLG 1 atau XII TKJ 2"
                                            className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-white focus:outline-none focus:border-[#468366]"
                                        />
                                    </div>
                                </>
                            )}

                            {bulkActionType === "DEACTIVATE" && (
                                <p className="p-3 rounded-xl bg-[#fdf2f2] border border-[#f5c7c7] text-[#9c3838]">
                                    ⚠️ Akun-akun yang dinonaktifkan tidak akan dapat login ke sistem OSIM11 sampai diaktifkan kembali.
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3ece6] dark:border-[#24342c]">
                            <button
                                type="button"
                                onClick={() => setIsBulkActionModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718579] hover:text-[#202924]"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleExecuteBulkAction}
                                disabled={isBulkExecuting}
                                className="px-5 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-sm"
                            >
                                {isBulkExecuting ? "Memproses..." : "Terapkan Sekarang"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Import Siswa Massal (CSV) */}
            {isImportOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-2xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e3ece6] dark:border-[#24342c]">
                            <div>
                                <h2 className="text-lg font-bold text-[#202924] dark:text-white flex items-center gap-2">
                                    <span>📥</span> Import Data Siswa Massal (CSV)
                                </h2>
                                <p className="text-xs text-[#5f7167] dark:text-slate-400 mt-0.5">
                                    Unggah berkas CSV untuk mendaftarkan atau memperbarui data siswa secara massal.
                                </p>
                            </div>
                            <button onClick={() => setIsImportOpen(false)} className="text-[#718579] hover:text-[#202924] dark:hover:text-white text-sm">
                                ✕
                            </button>
                        </div>

                        {/* File Upload Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="p-8 border-2 border-dashed border-[#d4e6db] dark:border-[#2a3c33] hover:border-[#468366] rounded-2xl bg-[#f5f8f6] dark:bg-[#141d18] hover:bg-[#eef6f1] transition-all cursor-pointer text-center space-y-3"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,text/csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="text-3xl">📄</div>
                            <div>
                                <div className="text-sm font-bold text-[#202924] dark:text-white">
                                    {importFile ? importFile.name : "Klik atau Seret Berkas CSV ke Sini"}
                                </div>
                                <div className="text-xs text-[#718579] dark:text-slate-400 mt-1">
                                    {importFile
                                        ? `${parsedRows.length} baris data siswa siap diproses`
                                        : "Mendukung format koma (,) atau titik koma (;). Baris header otomatis dikenali."}
                                </div>
                            </div>
                        </div>

                        {/* Preview 5 Baris Pertama */}
                        {parsedRows.length > 0 && !importSummary && (
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-[#202924] dark:text-slate-200 flex items-center justify-between">
                                    <span>Pratinjau Data ({parsedRows.length} Siswa Ditemukan):</span>
                                    <span className="text-[11px] text-[#468366] font-mono">5 baris pertama</span>
                                </div>
                                <div className="overflow-x-auto rounded-xl border border-[#e3ece6] dark:border-[#24342c] bg-[#f5f8f6] dark:bg-[#141d18]">
                                    <table className="w-full text-left text-[11px] text-[#5f7167] dark:text-slate-300">
                                        <thead className="bg-[#edf3ef] dark:bg-[#1c2823] text-[#718579] dark:text-slate-400 font-bold border-b border-[#e3ece6] dark:border-[#24342c]">
                                            <tr>
                                                <th className="px-3 py-2">Nama</th>
                                                <th className="px-3 py-2">NIS</th>
                                                <th className="px-3 py-2">Kelas</th>
                                                <th className="px-3 py-2">Jurusan</th>
                                                <th className="px-3 py-2">RFID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#e3ece6] dark:divide-[#24342c]">
                                            {parsedRows.slice(0, 5).map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-3 py-1.5 font-medium text-[#202924] dark:text-white">{row.name}</td>
                                                    <td className="px-3 py-1.5 font-mono text-[#468366]">{row.nis || "-"}</td>
                                                    <td className="px-3 py-1.5">{row.kelas || "-"}</td>
                                                    <td className="px-3 py-1.5">{row.major || "-"}</td>
                                                    <td className="px-3 py-1.5 font-mono text-[#718579]">{row.rfidCard || "-"}</td>
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
                                    <span className="text-[#202924] dark:text-slate-300">Memproses Data Siswa ke Database...</span>
                                    <span className="text-[#468366] font-mono">
                                        {importProgress.current} / {importProgress.total} ({importProgress.percent}%)
                                    </span>
                                </div>
                                <div className="w-full h-2.5 rounded-full bg-[#e3ece6] dark:bg-[#141d18] overflow-hidden">
                                    <div
                                        className="h-full bg-[#468366] transition-all duration-300"
                                        style={{ width: `${importProgress.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Import Result Summary */}
                        {importSummary && (
                            <div className="p-4 rounded-2xl bg-[#f5f8f6] dark:bg-[#141d18] border border-[#e3ece6] dark:border-[#24342c] space-y-3">
                                <div className="text-xs font-bold text-[#202924] dark:text-white flex items-center gap-2">
                                    <span>🎉</span> Proses Import Selesai!
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="p-2.5 rounded-xl bg-[#e8f2ec] border border-[#c4ded0] text-[#2e5845]">
                                        <div className="font-bold text-base">{importSummary.createdCount}</div>
                                        <div className="text-[10px]">Akun Baru Dibuat</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-[#eef3fb] border border-[#c6daf4] text-[#3b6ea5]">
                                        <div className="font-bold text-base">{importSummary.updatedCount}</div>
                                        <div className="text-[10px]">Akun Diperbarui</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-[#fdf2f2] border border-[#f5c7c7] text-[#9c3838]">
                                        <div className="font-bold text-base">{importSummary.errors.length}</div>
                                        <div className="text-[10px]">Gagal / Error</div>
                                    </div>
                                </div>

                                {importSummary.errors.length > 0 && (
                                    <div className="max-h-32 overflow-y-auto space-y-1 text-[11px] text-[#9c3838] font-mono p-2 rounded-xl bg-[#fdf2f2] border border-[#f5c7c7]">
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
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3ece6] dark:border-[#24342c]">
                            <button
                                type="button"
                                onClick={() => setIsImportOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718579] hover:text-[#202924]"
                            >
                                {importSummary ? "Tutup" : "Batal"}
                            </button>
                            {!importSummary && (
                                <button
                                    type="button"
                                    onClick={handleStartBulkImport}
                                    disabled={parsedRows.length === 0 || isImporting}
                                    className="px-5 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
                                >
                                    {isImporting ? (
                                        <>
                                            <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            <span>Mengimport...</span>
                                        </>
                                    ) : (
                                        <>
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
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e3ece6] dark:border-[#24342c]">
                            <div>
                                <h2 className="text-base font-bold text-[#202924] dark:text-white flex items-center gap-2">
                                    <span>💳</span> Tautkan Kartu Fisik RFID
                                </h2>
                                <div className="text-xs text-[#468366] dark:text-[#7cc49e] font-semibold mt-0.5">
                                    {pairingUser.name} ({pairingUser.kelas || pairingUser.role})
                                </div>
                            </div>
                            <button onClick={() => setPairingUser(null)} className="text-[#718579] hover:text-[#202924] dark:hover:text-white text-sm">
                                ✕
                            </button>
                        </div>

                        {pairingMsg.text && (
                            <div
                                className={`p-3 rounded-xl text-xs font-semibold ${
                                    pairingMsg.type === "success"
                                        ? "bg-[#e8f2ec] border border-[#c4ded0] text-[#2e5845]"
                                        : "bg-[#fdf2f2] border border-[#f5c7c7] text-[#9c3838]"
                                }`}
                            >
                                {pairingMsg.text}
                            </div>
                        )}

                        <form onSubmit={handlePairRfid} className="space-y-4">
                            <div className="p-4 rounded-2xl bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] text-center space-y-2">
                                <div className="text-3xl">💳</div>
                                <div className="text-xs font-bold text-[#202924] dark:text-white">Tempelkan Kartu RFID ke Sensor Reader</div>
                                <p className="text-[11px] text-[#718579] dark:text-slate-400">
                                    Sensor reader USB akan otomatis mengisi nomor UID kartu di bawah ini.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Nomor UID Kartu RFID *</label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Contoh: 0014298172 atau A3F912C8"
                                    value={pairingUid}
                                    onChange={(e) => setPairingUid(e.target.value)}
                                    className="w-full bg-white dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#468366] text-center placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e3ece6] dark:border-[#24342c]">
                                {pairingUser.rfidCard && (
                                    <button
                                        type="button"
                                        onClick={() => setPairingUid("")}
                                        className="px-3 py-2 rounded-xl text-xs font-semibold text-[#9c3838] hover:bg-[#fdf2f2]"
                                    >
                                        Hapus Kartu
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setPairingUser(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718579] hover:text-[#202924]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPairingSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold transition-all shadow-sm"
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
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-[#e3ece6] dark:border-[#24342c]">
                            <h2 className="text-lg font-bold text-[#202924] dark:text-white flex items-center gap-2">
                                <span>👥</span> Tambah Pengguna Baru
                            </h2>
                            <button onClick={() => setIsCreateOpen(false)} className="text-[#718579] hover:text-[#202924] dark:hover:text-white text-sm">
                                ✕
                            </button>
                        </div>

                        {errorMsg && (
                            <div className="p-3 my-3 rounded-xl bg-[#fdf2f2] border border-[#f5c7c7] text-[#9c3838] text-xs">
                                ⚠️ {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Muhammad Rizky Pratama"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-white placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="nama@smkn11bdg.sch.id"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-white placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Password Awal *</label>
                                    <input
                                        type="text"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#468366] focus:outline-none focus:border-[#468366]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Peran / Role *</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3 py-2.5 text-xs text-[#202924] dark:text-white focus:outline-none focus:border-[#468366]"
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
                                    <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Divisi Terkait</label>
                                    <select
                                        value={division}
                                        onChange={(e) => setDivision(e.target.value)}
                                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3 py-2.5 text-xs text-[#202924] dark:text-white focus:outline-none focus:border-[#468366]"
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
                                    <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">NIS (Nomor Induk Siswa)</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: 24250002"
                                        value={nis}
                                        onChange={(e) => setNis(e.target.value)}
                                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-white placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Kelas</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: XII RPL 1"
                                        value={kelas}
                                        onChange={(e) => setKelas(e.target.value)}
                                        className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-white placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">UID Kartu RFID (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="Tempelkan kartu RFID atau ketik UID..."
                                    value={rfidCard}
                                    onChange={(e) => setRfidCard(e.target.value)}
                                    className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#468366] placeholder-[#8ba093] focus:outline-none focus:border-[#468366]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#202924] dark:text-slate-200 mb-1">Jabatan Spesifik</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Ketua OSIS / Sekretaris 1 / Bendahara 1 / Pembina"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="w-full bg-[#f5f8f6] dark:bg-[#141d18] border border-[#d4e6db] dark:border-[#2a3c33] rounded-xl px-3.5 py-2.5 text-xs text-[#202924] dark:text-white placeholder-[#8ba093] focus:outline-none focus:border-[#468366] mb-2"
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
                                            className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#e8f2ec] hover:bg-[#d8e9df] border border-[#d4e6db] text-[#2e5845] transition-all"
                                        >
                                            + {preset.label}
                                        </button>
                                    ))}
                                </div>
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
