"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AspirationFormProps {
    onAspirationSubmitted?: () => void;
}

export default function AspirationForm({ onAspirationSubmitted }: AspirationFormProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Saran");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/aspirations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, category, isAnonymous }),
            });

            if (res.ok) {
                setMessage({ type: "success", text: "Aspirasi Anda berhasil dikirim! Pantau statusnya di riwayat aspirasi." });
                setTitle("");
                setContent("");
                setCategory("Saran");
                setIsAnonymous(false);
                if (onAspirationSubmitted) {
                    onAspirationSubmitted();
                }
            } else {
                const data = await res.json();
                setMessage({ type: "error", text: data.error || "Gagal mengirim aspirasi." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Terjadi kesalahan koneksi." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border-white/40 dark:border-white/10 shadow-3xl shadow-brand-primary/5">
            <h3 className="text-xl md:text-2xl font-black tracking-tight mb-2 flex items-center gap-3 text-foreground">
                <span className="w-2.5 h-6 bg-brand-primary rounded-full" />
                Sampaikan Aspirasi Anda
            </h3>
            <p className="text-foreground/50 text-xs md:text-sm mb-8 font-medium">
                Kritik, saran, dan ide kreatif Anda sangat berharga untuk kemajuan SMKN 11 Bandung.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 ml-1">
                        Judul Aspirasi
                    </label>
                    <input
                        type="text"
                        placeholder="Misal: Perbaikan Fasilitas Kantin / Penambahan Stopkontak di Kelas"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-border focus:border-brand-primary/50 focus:bg-white dark:focus:bg-white/5 transition-all outline-none font-bold text-sm"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 ml-1">
                            Kategori
                        </label>
                        <select
                            className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-border focus:border-brand-primary/50 focus:bg-white dark:focus:bg-white/5 transition-all outline-none font-bold text-sm cursor-pointer"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="Saran">💡 Saran & Masukan</option>
                            <option value="Keluhan">⚠️ Keluhan & Pengaduan</option>
                            <option value="Ide">🚀 Ide Kreatif & Inovasi</option>
                            <option value="Fasilitas">🏫 Fasilitas & Sarana</option>
                            <option value="Lainnya">📝 Lainnya</option>
                        </select>
                    </div>

                    {/* Anonymous toggle card */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 ml-1">
                            Privasi Pengirim
                        </label>
                        <label
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl border cursor-pointer transition-all ${
                                isAnonymous 
                                    ? "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400" 
                                    : "bg-foreground/[0.03] border-border text-foreground/70"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                            />
                            <div className="text-left">
                                <p className="text-xs font-black uppercase tracking-wider">Kirim Secara Anonim</p>
                                <p className="text-[10px] text-foreground/40 font-medium">Nama Anda disamarkan dari publik</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 ml-1">
                        Detail Aspirasi
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Jelaskan secara detail aspirasi, latar belakang, dan solusi yang Anda usulkan..."
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-border focus:border-brand-primary/50 focus:bg-white dark:focus:bg-white/5 transition-all outline-none font-medium text-sm resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-4 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-3 ${
                                message.type === "success"
                                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                    : "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
                            }`}
                        >
                            <span className="text-base">{message.type === "success" ? "✓" : "!"}</span>
                            <span>{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 md:py-5 bg-gradient-primary hover:shadow-2xl hover:shadow-purple-500/30 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Mengirim Suara..." : "Kirim Suara Anda 🚀"}
                </button>
            </form>
        </div>
    );
}

