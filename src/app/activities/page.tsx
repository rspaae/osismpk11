'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  category: string;
  division: string;
  eventDate?: string | null;
  views: number;
  author: { name: string };
  createdAt: string;
}

const CATEGORIES = [
  "Semua", "Kepemimpinan", "Olahraga & Kesehatan", "Seni & Budaya",
  "Keagamaan", "Lingkungan Hidup", "Teknologi & Informasi",
  "Sosial & Kemasyarakatan", "Akademik", "Aspirasi & Advokasi", "Umum"
];

export default function Activities() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch("/api/activities?status=PUBLISHED&limit=50");
        if (res.ok) {
          const data = await res.json();
          setArticles(data.data || []);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchCat = selectedCategory === "Semua" || art.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      art.title.toLowerCase().includes(q) ||
      (art.excerpt || "").toLowerCase().includes(q) ||
      art.content.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const isEmpty = !loading && !error && filteredArticles.length === 0;

  return (
    <main className="min-h-screen pt-32 md:pt-40 pb-20 md:pb-28 px-4 md:px-6 lg:px-8 bg-[#f7faf7] dark:bg-[#141c18] text-[#334139] dark:text-[#dce6e0] font-sans">
      <div className="container mx-auto max-w-7xl lg:max-w-[1360px]">

        {/* Header */}
        <header className="mb-10 text-center max-w-2xl mx-auto">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#e8f2ec] dark:bg-[#1d2c25] text-[#396953] dark:text-[#a3d4bd] text-xs font-semibold tracking-wider uppercase mb-3 border border-[#d4e6db] dark:border-[#24342c]">
            Publikasi & Rekam Jejak
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#202924] dark:text-[#f0f5f2] tracking-tight mb-3">
            Berita & Dokumentasi
          </h1>
          <p className="text-xs sm:text-sm text-[#5f7167] dark:text-[#a5b8ad]">
            Pusat informasi resmi kegiatan, liputan program kerja, dan publikasi agenda OSIS & MPK SMKN 11 Bandung Periode 2026/2027.
          </p>
        </header>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#468366] text-white shadow-xs"
                    : "bg-white dark:bg-[#19241f] text-[#55665d] dark:text-[#b5c7bd] border border-[#e3ece6] dark:border-[#24342c] hover:border-[#468366]/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              placeholder="Cari berita atau kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-8 bg-white dark:bg-[#19241f] rounded-xl text-xs text-[#2c3831] dark:text-[#dce6e0] placeholder:text-[#8a9a91] border border-[#d2ded6] dark:border-[#24342c] focus:outline-none focus:border-[#468366] transition-all"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8a9a91]">🔍</span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#468366] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-[#8a9a91]">Memuat artikel...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="py-16 text-center bg-white dark:bg-[#19241f] rounded-3xl border border-[#e3ece6] dark:border-[#24342c]">
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="text-sm font-bold text-[#2c3831] dark:text-[#dce6e0] mb-1">Gagal Memuat</h3>
            <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad]">Tidak dapat mengambil data. Coba refresh halaman.</p>
          </div>
        )}

        {/* Empty State */}
        {isEmpty && (
          <div className="py-16 md:py-24 px-6 text-center bg-white dark:bg-[#19241f] rounded-3xl border-2 border-dashed border-[#d4e6db] dark:border-[#24342c] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#e8f2ec] dark:bg-[#1d2c25] border border-[#d4e6db] dark:border-[#24342c] flex items-center justify-center text-3xl mb-4 shadow-xs">
              📰
            </div>
            <span className="text-[11px] font-semibold text-[#396953] dark:text-[#a3d4bd] bg-[#e8f2ec] dark:bg-[#1d2c25] px-3.5 py-1 rounded-full border border-[#d4e6db] dark:border-[#24342c] uppercase tracking-wider mb-3">
              {searchQuery || selectedCategory !== "Semua" ? "Tidak Ditemukan" : "Awal Kepengurusan 2026/2027"}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#2c3831] dark:text-[#dce6e0] mb-2">
              {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : selectedCategory !== "Semua" ? `Belum ada artikel kategori ${selectedCategory}` : "Dokumentasi & Berita Akan Segera Hadir"}
            </h3>
            <p className="text-xs sm:text-sm text-[#5f7167] dark:text-[#a5b8ad] max-w-lg leading-relaxed mb-6">
              {!searchQuery && selectedCategory === "Semua"
                ? "Kepengurusan OSIS & MPK SMKN 11 Bandung Periode 2026/2027 baru saja dimulai. Seluruh publikasi akan diperbarui seiring terlaksananya kegiatan."
                : "Coba pilih kategori lain atau hapus kata kunci pencarian."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/vision-mission" className="px-5 py-2.5 bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold rounded-xl transition-all shadow-xs">
                Lihat Rencana Proker →
              </Link>
              <Link href="/student/dashboard" className="px-5 py-2.5 bg-[#edf5f0] dark:bg-[#1b2821] hover:bg-[#e2ede6] text-[#396953] dark:text-[#a3d4bd] border border-[#d4e6db] dark:border-[#24342c] text-xs font-semibold rounded-xl transition-all">
                Kirim Aspirasi Siswa
              </Link>
            </div>
          </div>
        )}

        {/* Article Grid */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs flex flex-col overflow-hidden hover:border-[#468366]/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                onClick={() => setActiveArticle(post)}
              >
                {/* Cover */}
                {post.coverImage && (
                  <div className="aspect-[16/8] w-full overflow-hidden bg-[#f0f5f2] dark:bg-[#141c18]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
                    />
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-semibold text-[#396953] dark:text-[#a3d4bd] uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-[#8a9a91]">
                      {post.eventDate
                        ? new Date(post.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                        : new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#2c3831] dark:text-[#dce6e0] mb-1.5 leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] leading-relaxed flex-1 line-clamp-3">
                    {post.excerpt || post.content}
                  </p>

                  <div className="pt-3 mt-3 border-t border-[#f0f5f2] dark:border-[#24342c] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#8a9a91]">{post.author?.name || "Admin OSIS"}</span>
                    <span className="font-semibold text-[#396953] dark:text-[#a3d4bd]">Baca →</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setActiveArticle(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] shadow-xl overflow-hidden my-6"
            >
              {/* Cover */}
              {activeArticle.coverImage && (
                <div className="aspect-[16/7] w-full overflow-hidden bg-[#f0f5f2] dark:bg-[#141c18]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeArticle.coverImage}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
                  />
                </div>
              )}

              {/* Header */}
              <div className="p-6 bg-[#396953] text-white relative">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-all cursor-pointer"
                >
                  ✕
                </button>
                <span className="inline-block px-2.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-semibold uppercase tracking-wider mb-2">
                  {activeArticle.category}
                </span>
                <h2 className="text-lg md:text-xl font-bold leading-snug pr-8">
                  {activeArticle.title}
                </h2>
                <div className="mt-2 text-xs text-[#dce6e0]">
                  {activeArticle.eventDate
                    ? new Date(activeArticle.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                    : new Date(activeArticle.createdAt).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  {activeArticle.author?.name && <> · <strong>{activeArticle.author.name}</strong></>}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <div className="text-xs sm:text-sm text-[#55665d] dark:text-[#b5c7bd] leading-relaxed whitespace-pre-line">
                  {activeArticle.content}
                </div>

                <div className="pt-4 border-t border-[#e3ece6] dark:border-[#24342c] flex items-center justify-between">
                  <Link
                    href="/student/dashboard"
                    className="text-xs font-bold text-[#396953] dark:text-[#a3d4bd] hover:underline"
                  >
                    Kirim aspirasi terkait →
                  </Link>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-4 py-2 bg-[#edf5f0] dark:bg-[#1b2821] text-[#334139] dark:text-[#dce6e0] hover:bg-[#e2ede6] font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
