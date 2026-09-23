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
        <div className="p-6 sm:p-8 md:p-10 bg-white dark:bg-[#19241f] rounded-3xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1 text-[#2c3831] dark:text-[#dce6e0] flex items-center gap-2.5">
                <span className="w-2 h-5 bg-[#468366] rounded-full" />
                Sampaikan Aspirasi Anda
            </h3>
            <p className="text-[#5f7167] dark:text-[#a5b8ad] text-xs sm:text-sm mb-6">
                Kritik, saran, dan usulan fasilitas untuk SMKN 11 Bandung.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad]">
                        Judul Aspirasi
                    </label>
                    <input
                        type="text"
                        placeholder="Misal: Perbaikan Proyektor Lab Komputer / Tempat Sampah Gedung B"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#d2ded6] dark:border-[#24342c] focus:border-[#468366] dark:focus:border-[#5d9e7e] transition-colors outline-none text-sm text-[#334139] dark:text-[#dce6e0] placeholder:text-[#8a9a91]"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad]">
                            Kategori
                        </label>
                        <select
                            className="w-full px-4 py-3 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#d2ded6] dark:border-[#24342c] focus:border-[#468366] dark:focus:border-[#5d9e7e] transition-colors outline-none text-sm text-[#334139] dark:text-[#dce6e0] cursor-pointer"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="Saran">💡 Saran & Masukan</option>
                            <option value="Keluhan">⚠️ Keluhan & Pengaduan</option>
                            <option value="Ide">🚀 Ide & Inovasi Kegiatan</option>
                            <option value="Fasilitas">🏫 Fasilitas & Sarana</option>
                            <option value="Lainnya">📝 Lainnya</option>
                        </select>
                    </div>

                    {/* Anonymous toggle */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad]">
                            Privasi Pengirim
                        </label>
                        <label
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                                isAnonymous 
                                    ? "bg-[#edf5f0] dark:bg-[#1d2c25] border-[#468366] text-[#396953] dark:text-[#a3d4bd]" 
                                    : "bg-[#f7faf7] dark:bg-[#141c18] border-[#d2ded6] dark:border-[#24342c] text-[#5f7167] dark:text-[#a5b8ad]"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={() => {}} // handled by parent onClick
                                className="w-4 h-4 rounded text-[#468366] accent-[#468366] cursor-pointer"
                            />
                            <span className="text-xs font-medium">
                                {isAnonymous ? "Kirim Sebagai Anonim (Nama Disembunyikan)" : "Tampilkan Identitas Siswa"}
                            </span>
                        </label>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad]">
                        Detail Aspirasi & Penjelasan
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Jelaskan usulan, keluhan, atau ide secara jelas dan santun..."
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#d2ded6] dark:border-[#24342c] focus:border-[#468366] dark:focus:border-[#5d9e7e] transition-colors outline-none text-sm text-[#334139] dark:text-[#dce6e0] placeholder:text-[#8a9a91]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {message && (
                    <div
                        className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                            message.type === "success"
                                ? "bg-[#e8f2ec] dark:bg-[#183325] text-[#2b6144] dark:text-[#96d6b4] border border-[#d4e6db] dark:border-[#24342c]"
                                : "bg-[#fae8e8] dark:bg-[#361b1b] text-[#8c3636] dark:text-[#e69898] border border-[#f0c2c2] dark:border-[#4d2525]"
                        }`}
                    >
                        <span>{message.type === "success" ? "✓" : "⚠️"}</span>
                        <span>{message.text}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-7 py-3 bg-[#468366] hover:bg-[#396953] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Mengirim..." : "Kirim Aspirasi"}
                </button>
            </form>
        </div>
    );
}
