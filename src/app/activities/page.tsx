'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  date: string;
  category: string;
  readTime: string;
  author: string;
  authorRole: string;
  desc: string;
  fullContent: string[];
  keyHighlights: string[];
  quote?: string;
  tag: string;
  status: string;
}

export default function Activities() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const categories = [
    "Semua",
    "Kepemimpinan",
    "Olahraga & Seni",
    "Sosial",
    "Akademik & IT",
    "Advokasi"
  ];

  const articles: Article[] = [
    {
      id: 1,
      title: "Latihan Dasar Kepemimpinan (LDK) 2026: Cetak Pengurus Berintegritas",
      date: "25 Jan 2026",
      category: "Kepemimpinan",
      readTime: "3 mnt baca",
      author: "Sekbid 1 (Kaderisasi)",
      authorRole: "Pengurus OSIS",
      desc: "Pelatihan kepemimpinan, manajemen organisasi, dan simulasi pemecahan masalah yang diikuti 80 peserta perwakilan kelas.",
      fullContent: [
        "LDK tahun 2026 diselenggarakan selama 3 hari di kampus SMKN 11 Bandung dengan fokus penguatan karakter dan sinergi tim.",
        "Materi pelatihan meliputi kepemimpinan situasional, penyusunan proposal proker, etika persidangan, serta komunikasi publik.",
        "Seluruh peserta berhasil menuntaskan seluruh modul dan resmi dikukuhkan sebagai kader penerus kepengurusan OSIS-MPK."
      ],
      keyHighlights: [
        "80 peserta dari kelas X & XI seluruh jurusan",
        "Materi kepemimpinan dan simulasi sidang",
        "Pengukuhan kader kepengurusan 2025/2026"
      ],
      quote: "Kepemimpinan bermula dari kedisiplinan diri dan ketulusan untuk melayani sesama.",
      tag: "Kaderisasi",
      status: "Terlaksana"
    },
    {
      id: 2,
      title: "Porseni XI: Gelora Sportivitas & Kreativitas Seni Antar Kelas",
      date: "15 Jan 2026",
      category: "Olahraga & Seni",
      readTime: "3 mnt baca",
      author: "Sekbid 7 (Olahraga & Seni)",
      authorRole: "Panitia Pelaksana",
      desc: "Turnamen futsal, basket, tari kreasi tradisional, dan festival musik antar kelas yang berlangsung kompetitif dan meriah.",
      fullContent: [
        "Pekan Olahraga dan Seni (Porseni) XI menjadi ajang tahunan yang mempererat tali silaturahmi seluruh warga sekolah.",
        "Kompetisi berlangsung sportif di lapangan utama dan panggung kreasi seni dengan antusiasme penonton yang tinggi.",
        "Kontingen kelas XI Rekayasa Perangkat Lunak berhasil meraih Juara Umum pada edisi tahun ini."
      ],
      keyHighlights: [
        "12 cabang olahraga dan lomba seni dipertandingkan",
        "Juara Umum: Kelas XI RPL",
        "Penghargaan Fair Play untuk kelas terdisiplin"
      ],
      quote: "Sportivitas di lapangan adalah cerminan integritas dalam kehidupan.",
      tag: "Kompetisi",
      status: "Terlaksana"
    },
    {
      id: 3,
      title: "OSIS Peduli: Aksi Sosial & Penghijauan Lingkungan Sekolah",
      date: "02 Jan 2026",
      category: "Sosial",
      readTime: "2 mnt baca",
      author: "Sekbid 8 (Sosial & Lingkungan)",
      authorRole: "Divisi Sosial",
      desc: "Gerakan penanaman bibit pohon di selasar sekolah dan pembagian paket sembako kepada warga sekitar lingkungan sekolah.",
      fullContent: [
        "OSIS SMKN 11 Bandung menggelar aksi sosial peduli lingkungan di awal tahun dengan menanam 50 bibit pohon peneduh.",
        "Selain itu, terkumpul 120 paket sembako dari donasi sukarela siswa untuk disalurkan ke masyarakat yang membutuhkan.",
        "Kegiatan ini rutin diadakan sebagai wujud kepedulian sosial warga SMKN 11 terhadap lingkungan sekitar."
      ],
      keyHighlights: [
        "Penanaman 50 bibit pohon peneduh di lingkungan sekolah",
        "Penyaluran 120 paket bantuan sembako",
        "Program kolaborasi bersama pengurus kelas"
      ],
      quote: "Kepedulian nyata menghadirkan kehangatan dan perubahan positif.",
      tag: "Bakti Sosial",
      status: "Rutin"
    },
    {
      id: 4,
      title: "Peluncuran Kanal Aspirasi Digital Siswa Berbasis Web",
      date: "08 Feb 2026",
      category: "Akademik & IT",
      readTime: "2 mnt baca",
      author: "Tim IT OSIS-MPK",
      authorRole: "Divisi Teknologi",
      desc: "Layanan berbasis web untuk memudahkan siswa mengirimkan kritik, saran fasilitas, dan usulan proker secara transparan.",
      fullContent: [
        "Platform Kanal Aspirasi kini dapat diakses oleh seluruh siswa menggunakan akun NIS masing-masing.",
        "Siswa dapat memantau status tindak lanjut aspirasi secara terbuka serta memilih opsi pengiriman anonim.",
        "Inovasi ini ditujukan untuk mempercepat respon sekolah terhadap kebutuhan belajar dan sarana prasarana."
      ],
      keyHighlights: [
        "Login cepat menggunakan NIS siswa",
        "Status tindak lanjut transparan (Pending, Review, Selesai)",
        "Opsi kirim anonim untuk kenyamanan siswa"
      ],
      quote: "Setiap suara berharga untuk perbaikan sekolah yang berkelanjutan.",
      tag: "Inovasi",
      status: "Terbaru"
    },
    {
      id: 5,
      title: "Sidang Pleno Triwulan I MPK: Evaluasi Program Kerja OSIS",
      date: "28 Jan 2026",
      category: "Advokasi",
      readTime: "3 mnt baca",
      author: "Dewan MPK",
      authorRole: "Badan Legislatif",
      desc: "Musyawarah pengawasan dan evaluasi berkala pelaksanaan program kerja OSIS bersama seluruh perwakilan kelas.",
      fullContent: [
        "MPK menggelar Sidang Pleno Triwulan I guna mengevaluasi efektivitas program kerja OSIS yang telah berjalan.",
        "Forum ini juga menjadi sarana penyampaian rekapitulasi kebutuhan siswa dari masing-masing perwakilan kelas.",
        "Hasil sidang menetapkan rekomendasi penyesuaian jadwal proker menjelang agenda ujian semester."
      ],
      keyHighlights: [
        "Dihadiri oleh perwakilan ketua kelas seluruh angkatan",
        "Laporan progres 10 Sekbid OSIS",
        "Sinkronisasi jadwal kegiatan semester genap"
      ],
      quote: "Evaluasi yang terbuka membangun organisasi yang akuntabel dan kuat.",
      tag: "Legislatif",
      status: "Terlaksana"
    },
    {
      id: 6,
      title: "Persiapan ELEVEN Fest 2026: Pameran Karya Inovasi Kejuruan",
      date: "10 Feb 2026",
      category: "Akademik & IT",
      readTime: "2 mnt baca",
      author: "Sekbid 9 (TIK & Publikasi)",
      authorRole: "Divisi Kreatif",
      desc: "Ajang pameran aplikasi, game, desain visual, serta produk wirausaha karya siswa lintas jurusan SMKN 11 Bandung.",
      fullContent: [
        "ELEVEN Fest disiapkan sebagai pameran tahunan karya unggulan siswa jurusan RPL, TKJ, DKV, dan Akuntansi.",
        "Agenda ini akan diisi pameran karya interaktif, workshop praktisi industri, dan bazar kewirausahaan siswa.",
        "Pendaftaran booth karya untuk seluruh kelas akan dibuka secara bertahap pada bulan mendatang."
      ],
      keyHighlights: [
        "Pameran karya kejuruan interaktif",
        "Sesi sharing industri bersama praktisi teknologi",
        "Bazar kreatif & stand kewirausahaan siswa"
      ],
      quote: "Karya nyata adalah bukti kompetensi dan daya saing generasi muda.",
      tag: "Persiapan",
      status: "Persiapan"
    }
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === "Semua" || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen pt-32 md:pt-40 pb-20 md:pb-28 px-4 md:px-6 bg-mint-cream text-foreground">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10 text-center max-w-2xl mx-auto">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold tracking-widest uppercase mb-3 border border-emerald-200 dark:border-emerald-800">
            Publikasi & Rekam Jejak
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Berita & Dokumentasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Informasi terkini kegiatan, program kerja, dan pengumuman resmi OSIS & MPK SMKN 11 Bandung.
          </p>
        </header>

        {/* Featured Article Card */}
        {articles.length > 0 && (
          <div className="mb-12 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider">
                Berita Utama
              </span>
              <span className="text-[11px] text-slate-400">
                {articles[0].date} • {articles[0].readTime}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3">
              {articles[0].title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-3xl">
              {articles[0].desc}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium">
                Oleh: <strong className="text-slate-800 dark:text-slate-200">{articles[0].author}</strong>
              </span>
              <button
                onClick={() => setActiveArticle(articles[0])}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Baca Lengkap →
              </button>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-8 bg-white dark:bg-slate-900 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-600 transition-all"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              🔍
            </span>
          </div>
        </div>

        {/* Article Grid */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 my-8">
            <p className="text-xs text-slate-500">Tidak ada artikel dalam kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((post) => (
              <article
                key={post.id}
                className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-slate-400">{post.date}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {post.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{post.readTime}</span>
                  <button
                    onClick={() => setActiveArticle(post)}
                    className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Selengkapnya →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-6 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 bg-emerald-800 text-white relative shrink-0">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-all cursor-pointer"
                >
                  ✕
                </button>
                <span className="inline-block px-2.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                  {activeArticle.category}
                </span>
                <h2 className="text-xl md:text-2xl font-black leading-snug">
                  {activeArticle.title}
                </h2>
                <div className="mt-2 text-xs text-emerald-200">
                  {activeArticle.date} • Ditulis oleh: <strong>{activeArticle.author}</strong>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                {activeArticle.keyHighlights && (
                  <div className="p-4 bg-emerald-50 dark:bg-slate-800/60 rounded-xl border border-emerald-100 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2">
                      Poin Penting:
                    </h4>
                    <ul className="space-y-1">
                      {activeArticle.keyHighlights.map((pt, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeArticle.fullContent.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {activeArticle.quote && (
                  <blockquote className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-l-4 border-emerald-600 text-xs italic text-slate-600 dark:text-slate-300">
                    "{activeArticle.quote}"
                  </blockquote>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href="/student/dashboard"
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    Kirim aspirasi terkait →
                  </Link>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
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
