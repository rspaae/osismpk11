'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import RunningTicker from "@/components/RunningTicker";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'osis' | 'mpk'>('osis');
  const [greeting, setGreeting] = useState("Selamat Datang");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) {
      setGreeting("Selamat Pagi 🌤️");
    } else if (hour >= 11 && hour < 15) {
      setGreeting("Selamat Siang ☀️");
    } else if (hour >= 15 && hour < 18) {
      setGreeting("Selamat Sore 🌅");
    } else {
      setGreeting("Selamat Malam 🌙");
    }
  }, []);

  const osisProker = [
    {
      title: "Gerakan Peduli Siswa",
      tag: "Sosial & Empati",
      schedule: "Berkala",
      desc: "Program kepedulian untuk membantu siswa yang membutuhkan melalui kolaborasi alumni, warga sekolah, dan pihak terkait.",
      icon: "🤝"
    },
    {
      title: "Bonding OSIM 11",
      tag: "Kekeluargaan",
      schedule: "Semesteran",
      desc: "Kegiatan refreshing dan bonding pengurus OSIS & MPK melalui berbagai aktivitas untuk mempererat kebersamaan dan kekompakan.",
      icon: "🏕️"
    },
    {
      title: "Studi Banding",
      tag: "Wawasan Organisasi",
      schedule: "Tahunan",
      desc: "Kunjungan dan bertukar pengalaman dengan OSIS sekolah lain untuk menambah wawasan dan mengembangkan sistem kerja.",
      icon: "🏛️"
    },
    {
      title: "ELSAVA Vol.II",
      tag: "Festival & Karya",
      schedule: "Akhir Periode",
      desc: "Festival akhir kepengurusan sebagai wadah kreativitas, bakat, dan karya siswa melalui pertunjukan bersama pihak eksternal.",
      icon: "🌟"
    },
    {
      title: "One Skill, One Growth",
      tag: "Pengembangan Diri",
      schedule: "Bulanan",
      desc: "Program pengembangan kemampuan siswa melalui berbagi ilmu dan pembelajaran keterampilan baru bersama praktisi dan alumni.",
      icon: "💡"
    }
  ];

  const mpkProker = [
    {
      title: "SULAS (Suara Sebelas)",
      tag: "Aspirasi Siswa",
      schedule: "Bulanan",
      desc: "Sistem penyampaian aspirasi siswa yang mudah diakses oleh warga sekolah SMKN 11 Bandung, melalui Google Form Digital maupun forum kelas yang dilaksanakan setiap bulannya.",
      icon: "📣"
    },
    {
      title: "MPK Check",
      tag: "Monitoring & Evaluasi",
      schedule: "Setiap Event / Bulanan",
      desc: "Mengadakan forum internal MPK OSIS untuk monitoring dan evaluasi program kerja setiap event maupun setiap bulannya.",
      icon: "✅"
    },
    {
      title: "ASPRI 11",
      tag: "Apresiasi Siswa",
      schedule: "Berkala",
      desc: "Apresiasi Siswa Berprestasi 11 — membuat ruang apresiasi untuk siswa SMKN 11 Bandung melalui media sosial MPK.",
      icon: "🏆"
    }
  ];

  const [latestNews, setLatestNews] = useState<{ id: string; title: string; category: string; date: string; desc: string }[]>([]);

  useEffect(() => {
    fetch("/api/activities?status=PUBLISHED&limit=3")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setLatestNews(
            data.data.map((item: any) => ({
              id: item.id,
              title: item.title,
              category: item.category,
              date: item.eventDate
                ? new Date(item.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                : new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
              desc: item.excerpt || (item.content.length > 120 ? item.content.slice(0, 120) + "..." : item.content),
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const currentProkerList = (activeTab === 'osis' ? osisProker : mpkProker).filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f7faf7] dark:bg-[#141c18] text-[#334139] dark:text-[#dce6e0] font-sans">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Dynamic Greeting & Fluid Entry) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[88vh] flex items-center justify-center pt-28 md:pt-36 pb-16 md:pb-24 px-4 md:px-8 lg:px-12 overflow-hidden">
        {/* Soft Background Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="SMKN 11 Bandung"
            fill
            priority
            quality={90}
            unoptimized
            className="object-cover object-center filter brightness-[0.88] saturate-[0.85]"
          />
          {/* Soft Low-Contrast Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f7faf7] via-[#f7faf7]/82 to-[#2c3831]/50 dark:from-[#141c18] dark:via-[#141c18]/85 dark:to-[#141c18]/60 z-10" />
        </div>

        <div className="container mx-auto max-w-5xl lg:max-w-6xl flex flex-col items-center text-center relative z-20">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 px-3.5 py-1 bg-white/80 dark:bg-[#19241f]/80 backdrop-blur-md rounded-full border border-[#e3ece6] dark:border-[#24342c] text-xs font-medium text-[#468366] dark:text-[#a3d4bd] shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#468366] animate-ping" />
            <span>Media Digital Resmi • OSIS & MPK SMKN 11 Bandung</span>
          </motion.div>

          {/* Logo Capsule Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-5"
          >
            <div className="inline-flex items-center justify-center gap-3 sm:gap-3.5 px-4 sm:px-5 py-2 bg-[#ffffff]/90 dark:bg-[#19241f]/90 backdrop-blur-md rounded-full border border-[#e3ece6] dark:border-[#24342c] shadow-xs">
              {/* MPK: Circular */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white dark:bg-[#141c18] border border-[#ede0bc] dark:border-[#3d3119] p-0.5 relative shadow-xs flex items-center justify-center">
                <Image src="/images/logos/mpk.jpg" alt="MPK SMKN 11" fill className="object-cover rounded-full" />
              </div>
              <span className="text-[#a5b8ad] dark:text-[#5f7167] text-xs">•</span>
              {/* SMKN 11: Shield Shape */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-white dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] p-0.5 relative shadow-xs flex items-center justify-center">
                <Image src="/images/logos/smkn11.jpg" alt="SMKN 11 Bandung" fill className="object-contain" />
              </div>
              <span className="text-[#a5b8ad] dark:text-[#5f7167] text-xs">•</span>
              {/* OSIS: Circular */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] p-0.5 relative shadow-xs flex items-center justify-center">
                <Image src="/images/logos/osis.jpg" alt="OSIS SMKN 11" fill className="object-cover rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Angkatan Badges */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-5 flex flex-wrap items-center justify-center gap-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e8f2ec] dark:bg-[#1d2c25] text-[#396953] dark:text-[#a3d4bd] border border-[#d4e6db] dark:border-[#24342c] rounded-full text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#468366]" />
              <span>Navastra · OSIS SMKN 11</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#faf3e1] dark:bg-[#2e2617] text-[#785a21] dark:text-[#e6c885] border border-[#ede0bc] dark:border-[#3d3119] rounded-full text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#c99a36]" />
              <span>Navandya · MPK SMKN 11</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#202924] dark:text-[#f0f5f2] mb-4 tracking-tight leading-tight"
          >
            Membangun Inspirasi, <br />
            <span className="text-[#3d775c] dark:text-[#9cd4b9]">Mewujudkan Aksi Nyata.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="max-w-2xl text-sm sm:text-base md:text-lg text-[#55665d] dark:text-[#b5c7bd] mb-8 leading-relaxed font-normal"
          >
            Pusat informasi resmi, agenda kegiatan, dan ruang aspirasi terpadu siswa SMKN 11 Bandung.
          </motion.p>

          {/* Action Buttons with Micro-interactions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto"
          >
            <Link
              href="/student/dashboard"
              className="px-6 sm:px-8 py-3.5 bg-[#468366] hover:bg-[#396953] active:scale-95 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow-sm"
            >
              📢 Sampaikan Aspirasi
            </Link>
            <Link
              href="/activities"
              className="px-6 sm:px-8 py-3.5 bg-[#ffffff] dark:bg-[#19241f] hover:bg-[#f4f8f5] dark:hover:bg-[#202d27] active:scale-95 text-[#334139] dark:text-[#dce6e0] border border-[#d2ded6] dark:border-[#24342c] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
            >
              Berita & Kegiatan
            </Link>
            <Link
              href="/structure"
              className="px-6 sm:px-8 py-3.5 bg-[#edf5f0] dark:bg-[#1b2821] hover:bg-[#e2ede6] active:scale-95 text-[#396953] dark:text-[#a3d4bd] border border-[#d4e6db] dark:border-[#24342c] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Struktur Organisasi
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* Continuous Marquee Ticker */}
      {/* ========================================================================= */}
      <RunningTicker />

      {/* ========================================================================= */}
      {/* 2. DOKUMENTASI KEGIATAN (Placeholder Awal Kepengurusan) */}
      {/* ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl lg:max-w-[1360px] px-4 md:px-6 lg:px-8 py-6 mt-2"
      >
        <div className="p-6 md:p-8 lg:p-10 bg-white dark:bg-[#19241f] rounded-3xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#468366] dark:text-[#a3d4bd] block mb-1">
                Galeri & Dokumentasi
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2c3831] dark:text-[#dce6e0]">
                Dokumentasi Kegiatan
              </h2>
            </div>
            <Link
              href="/activities"
              className="text-xs font-semibold text-[#468366] dark:text-[#a3d4bd] hover:underline shrink-0"
            >
              Lihat Agenda & Berita →
            </Link>
          </div>

          <div className="w-full py-12 md:py-16 px-6 rounded-2xl border-2 border-dashed border-[#d4e6db] dark:border-[#24342c] bg-[#f7faf7] dark:bg-[#141c18] flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#e8f2ec] dark:bg-[#1d2c25] border border-[#d4e6db] dark:border-[#24342c] flex items-center justify-center text-2xl mb-4 shadow-xs">
              📸
            </div>
            <span className="text-[11px] font-semibold text-[#396953] dark:text-[#a3d4bd] bg-[#e8f2ec] dark:bg-[#1d2c25] px-3 py-1 rounded-full border border-[#d4e6db] dark:border-[#24342c] uppercase tracking-wider mb-2">
              Awal Kepengurusan 2026/2027
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#2c3831] dark:text-[#dce6e0] mb-2">
              Dokumentasi Akan Segera Ditambahkan
            </h3>
            <p className="text-xs sm:text-sm text-[#5f7167] dark:text-[#a5b8ad] max-w-lg leading-relaxed">
              Foto kegiatan resmi, rapat kerja, dan rekam jejak pelaksanaan program kerja OSIS & MPK SMKN 11 Bandung akan diperbarui di sini secara bertahap seiring berjalannya agenda periode 2026/2027.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 3. SAMBUTAN PIMPINAN (Expansive Grid) */}
      {/* ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl lg:max-w-[1360px] px-4 md:px-6 lg:px-8 py-6"
      >
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#468366] dark:text-[#a3d4bd] block mb-1">
            Pimpinan Organisasi
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2c3831] dark:text-[#dce6e0]">
            Pimpinan MPK & OSIS
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* MPK */}
          <div className="p-6 md:p-8 lg:p-10 bg-white dark:bg-[#19241f] rounded-3xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs flex flex-col justify-between hover:border-[#c99a36]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#faf3e1] dark:bg-[#2e2617] text-[#785a21] dark:text-[#e6c885] border border-[#ede0bc] dark:border-[#3d3119] flex items-center justify-center text-lg font-bold">
                    ⚖️
                  </span>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#785a21] dark:text-[#e6c885] bg-[#faf3e1] dark:bg-[#2e2617] px-2.5 py-0.5 rounded-full border border-[#ede0bc] dark:border-[#3d3119]">
                      Badan Legislatif
                    </span>
                    <h3 className="text-xl font-bold text-[#2c3831] dark:text-[#dce6e0] mt-1">MPK SMKN 11</h3>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#785a21] dark:text-[#e6c885] bg-[#faf3e1] dark:bg-[#2e2617] px-3 py-1 rounded-full border border-[#ede0bc] dark:border-[#3d3119]">
                  Navandya · 2026/2027
                </span>
              </div>

              {/* Duo Ketua & Wakil MPK (Large Portrait Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div className="group rounded-2xl bg-[#fafaf7] dark:bg-[#141c18] border border-[#edeae0] dark:border-[#24342c] p-4 text-center hover:border-[#c99a36]/40 transition-all flex flex-col items-center shadow-xs">
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-[#faf3e1] to-[#f2dfb3] dark:from-[#2e2617] dark:to-[#3d3119] border border-[#ede0bc] dark:border-[#3d3119] flex flex-col items-center justify-center mb-3.5 shadow-xs">
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#785a21] dark:text-[#e6c885] group-hover:scale-105 transition-transform">NA</span>
                    <span className="text-xs text-[#785a21]/80 dark:text-[#e6c885]/80 uppercase tracking-widest font-semibold mt-2">MPK 11 Bandung</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#785a21] dark:text-[#e6c885] bg-[#faf3e1] dark:bg-[#2e2617] px-3 py-0.5 rounded-full inline-block mb-1.5 border border-[#ede0bc] dark:border-[#3d3119]">
                    Ketua MPK
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#2c3831] dark:text-[#dce6e0] leading-snug">
                    Niar Almira Achmi
                  </h4>
                  <p className="text-xs text-[#785a21]/80 dark:text-[#e6c885]/80 mt-0.5 font-medium">Periode 2026/2027</p>
                </div>

                <div className="group rounded-2xl bg-[#fafaf7] dark:bg-[#141c18] border border-[#edeae0] dark:border-[#24342c] p-4 text-center hover:border-[#c99a36]/40 transition-all flex flex-col items-center shadow-xs">
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-[#faf3e1] to-[#f2dfb3] dark:from-[#2e2617] dark:to-[#3d3119] border border-[#ede0bc] dark:border-[#3d3119] flex flex-col items-center justify-center mb-3.5 shadow-xs">
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#785a21] dark:text-[#e6c885] group-hover:scale-105 transition-transform">MR</span>
                    <span className="text-xs text-[#785a21]/80 dark:text-[#e6c885]/80 uppercase tracking-widest font-semibold mt-2">MPK 11 Bandung</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#785a21] dark:text-[#e6c885] bg-[#faf3e1] dark:bg-[#2e2617] px-3 py-0.5 rounded-full inline-block mb-1.5 border border-[#ede0bc] dark:border-[#3d3119]">
                    Wakil Ketua MPK
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#2c3831] dark:text-[#dce6e0] leading-snug">
                    M. Ilham Romadon
                  </h4>
                  <p className="text-xs text-[#785a21]/80 dark:text-[#e6c885]/80 mt-0.5 font-medium">Periode 2026/2027</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#5f7167] dark:text-[#a5b8ad] leading-relaxed italic mb-5">
                &ldquo;Dengar Suara, Nyatakan Aksinya! — Mewujudkan MPK yang hadir, terbuka, dan dapat dipercaya untuk mengawal perubahan nyata bagi siswa SMKN 11 Bandung.&rdquo;
              </p>
            </div>
            <Link
              href="/structure"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#785a21] dark:text-[#e6c885] hover:underline"
            >
              Lihat Struktur & Komisi MPK →
            </Link>
          </div>

          {/* OSIS — Paslon 01 */}
          <div className="p-6 md:p-8 lg:p-10 bg-white dark:bg-[#19241f] rounded-3xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs flex flex-col justify-between hover:border-[#468366]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#e8f2ec] dark:bg-[#1d2c25] text-[#396953] dark:text-[#a3d4bd] border border-[#d4e6db] dark:border-[#24342c] flex items-center justify-center text-lg font-bold">
                    ⚡
                  </span>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#396953] dark:text-[#a3d4bd] bg-[#e8f2ec] dark:bg-[#1d2c25] px-2.5 py-0.5 rounded-full border border-[#d4e6db] dark:border-[#24342c]">
                      Badan Eksekutif
                    </span>
                    <h3 className="text-xl font-bold text-[#2c3831] dark:text-[#dce6e0] mt-1">OSIS SMKN 11</h3>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#396953] dark:text-[#a3d4bd] bg-[#e8f2ec] dark:bg-[#1d2c25] px-3 py-1 rounded-full border border-[#d4e6db] dark:border-[#24342c]">
                  Navastra · 2026/2027
                </span>
              </div>

              {/* Duo Ketua & Wakil OSIS (Large Portrait Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div className="group rounded-2xl bg-[#f4f8f5] dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] p-4 text-center hover:border-[#468366]/40 transition-all flex flex-col items-center shadow-xs">
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-[#e8f2ec] to-[#d4e6db] dark:from-[#1d2c25] dark:to-[#254235] border border-[#d4e6db] dark:border-[#24342c] flex flex-col items-center justify-center mb-3.5 shadow-xs">
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#396953] dark:text-[#a3d4bd] group-hover:scale-105 transition-transform">TS</span>
                    <span className="text-xs text-[#396953]/80 dark:text-[#a3d4bd]/80 uppercase tracking-widest font-semibold mt-2">OSIS 11 Bandung</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#396953] dark:text-[#a3d4bd] bg-[#e8f2ec] dark:bg-[#1d2c25] px-3 py-0.5 rounded-full inline-block mb-1.5 border border-[#d4e6db] dark:border-[#24342c]">
                    Ketua OSIS
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#2c3831] dark:text-[#dce6e0] leading-snug">
                    Tania Salsabila Putri
                  </h4>
                  <p className="text-xs text-[#468366] dark:text-[#a3d4bd] font-medium mt-0.5">Periode 2026/2027</p>
                </div>

                <div className="group rounded-2xl bg-[#f4f8f5] dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] p-4 text-center hover:border-[#468366]/40 transition-all flex flex-col items-center shadow-xs">
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-[#e8f2ec] to-[#d4e6db] dark:from-[#1d2c25] dark:to-[#254235] border border-[#d4e6db] dark:border-[#24342c] flex flex-col items-center justify-center mb-3.5 shadow-xs">
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#396953] dark:text-[#a3d4bd] group-hover:scale-105 transition-transform">DF</span>
                    <span className="text-xs text-[#396953]/80 dark:text-[#a3d4bd]/80 uppercase tracking-widest font-semibold mt-2">OSIS 11 Bandung</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#396953] dark:text-[#a3d4bd] bg-[#e8f2ec] dark:bg-[#1d2c25] px-3 py-0.5 rounded-full inline-block mb-1.5 border border-[#d4e6db] dark:border-[#24342c]">
                    Wakil Ketua OSIS
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#2c3831] dark:text-[#dce6e0] leading-snug">
                    Dzaki Fairuz
                  </h4>
                  <p className="text-xs text-[#468366] dark:text-[#a3d4bd] font-medium mt-0.5">Periode 2026/2027</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#5f7167] dark:text-[#a5b8ad] leading-relaxed italic mb-5">
                "Bukan Sekedar Janji, Tapi Bukti Nyata. Bersama-sama mewujudkan OSIS yang solid, aktif, peduli, dan berprestasi."
              </p>
            </div>
            <Link
              href="/vision-mission"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#468366] dark:text-[#a3d4bd] hover:underline"
            >
              Lihat Visi & Misi Lengkap →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 4. PROGRAM KERJA (Expansive 5-Column / Responsive Grid) */}
      {/* ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl lg:max-w-[1360px] px-4 md:px-6 lg:px-8 py-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2c3831] dark:text-[#dce6e0]">
              Program Kerja Pokok
            </h2>
            <p className="text-xs sm:text-sm text-[#5f7167] dark:text-[#a5b8ad] mt-1">
              Rencana aksi nyata kepengurusan OSIS & MPK SMKN 11 Bandung
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Filter Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari proker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#19241f] border border-[#d2ded6] dark:border-[#24342c] text-xs text-[#334139] dark:text-[#dce6e0] placeholder:text-[#8a9a91] outline-none focus:border-[#468366] w-36 sm:w-44 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8a9a91] hover:text-[#334139]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sliding Spring Tabs */}
            <div className="relative inline-flex p-1 bg-[#edf5f0] dark:bg-[#19241f] rounded-xl border border-[#e3ece6] dark:border-[#24342c]">
              <button
                onClick={() => setActiveTab('osis')}
                className={`relative z-10 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'osis'
                    ? 'text-white'
                    : 'text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#2c3831]'
                }`}
              >
                {activeTab === 'osis' && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-[#468366] rounded-lg -z-10 shadow-xs"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                OSIS (Navastra)
              </button>

              <button
                onClick={() => setActiveTab('mpk')}
                className={`relative z-10 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'mpk'
                    ? 'text-white'
                    : 'text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#2c3831]'
                }`}
              >
                {activeTab === 'mpk' && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-[#c99a36] rounded-lg -z-10 shadow-xs"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                MPK (Navandya)
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentProkerList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 p-6 rounded-2xl bg-white dark:bg-[#19241f] border border-dashed border-[#d2ded6] dark:border-[#24342c] text-xs text-[#8a9a91]"
            >
              Tidak ditemukan program kerja dengan kata kunci "{searchQuery}".
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {currentProkerList.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs flex flex-col justify-between hover:border-[#468366]/50 hover:-translate-y-1 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#e8f2ec] dark:bg-[#1d2c25] text-[#396953] dark:text-[#a3d4bd] border border-[#d4e6db] dark:border-[#24342c]">
                        {item.schedule}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#8a9a91] dark:text-[#73887d] uppercase tracking-wider block mb-1">
                      {item.tag}
                    </span>
                    <h4 className="text-base font-bold text-[#2c3831] dark:text-[#dce6e0] mb-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* ========================================================================= */}
      {/* 5. BERITA & DOKUMENTASI TERKINI */}
      {/* ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl lg:max-w-[1360px] px-4 md:px-6 lg:px-8 py-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2c3831] dark:text-[#dce6e0]">
              Berita & Dokumentasi
            </h2>
            <p className="text-xs sm:text-sm text-[#5f7167] dark:text-[#a5b8ad] mt-1">
              Informasi resmi kegiatan dan publikasi OSIS-MPK
            </p>
          </div>
          <Link
            href="/activities"
            className="text-xs font-semibold text-[#468366] dark:text-[#a3d4bd] hover:underline flex items-center gap-1"
          >
            Lihat Semua →
          </Link>
        </div>

        {latestNews.length === 0 ? (
          <div className="py-12 px-6 rounded-2xl border-2 border-dashed border-[#d4e6db] dark:border-[#24342c] bg-white dark:bg-[#19241f] flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#e8f2ec] dark:bg-[#1d2c25] border border-[#d4e6db] dark:border-[#24342c] flex items-center justify-center text-xl mb-3 shadow-xs">
              📰
            </div>
            <h3 className="text-sm font-bold text-[#2c3831] dark:text-[#dce6e0] mb-1">
              Belum Ada Berita
            </h3>
            <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] max-w-md leading-relaxed mb-4">
              Berita dan dokumentasi kegiatan akan ditambahkan secara berkala seiring berjalannya program kerja Periode 2026/2027.
            </p>
            <Link
              href="/activities"
              className="text-xs font-semibold text-[#468366] dark:text-[#a3d4bd] hover:underline"
            >
              Pantau halaman berita →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((news) => (
              <article
                key={news.id}
                className="p-6 bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs flex flex-col justify-between hover:-translate-y-1 hover:border-[#468366]/40 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#8a9a91] dark:text-[#73887d] mb-3">
                    <span className="font-semibold text-[#396953] dark:text-[#a3d4bd] uppercase bg-[#e8f2ec] dark:bg-[#1d2c25] px-2 py-0.5 rounded-md border border-[#d4e6db] dark:border-[#24342c]">
                      {news.category}
                    </span>
                    <span>{news.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#2c3831] dark:text-[#dce6e0] mb-2 leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] leading-relaxed mb-4">
                    {news.desc}
                  </p>
                </div>
                <Link
                  href="/activities"
                  className="text-xs font-semibold text-[#468366] dark:text-[#a3d4bd] hover:underline mt-auto inline-flex items-center gap-1"
                >
                  Baca Selengkapnya →
                </Link>
              </article>
            ))}
          </div>
        )}
      </motion.section>

      {/* ========================================================================= */}
      {/* 6. CTA RUANG ASPIRASI SISWA */}
      {/* ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl lg:max-w-[1360px] px-4 md:px-6 lg:px-8 py-8"
      >
        <div className="p-8 md:p-10 lg:p-12 bg-[#468366] text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xs">
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-1.5">Ada Usulan atau Keluhan Fasilitas?</h3>
            <p className="text-xs sm:text-sm text-[#e8f2ec] max-w-2xl">
              Sampaikan aspirasimu secara terbuka atau anonim langsung ke pengurus OSIS-MPK SMKN 11 Bandung.
            </p>
          </div>
          <Link
            href="/student/dashboard"
            className="px-7 py-3.5 bg-white text-[#396953] hover:bg-[#f4f8f5] active:scale-95 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap shadow-xs shrink-0"
          >
            Kirim Aspirasi Sekarang
          </Link>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 7. AKSES CEPAT */}
      {/* ========================================================================= */}
      <section className="container mx-auto max-w-7xl lg:max-w-[1360px] px-4 md:px-6 lg:px-8 py-8 mb-12 border-t border-[#e3ece6] dark:border-[#24342c]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/student/dashboard"
            className="p-6 bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] hover:border-[#468366] hover:-translate-y-0.5 transition-all text-center flex flex-col items-center shadow-xs"
          >
            <span className="text-2xl mb-1.5">📢</span>
            <span className="text-sm font-semibold text-[#2c3831] dark:text-[#dce6e0]">Form Aspirasi</span>
            <span className="text-[11px] text-[#8a9a91] dark:text-[#73887d] mt-0.5">Ajukan usul fasilitas</span>
          </Link>

          <Link
            href="/activities"
            className="p-6 bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] hover:border-[#468366] hover:-translate-y-0.5 transition-all text-center flex flex-col items-center shadow-xs"
          >
            <span className="text-2xl mb-1.5">📅</span>
            <span className="text-sm font-semibold text-[#2c3831] dark:text-[#dce6e0]">Berita Kegiatan</span>
            <span className="text-[11px] text-[#8a9a91] dark:text-[#73887d] mt-0.5">Dokumentasi kegiatan</span>
          </Link>

          <Link
            href="/structure"
            className="p-6 bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] hover:border-[#468366] hover:-translate-y-0.5 transition-all text-center flex flex-col items-center shadow-xs"
          >
            <span className="text-2xl mb-1.5">🤝</span>
            <span className="text-sm font-semibold text-[#2c3831] dark:text-[#dce6e0]">10 Sekbid & Komisi</span>
            <span className="text-[11px] text-[#8a9a91] dark:text-[#73887d] mt-0.5">Susunan pengurus</span>
          </Link>

          <Link
            href="/vision-mission"
            className="p-6 bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] hover:border-[#468366] hover:-translate-y-0.5 transition-all text-center flex flex-col items-center shadow-xs"
          >
            <span className="text-2xl mb-1.5">📜</span>
            <span className="text-sm font-semibold text-[#2c3831] dark:text-[#dce6e0]">Visi & Misi</span>
            <span className="text-[11px] text-[#8a9a91] dark:text-[#73887d] mt-0.5">Arah gerak organisasi</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
