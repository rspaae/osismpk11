"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AspirationForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Saran");
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
                body: JSON.stringify({ title, content, category }),
            });

            if (res.ok) {
                setMessage({ type: "success", text: "Aspirasi Anda telah terkirim! Terima kasih atas kontribusinya." });
                setTitle("");
                setContent("");
                setCategory("Saran");
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
        <div className="glass p-10 rounded-[3rem] border-white/40 dark:border-white/10 shadow-3xl shadow-brand-primary/5">
            <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3 text-foreground">
                <span className="w-2 h-6 bg-brand-accent rounded-full" />
                Sampaikan Aspirasi Anda
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">
                        Judul Aspirasi
                    </label>
                    <input
                        type="text"
                        placeholder="Misal: Perbaikan Fasilitas Kantin"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 focus:border-brand-primary/30 focus:bg-white dark:focus:bg-white/5 transition-all outline-none font-bold"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">
                            Kategori
                        </label>
                        <select
                            className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 focus:border-brand-primary/30 focus:bg-white dark:focus:bg-white/5 transition-all outline-none font-bold"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="Saran">💡 Saran</option>
                            <option value="Keluhan">⚠️ Keluhan</option>
                            <option value="Ide">🚀 Ide Kreatif</option>
                            <option value="Lainnya">📝 Lainnya</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">
                        Detail Aspirasi
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Jelaskan secara detail aspirasi atau masukan Anda..."
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 focus:border-brand-primary/30 focus:bg-white dark:focus:bg-white/5 transition-all outline-none font-bold resize-none"
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
                            className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${message.type === "success"
                                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                                    : "bg-red-500/10 border border-red-500/20 text-red-500"
                                }`}
                        >
                            <span>{message.type === "success" ? "✓" : "!"}</span>
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-brand-primary hover:bg-brand-secondary text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50"
                >
                    {loading ? "Mengirim..." : "Kirim Suara Anda"}
                </button>
            </form>
        </div>
    );
}
