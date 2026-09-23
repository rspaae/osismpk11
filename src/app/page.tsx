'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'osis' | 'mpk'>('osis');

  const osisProker = [
    {
      title: "Porseni XI",
      tag: "Olahraga & Seni",
      schedule: "Mei 2026",
      desc: "Kompetisi olahraga dan pentas seni antar kelas se-SMKN 11 Bandung.",
      icon: "🏆"
    },
    {
      title: "LDK Siswa",
      tag: "Kaderisasi",
      schedule: "Januari 2026",
      desc: "Pelatihan kepemimpinan dan tata kelola organisasi bagi kader pengurus.",
      icon: "⚡"
    },
    {
      title: "ELEVEN Fest",
      tag: "Karya Kejuruan",
      schedule: "Agustus 2026",
      desc: "Eksibisi teknologi kejuruan dan pameran wirausaha kreatif siswa.",
      icon: "🚀"
    },
    {
      title: "OSIS Peduli",
      tag: "Sosial & Lingkungan",
      schedule: "Bulanan",
      desc: "Aksi bakti sosial kemanusiaan dan gerakan pelestarian lingkungan sekolah.",
      icon: "🌱"
    }
  ];

  const mpkProker = [
    {
      title: "Jaring Aspirasi Siswa",
      tag: "Advokasi",
      schedule: "Setiap Pekan",
      desc: "Penyerapan usul, keluhan fasilitas, dan aspirasi siswa secara berkala.",
      icon: "📢"
    },
    {
      title: "Sidang Pleno Triwulan",
      tag: "Legislatif",
      schedule: "Triwulan",
      desc: "Evaluasi dan pengawasan realisasi program kerja OSIS secara transparan.",
      icon: "⚖️"
    },
    {
      title: "Musyawarah Perwakilan Kelas",
      tag: "Musyawarah",
      schedule: "Semesteran",
      desc: "Forum perwakilan seluruh ketua kelas untuk merumuskan kebijakan siswa.",
      icon: "🏛️"
    },
    {
      title: "Pemilihan Ketua OSIS & MPK",
      tag: "Demokrasi",
      schedule: "Oktober 2026",
      desc: "Pesta demokrasi pemilihan pemimpin baru berbasis e-voting terintegrasi.",
      icon: "🗳️"
    }
  ];

  const latestNews = [
    {
      id: 1,
      title: "Latihan Dasar Kepemimpinan (LDK) 2026 Sukses Digelar",
      category: "Kepemimpinan",
      date: "25 Jan 2026",
      desc: "Sebanyak 80 peserta mengikuti pembekalan manajemen organisasi dan etika kepemimpinan.",
    },
    {
      id: 2,
      title: "Kanal Aspirasi Digital OSIS-MPK Resmi Beroperasi",
      category: "Pengumuman",
      date: "08 Feb 2026",
      desc: "Seluruh siswa kini dapat menyampaikan saran fasilitas sekolah secara daring dan transparan.",
    },
    {
      id: 3,
      title: "Persiapan Porseni XI: Pendaftaran Cabang Olahraga Dibuka",
      category: "Event",
      date: "14 Feb 2026",
      desc: "Rilis resmi cabang perlombaan olahraga dan kesenian untuk semester genap.",
    }
  ];

  const sampleAspirations = [
    {
      category: "Fasilitas",
      title: "Perbaikan Stopkontak & Proyektor Lab Komputer",
      status: "Selesai",
      statusColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      response: "Telah diperbaiki oleh Tim Sarpras Sekolah pada 10 Feb 2026."
    },
    {
      category: "Kegiatan",
      title: "Penambahan Jam Latihan Ekstrakurikuler Seni Musik",
      status: "Disetujui",
      statusColor: "bg-teal-100 text-teal-900 border-teal-300",
      response: "Disetujui Pembina untuk hari Rabu & Jumat sore."
    },
    {
      category: "Lingkungan",
      title: "Penyediaan Tempat Sampah Daur Ulang di Selasar Gedung B",
      status: "Proses",
      statusColor: "bg-amber-100 text-amber-900 border-amber-300",
      response: "Dalam proses pengadaan bersama Sekbid 8 (Lingkungan Hidup)."
    }
  ];

  return (
    <main className="min-h-screen bg-[#FDFCF7] dark:bg-[#0F1914] text-foreground font-sans">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Foto Sekolah Terlihat Jelas & Nyata) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 md:pt-36 pb-20 md:pb-28 px-4 md:px-6 overflow-hidden">
        {/* Background School Photo with Visible Layering */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Keluarga Besar OSIS MPK SMKN 11 Bandung"
            fill
            priority
            quality={100}
            unoptimized
            className="object-cover object-center filter brightness-[0.78] contrast-[1.05]"
          />
          {/* Mint-Cream Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCF7] via-slate-950/55 to-slate-950/75 dark:from-[#0F1914] z-10" />
        </div>

        <div className="container mx-auto max-w-4xl flex flex-col items-center text-center relative z-20">
          {/* 3-Logo Capsule Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center gap-3 sm:gap-4 px-5 sm:px-6 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-full border border-emerald-200/90 dark:border-emerald-800/80 shadow-md">
              <div className="w-8 h-8 sm:w-9 sm:h-9 relative">
                <Image src="/images/logos/mpk.jpg" alt="MPK SMKN 11" fill className="object-contain rounded-full" />
              </div>
              <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 relative">
                <Image src="/images/logos/smkn11.jpg" alt="SMKN 11" fill className="object-contain rounded-full" />
              </div>
              <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 relative">
                <Image src="/images/logos/osis.jpg" alt="OSIS SMKN 11" fill className="object-contain rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Angkatan Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-5 flex flex-wrap items-center justify-center gap-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/60 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Navastra — OSIS SMKN 11 Bandung</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100/95 dark:bg-amber-950/90 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Navandya — MPK SMKN 11 Bandung</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 tracking-tight leading-tight drop-shadow-md"
          >
            Membangun Inspirasi, <br />
            <span className="text-emerald-300 drop-shadow">Mewujudkan Aksi Nyata.</span>
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl text-sm sm:text-base md:text-lg text-slate-100 drop-shadow mb-8 leading-relaxed font-normal"
          >
            Pusat informasi resmi, dokumentasi kegiatan, dan ruang aspirasi terpadu seluruh siswa SMKN 11 Bandung.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto"
          >
            <Link
              href="/student/dashboard"
              className="px-6 sm:px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-[1.02]"
            >
              📢 Sampaikan Aspirasi
            </Link>
            <Link
              href="/activities"
              className="px-6 sm:px-8 py-3.5 bg-white/95 hover:bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-[1.02]"
            >
              Berita & Kegiatan
            </Link>
            <Link
              href="/structure"
              className="px-6 sm:px-8 py-3.5 bg-slate-900/70 hover:bg-slate-900 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Struktur Organisasi
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS SECTION (Ringkas & Informatif) */}
      {/* ========================================================================= */}
      <section className="container mx-auto max-w-5xl px-4 md:px-6 -mt-8 relative z-30 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-[#E8E6DC] dark:border-slate-800 shadow-sm">
          <div className="text-center p-3">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-800 dark:text-emerald-400 block">1.800+</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Siswa Terlayani</span>
          </div>
          <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-800 dark:text-emerald-400 block">10</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Seksi Bidang OSIS</span>
          </div>
          <div className="text-center p-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-800 dark:text-emerald-400 block">35+</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Program Kerja</span>
          </div>
          <div className="text-center p-3 border-t md:border-t-0 border-l border-slate-100 dark:border-slate-800">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-800 dark:text-emerald-400 block">98%</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Aspirasi Ditindak</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SHOWCASE FOTO KELUARGA BESAR OSIS & MPK SMKN 11 */}
      {/* ========================================================================= */}
      <section className="container mx-auto max-w-5xl px-4 md:px-6 py-8 mb-8">
        <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-[#E8E6DC] dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-1">
                Dokumentasi
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                Keluarga Besar OSIS & MPK SMKN 11 Bandung
              </h2>
            </div>
            <Link
              href="/structure"
              className="text-sm font-bold text-emerald-800 dark:text-emerald-400 hover:underline shrink-0"
            >
              Lihat Susunan Pengurus →
            </Link>
          </div>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
            <Image
              src="/images/hero-bg.jpg"
              alt="Foto Bersama Pengurus OSIS MPK SMKN 11 Bandung"
              fill
              unoptimized
              className="object-cover object-center hover:scale-105 transition-transform duration-500"
            />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-center mt-3 font-medium">
            Foto bersama pengurus OSIS & MPK SMKN 11 Bandung periode 2026/2027.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SAMBUTAN PIMPINAN (Clean Spotlight) */}
      {/* ========================================================================= */}
      <section className="container mx-auto max-w-5xl px-4 md:px-6 py-8">
        <div className="text-center mb-8">
          <span className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-1">
            Pimpinan Organisasi
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Pimpinan MPK & OSIS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MPK */}
          <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-[#E8E6DC] dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-xl font-bold shadow-sm">
                    ⚖️
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                      Badan Legislatif
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">MPK SMKN 11</h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300/60 dark:border-amber-800/60">
                  Navandya · 2026/2027
                </span>
              </div>

              {/* Duo Ketua & Wakil (Portrait Cards) */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Ketua MPK */}
                <div className="rounded-2xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-100/80 dark:border-slate-700/60 overflow-hidden flex flex-col group/card shadow-sm">
                  <div className="w-full aspect-[4/5] bg-gradient-to-br from-amber-100/60 to-amber-200/60 dark:from-amber-900/30 dark:to-slate-800 flex flex-col items-center justify-center relative p-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/85 dark:bg-slate-800/85 flex items-center justify-center font-extrabold text-amber-900 dark:text-amber-200 text-xl shadow-sm border border-amber-200/60 dark:border-slate-700">
                      KM
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Ketua MPK
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Nama Ketua MPK
                    </h4>
                  </div>
                </div>

                {/* Wakil Ketua MPK */}
                <div className="rounded-2xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-100/80 dark:border-slate-700/60 overflow-hidden flex flex-col group/card shadow-sm">
                  <div className="w-full aspect-[4/5] bg-gradient-to-br from-amber-100/60 to-amber-200/60 dark:from-amber-900/30 dark:to-slate-800 flex flex-col items-center justify-center relative p-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/85 dark:bg-slate-800/85 flex items-center justify-center font-extrabold text-amber-900 dark:text-amber-200 text-xl shadow-sm border border-amber-200/60 dark:border-slate-700">
                      WM
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Wakil Ketua MPK
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Nama Wakil MPK
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-5">
                "MPK bertugas menjembatani suara dan aspirasi siswa secara adil, kritis, dan transparan dalam mengawal kemajuan sekolah."
              </p>
            </div>
            <Link
              href="/structure"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 group-hover:translate-x-0.5 transition-transform"
            >
              Lihat Struktur & Komisi MPK →
            </Link>
          </div>

          {/* OSIS */}
          <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-[#E8E6DC] dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-xl font-bold shadow-sm">
                    ⚡
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Badan Eksekutif
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">OSIS SMKN 11</h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300/60 dark:border-emerald-800/60">
                  Navastra · 2026/2027
                </span>
              </div>

              {/* Duo Ketua & Wakil (Portrait Cards) */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Ketua OSIS */}
                <div className="rounded-2xl bg-emerald-50/40 dark:bg-slate-800/60 border border-emerald-100/80 dark:border-slate-700/60 overflow-hidden flex flex-col group/card shadow-sm">
                  <div className="w-full aspect-[4/5] bg-gradient-to-br from-emerald-100/60 to-emerald-200/60 dark:from-emerald-900/30 dark:to-slate-800 flex flex-col items-center justify-center relative p-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/85 dark:bg-slate-800/85 flex items-center justify-center font-extrabold text-emerald-900 dark:text-emerald-200 text-xl shadow-sm border border-emerald-200/60 dark:border-slate-700">
                      KO
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Ketua OSIS
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Nama Ketua OSIS
                    </h4>
                  </div>
                </div>

                {/* Wakil Ketua OSIS */}
                <div className="rounded-2xl bg-emerald-50/40 dark:bg-slate-800/60 border border-emerald-100/80 dark:border-slate-700/60 overflow-hidden flex flex-col group/card shadow-sm">
                  <div className="w-full aspect-[4/5] bg-gradient-to-br from-emerald-100/60 to-emerald-200/60 dark:from-emerald-900/30 dark:to-slate-800 flex flex-col items-center justify-center relative p-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/85 dark:bg-slate-800/85 flex items-center justify-center font-extrabold text-emerald-900 dark:text-emerald-200 text-xl shadow-sm border border-emerald-200/60 dark:border-slate-700">
                      WO
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Wakil Ketua OSIS
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Nama Wakil OSIS
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-5">
                "Bersama 10 Sekbid, kami berkomitmen menghadirkan program kerja kreatif, inklusif, dan berdampak nyata bagi seluruh siswa."
              </p>
            </div>
            <Link
              href="/structure"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 group-hover:translate-x-0.5 transition-transform"
            >
              Lihat Struktur & 10 Sekbid OSIS →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PROGRAM KERJA (Sederhana, Bersih, Nyaman Dibaca) */}
      {/* ========================================================================= */}
      <section className="container mx-auto max-w-5xl px-4 md:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Program Kerja
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-1">
              Rencana aksi dan agenda kegiatan OSIS & MPK SMKN 11 Bandung
            </p>
          </div>

          <div className="inline-flex p-1.5 bg-[#F4EEE0] dark:bg-slate-800 rounded-2xl border border-[#E8E6DC] dark:border-slate-700">
            <button
              onClick={() => setActiveTab('osis')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'osis'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              OSIS (Navastra)
            </button>
            <button
              onClick={() => setActiveTab('mpk')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'mpk'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              MPK (Navandya)
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {(activeTab === 'osis' ? osisProker : mpkProker).map((item, i) => (
              <div
                key={i}
                className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-[#E8E6DC] dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                      {item.schedule}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                    {item.tag}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ========================================================================= */}
      {/* 6. BERITA & DOKUMENTASI TERKINI */}
      {/* ========================================================================= */}
      <section className="container mx-auto max-w-5xl px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Berita & Dokumentasi
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-1">
              Rangkuman kegiatan terbaru dan informasi resmi sekolah
            </p>
          </div>
          <Link
            href="/activities"
            className="text-sm font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((news) => (
            <article
              key={news.id}
              className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-[#E8E6DC] dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    {news.category}
                  </span>
                  <span>{news.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {news.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  {news.desc}
                </p>
              </div>
              <Link
                href="/activities"
                className="text-sm font-bold text-emerald-800 dark:text-emerald-400 hover:underline mt-auto"
              >
                Baca Selengkapnya →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TRANSPARANSI SUARA SISWA */}
      {/* ========================================================================= */}
      <section className="container mx-auto max-w-5xl px-4 md:px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Suara Siswa & Tindak Lanjut
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-1">
            Transparansi respon dan advokasi fasilitas sekolah oleh OSIS-MPK
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {sampleAspirations.map((asp, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-[#E8E6DC] dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                    {asp.category}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${asp.statusColor}`}>
                    {asp.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3 leading-snug">
                  "{asp.title}"
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 bg-emerald-50/60 dark:bg-slate-800/60 p-4 rounded-xl border border-emerald-100 dark:border-slate-700 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-1">Tanggapan:</strong>
                  {asp.response}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="p-8 md:p-10 bg-emerald-800 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-lg">
          <div>
            <h3 className="text-xl md:text-2xl font-black mb-1.5">Ada Usulan atau Keluhan Fasilitas?</h3>
            <p className="text-base text-emerald-100">
              Sampaikan aspirasimu secara terbuka atau anonim langsung ke pengurus OSIS-MPK.
            </p>
          </div>
          <Link
            href="/student/dashboard"
            className="px-7 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 text-sm font-bold rounded-xl transition-all whitespace-nowrap shadow-sm shrink-0"
          >
            Kirim Aspirasi Sekarang
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. AKSES CEPAT (Quick Hub Tiles) */}
      {/* ========================================================================= */}
      <section className="container mx-auto max-w-5xl px-4 md:px-6 py-10 mb-16 border-t border-[#E8E6DC] dark:border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/student/dashboard"
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-[#E8E6DC] dark:border-slate-800 hover:border-emerald-600 transition-all text-center flex flex-col items-center shadow-sm"
          >
            <span className="text-3xl mb-2">📢</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">Form Aspirasi</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ajukan usul fasilitas</span>
          </Link>

          <Link
            href="/activities"
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-[#E8E6DC] dark:border-slate-800 hover:border-emerald-600 transition-all text-center flex flex-col items-center shadow-sm"
          >
            <span className="text-3xl mb-2">📅</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">Berita Kegiatan</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">Dokumentasi kegiatan</span>
          </Link>

          <Link
            href="/structure"
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-[#E8E6DC] dark:border-slate-800 hover:border-emerald-600 transition-all text-center flex flex-col items-center shadow-sm"
          >
            <span className="text-3xl mb-2">🤝</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">10 Sekbid & Komisi</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">Susunan pengurus</span>
          </Link>

          <Link
            href="/vision-mission"
            className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-[#E8E6DC] dark:border-slate-800 hover:border-emerald-600 transition-all text-center flex flex-col items-center shadow-sm"
          >
            <span className="text-3xl mb-2">📜</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">Visi & Misi</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">Arah gerak organisasi</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
