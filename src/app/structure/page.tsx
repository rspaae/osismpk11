'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LeaderProfile {
  name: string;
  role: string;
  badge: string;
  photo?: string;
}

interface TeamGroup {
  id: string | number;
  label: string;
  name: string;
  photo?: string;
  coordinator: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — PIMPINAN SEKOLAH & PEMBINA (SAMA UNTUK OSIS & MPK)
// ═══════════════════════════════════════════════════════════════════════════════
const kepalaSekolah: LeaderProfile = {
  name: "Nama Kepala Sekolah",
  role: "Kepala SMKN 11 Bandung",
  badge: "Kepala Sekolah",
  // photo: "/images/members/kepala-sekolah.jpg",
};

const wakasekKesiswaan: LeaderProfile = {
  name: "Nama Wakasek Kesiswaan",
  role: "Wakasek Bidang Kesiswaan",
  badge: "Kesiswaan",
  // photo: "/images/members/wakasek-kesiswaan.jpg",
};

const pembinaOsisMpk: LeaderProfile = {
  name: "Nama Pembina OSIS-MPK",
  role: "Pembina OSIS & MPK",
  badge: "Pembina",
  // photo: "/images/members/pembina.jpg",
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — OSIS NAVASTRA 2026/2027
// ═══════════════════════════════════════════════════════════════════════════════
const osisKetua: LeaderProfile = {
  name: "Tania Salsabila Putri",
  role: "Ketua Umum OSIS",
  badge: "Ketua OSIS",
  // photo: "/images/members/ketua-osis.jpg",
};

const osisWakil: LeaderProfile = {
  name: "Dzaki Fairuz",
  role: "Wakil Ketua OSIS",
  badge: "Wakil Ketua",
  // photo: "/images/members/wakil-osis.jpg",
};

const osisSekretariat: LeaderProfile[] = [
  {
    name: "Nama Sekretaris 1",
    role: "Sekretaris I",
    badge: "Sekretaris 1",
    // photo: "/images/members/sekre-osis-1.jpg",
  },
  {
    name: "Nama Sekretaris 2",
    role: "Sekretaris II",
    badge: "Sekretaris 2",
    // photo: "/images/members/sekre-osis-2.jpg",
  },
];

const osisKebendaharaan: LeaderProfile[] = [
  {
    name: "Nama Bendahara 1",
    role: "Bendahara I",
    badge: "Bendahara 1",
    // photo: "/images/members/bendahara-osis-1.jpg",
  },
  {
    name: "Nama Bendahara 2",
    role: "Bendahara II",
    badge: "Bendahara 2",
    // photo: "/images/members/bendahara-osis-2.jpg",
  },
];

const sekbidData: TeamGroup[] = [
  { id: 1, label: "Sekbid 1", name: "Keimanan & Ketaqwaan", coordinator: "Nama Koordinator" },
  { id: 2, label: "Sekbid 2", name: "Budi Pekerti & Kepribadian", coordinator: "Nama Koordinator" },
  { id: 3, label: "Sekbid 3", name: "Wawasan Kebangsaan", coordinator: "Nama Koordinator" },
  { id: 4, label: "Sekbid 4", name: "Kepribadian Bangsa", coordinator: "Nama Koordinator" },
  { id: 5, label: "Sekbid 5", name: "Pendidikan Demokrasi", coordinator: "Nama Koordinator" },
  { id: 6, label: "Sekbid 6", name: "Kualitas Jasmani & Kesehatan", coordinator: "Nama Koordinator" },
  { id: 7, label: "Sekbid 7", name: "Seni & Budaya", coordinator: "Nama Koordinator" },
  { id: 8, label: "Sekbid 8", name: "Pembinaan Lingkungan Hidup", coordinator: "Nama Koordinator" },
  { id: 9, label: "Sekbid 9", name: "Teknologi & Informasi", coordinator: "Nama Koordinator" },
  { id: 10, label: "Sekbid 10", name: "Kewirausahaan", coordinator: "Nama Koordinator" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — MPK NAVANDYA 2026/2027
// ═══════════════════════════════════════════════════════════════════════════════
const mpkKetua: LeaderProfile = {
  name: "Niar Almira Achmi",
  role: "Ketua Umum MPK",
  badge: "Ketua MPK",
  // photo: "/images/members/ketua-mpk.jpg",
};

const mpkWakil: LeaderProfile = {
  name: "Muhammad Ilham Romadon",
  role: "Wakil Ketua MPK",
  badge: "Wakil Ketua",
  // photo: "/images/members/wakil-mpk.jpg",
};

const mpkSekretariat: LeaderProfile[] = [
  {
    name: "Nama Sekretaris MPK 1",
    role: "Sekretaris I",
    badge: "Sekretaris 1",
    // photo: "/images/members/sekre-mpk-1.jpg",
  },
  {
    name: "Nama Sekretaris MPK 2",
    role: "Sekretaris II",
    badge: "Sekretaris 2",
    // photo: "/images/members/sekre-mpk-2.jpg",
  },
];

const mpkKebendaharaan: LeaderProfile[] = [
  {
    name: "Nama Bendahara MPK 1",
    role: "Bendahara I",
    badge: "Bendahara 1",
    // photo: "/images/members/bendahara-mpk-1.jpg",
  },
  {
    name: "Nama Bendahara MPK 2",
    role: "Bendahara II",
    badge: "Bendahara 2",
    // photo: "/images/members/bendahara-mpk-2.jpg",
  },
];

const komisiData: TeamGroup[] = [
  { id: "A", label: "Komisi A", name: "Keorganisasian & Hukum", coordinator: "Nama Ketua Komisi A" },
  { id: "B", label: "Komisi B", name: "Aspirasi & Advokasi", coordinator: "Nama Ketua Komisi B" },
  { id: "C", label: "Komisi C", name: "Keuangan & Anggaran", coordinator: "Nama Ketua Komisi C" },
  { id: "D", label: "Komisi D", name: "Pengawasan Program Kerja", coordinator: "Nama Ketua Komisi D" },
];

// ─── Placeholder icons ────────────────────────────────────────────────────────
const placeholderIcons: Record<string, string> = {
  "1": "🕌", "2": "🌟", "3": "🇮🇩", "4": "🤝", "5": "🗳️",
  "6": "🏃", "7": "🎨", "8": "🌿", "9": "💻", "10": "🚀",
  "A": "📜", "B": "📢", "C": "💰", "D": "📋",
};

// ─── Initial Avatar Helper ────────────────────────────────────────────────────
function getInitials(name: string) {
  const clean = name.replace(/Nama/gi, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "11";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// ─── Visual Level Connector ───────────────────────────────────────────────────
function LevelConnector() {
  return (
    <div className="flex justify-center my-6">
      <div className="w-[3px] h-10 bg-gradient-to-b from-emerald-500/30 via-emerald-500/60 to-emerald-500/30 dark:from-emerald-400/30 dark:via-emerald-400/60 dark:to-emerald-400/30 rounded-full" />
    </div>
  );
}

// ─── Big Portrait Leader Card (Gaya SMKN 1 Jakarta: Foto Besar di Atas) ───────
function PortraitLeaderCard({
  profile,
  theme = "emerald",
  className = "",
}: {
  profile: LeaderProfile;
  theme?: "emerald" | "amber" | "gold";
  className?: string;
}) {
  const themeBorder =
    theme === "amber"
      ? "hover:border-amber-400/70 border-amber-500/30 dark:border-amber-500/30"
      : theme === "gold"
      ? "hover:border-yellow-400/70 border-yellow-500/40 dark:border-yellow-500/30"
      : "hover:border-emerald-400/70 border-emerald-600/30 dark:border-emerald-500/30";

  const themeBadge =
    theme === "amber"
      ? "bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-300 border-amber-300 dark:border-amber-700"
      : theme === "gold"
      ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
      : "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass rounded-3xl transition-all duration-300 relative group overflow-hidden border shadow-md hover:shadow-xl hover:-translate-y-2 flex flex-col justify-between h-full ${themeBorder} ${className}`}
    >
      {/* ── Foto Besar Portrait (Gaya osismpk.smkn1jakarta.sch.id) ── */}
      <div className="w-full aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-[#E2F1E8] via-[#EBF4EE] to-[#D5EADF] dark:from-slate-800 dark:to-slate-900 border-b border-black/5 dark:border-white/10">
        {profile.photo ? (
          <Image
            src={profile.photo}
            alt={profile.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          /* Placeholder Portrait Avatar Besar */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center select-none bg-gradient-to-b from-white/40 to-black/5 dark:from-white/5 dark:to-black/30">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/80 dark:bg-slate-800/80 shadow-md border border-white dark:border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
                {getInitials(profile.name)}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
              Foto Profil
            </span>
          </div>
        )}

        {/* Badge Floating di Pojok Foto */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span
            className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${themeBadge}`}
          >
            {profile.badge}
          </span>
        </div>
      </div>

      {/* ── Info Nama & Jabatan di Bawah Foto ── */}
      <div className="p-5 text-center flex flex-col items-center justify-center">
        <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {profile.name}
        </h3>
        <p className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-1">
          {profile.role}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Team Card (Sekbid / Komisi dengan Foto Besar) ────────────────────────────
function TeamCard({
  item,
  index,
  className = "",
}: {
  item: TeamGroup;
  index: number;
  className?: string;
}) {
  const icon = placeholderIcons[String(item.id)] ?? "👥";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.05 }}
      className={`group relative ${className}`}
    >
      <div className="glass p-6 md:p-7 rounded-[2rem] hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 border-white/50 dark:border-white/10 shadow-md hover:shadow-xl hover:-translate-y-2 h-full flex flex-col justify-between">

        {/* Foto Tim / Placeholder */}
        <div className="mb-5 w-full aspect-[4/3] rounded-2xl overflow-hidden relative bg-mint-50 dark:bg-slate-800/60 border border-[#E8E6DC] dark:border-slate-700 shadow-inner">
          {item.photo ? (
            <Image
              src={item.photo}
              alt={`Foto Tim ${item.name}`}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F2FAF5] to-[#F4EEE0] dark:from-slate-800/60 dark:to-slate-900/60">
              <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                {icon}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800/60 dark:text-emerald-400/60">
                Foto Bersama
              </span>
            </div>
          )}
        </div>

        {/* Label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            {item.label}
          </span>
          <div className="flex-1 h-[1px] bg-emerald-600/15" />
        </div>

        {/* Nama Sekbid / Komisi */}
        <h3 className="text-xl font-black leading-tight tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors mb-4">
          {item.name}
        </h3>

        {/* Koordinator */}
        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 border-t border-[#E8E6DC] dark:border-slate-800 pt-3.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate font-black">
            {item.coordinator}
          </span>
        </div>

        {/* Watermark Angka */}
        <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none select-none">
          <span className="text-[7rem] font-black text-slate-900 dark:text-white leading-none">
            {item.id}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function Structure() {
  const [activeOrg, setActiveOrg] = useState<'osis' | 'mpk'>('osis');

  const currentKetua = activeOrg === 'osis' ? osisKetua : mpkKetua;
  const currentWakil = activeOrg === 'osis' ? osisWakil : mpkWakil;
  const currentSekretariat = activeOrg === 'osis' ? osisSekretariat : mpkSekretariat;
  const currentKebendaharaan = activeOrg === 'osis' ? osisKebendaharaan : mpkKebendaharaan;
  const themeColor = activeOrg === 'osis' ? 'emerald' : 'amber';

  return (
    <main className="min-h-screen pt-28 md:pt-36 pb-24 md:pb-36 px-4 md:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-7xl lg:max-w-[1360px]">

        {/* ── HEADER & TITLE ─────────────────────────────────────────────── */}
        <header className="mb-14 text-center max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-wrap items-center justify-center gap-2.5 mb-5"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Navastra — OSIS 2026/2027
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Navandya — MPK 2026/2027
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tighter mb-6"
          >
            Struktur <span className="text-foreground/20">Organisasi</span>
          </motion.h1>

          {/* Org Tab Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex p-1.5 glass rounded-2xl shadow-inner border border-white/40 dark:border-white/10"
          >
            <button
              id="tab-osis"
              onClick={() => setActiveOrg('osis')}
              className={`px-8 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeOrg === 'osis'
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/20'
                  : 'text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              🟢 OSIS — Navastra
            </button>
            <button
              id="tab-mpk"
              onClick={() => setActiveOrg('mpk')}
              className={`px-8 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeOrg === 'mpk'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20'
                  : 'text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              🟡 MPK — Navandya
            </button>
          </motion.div>
        </header>

        {/* ── TINGKAT 1: KEPALA SEKOLAH ─────────────────────────────────────── */}
        <section className="max-w-xs sm:max-w-sm mx-auto">
          <PortraitLeaderCard profile={kepalaSekolah} theme="gold" />
        </section>

        <LevelConnector />

        {/* ── TINGKAT 2: KESISWAAN & PEMBINA (SEJAJAR & SAMA UNTUK OSIS & MPK) ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <PortraitLeaderCard profile={wakasekKesiswaan} theme="emerald" />
          <PortraitLeaderCard profile={pembinaOsisMpk} theme="emerald" />
        </section>

        <LevelConnector />

        {/* ── TINGKAT 3: KETUA & WAKIL KETUA ──────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOrg + "-ketua"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <PortraitLeaderCard profile={currentKetua} theme={themeColor} />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOrg + "-wakil"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <PortraitLeaderCard profile={currentWakil} theme={themeColor} />
            </motion.div>
          </AnimatePresence>
        </section>

        <LevelConnector />

        {/* ── TINGKAT 4: SEKRETARIS & BENDAHARA ───────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {currentSekretariat.map((sek, idx) => (
              <motion.div
                key={activeOrg + "-sek-" + idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <PortraitLeaderCard profile={sek} theme={themeColor} />
              </motion.div>
            ))}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {currentKebendaharaan.map((ben, idx) => (
              <motion.div
                key={activeOrg + "-ben-" + idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <PortraitLeaderCard profile={ben} theme={themeColor} />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        <LevelConnector />

        {/* ── TINGKAT 5: SEKBID (OSIS) / KOMISI (MPK) ─────────────────────── */}
        <section className="mt-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {activeOrg === 'osis' ? '10 Seksi Bidang' : '4 Komisi Kerja'}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {activeOrg === 'osis' ? (
              <motion.div
                key="osis-sekbid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {sekbidData.map((item, i) => (
                  <TeamCard
                    key={item.id}
                    item={item}
                    index={i}
                    className={item.id === 10 ? "lg:col-start-2" : ""}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="mpk-komisi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto"
              >
                {komisiData.map((item, i) => (
                  <TeamCard key={item.id} item={item} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>
    </main>
  );
}
