"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface User {
    id: string;
    name: string;
    nis: string | null;
    email: string | null;
    role: string;
}

export default function UserManagement() {
    const { data: session, status } = useSession();
    const [name, setName] = useState("");
    const [nis, setNis] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    if (status === "loading") return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!session) redirect("/login");
    if (session.user.role !== "ADMINISTRATOR") redirect("/student/dashboard");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, nis, email, role, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "User berhasil dibuat!" });
                setName("");
                setNis("");
                setEmail("");
                setPassword("");
            } else {
                setMessage({ type: "error", text: data.error || "Gagal membuat user" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Terjadi kesalahan sistem" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-6 bg-background">
            <div className="container mx-auto max-w-4xl">
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-foreground">Manajemen Akun</h1>
                    <p className="text-foreground/50 font-medium text-lg italic">Buat akun manual untuk warga SMKN 11 Bandung.</p>
                </header>

                <div className="grid grid-cols-1 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 md:p-12 rounded-[2.5rem] border-white/40 dark:border-white/10 shadow-3xl shadow-brand-primary/5"
                    >
                        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                            <span className="w-2 h-6 bg-brand-primary rounded-full" />
                            Tambah User Baru
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-4">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Contoh: Andi Sulaeman"
                                        className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-4">NIS</label>
                                    <input
                                        type="text"
                                        required
                                        value={nis}
                                        onChange={(e) => setNis(e.target.value)}
                                        placeholder="Nomor Induk Siswa"
                                        className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-4">Email (Opsional)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="siswa@smkn11bdg.sch.id"
                                        className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-4">Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="STUDENT">Siswa (Student)</option>
                                        <option value="OSIS_OFFICER">Pengurus OSIS</option>
                                        <option value="MPK_OFFICER">Pengurus MPK</option>
                                        <option value="DEWAN">Dewan Pengurus</option>
                                        <option value="PEMBINA">Pembina</option>
                                        <option value="ADMINISTRATOR">Administrator</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-4">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-bold"
                                />
                            </div>

                            <AnimatePresence>
                                {message.text && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-4 rounded-xl text-xs font-bold text-center ${message.type === "success" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}
                                    >
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:shadow-2xl hover:shadow-brand-primary/30 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? "Memproses..." : "Buat Akun Sekarang"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
