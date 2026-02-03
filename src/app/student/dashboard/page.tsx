'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import { motion, AnimatePresence } from "framer-motion";
import AspirationForm from "@/components/AspirationForm";
import Image from "next/image";

export default function StudentDashboard() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        redirect("/login");
    }

    const user = session.user;

    return (
        <main className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 bg-brand-soft/50 dark:bg-background">
            <div className="container mx-auto max-w-7xl">
                {/* Header Section */}
                <header className="mb-8 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-foreground">Dashboard Siswa</h1>
                        <p className="text-foreground/50 font-medium text-lg italic">Selamat datang di pusat kendali inspirasi Anda, {user?.name?.split(' ')[0]}.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <SignOutButton />
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Digital Student card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-5"
                    >
                        <div className="relative group perspective-1000">
                            <div className="relative glass premium-border p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden border-white/40 dark:border-white/10 shadow-3xl shadow-brand-primary/10 transition-all duration-500 group-hover:rotate-y-6">
                                {/* Card Background Decor */}
                                <div className="absolute top-[-20%] right-[-10%] w-[150%] h-[150%] bg-gradient-to-br from-brand-primary via-blue-900 to-brand-primary opacity-90 -z-10" />
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl -z-10" />

                                <div className="flex justify-between items-start mb-10 md:mb-16">
                                    <div>
                                        <p className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-left">Kartu Identitas Digital</p>
                                        <h2 className="text-white text-xl md:text-3xl font-black tracking-tight text-left">SMKN 11 Bandung</h2>
                                    </div>
                                    <div className="logo-orb w-16 h-16 md:w-20 md:h-20 p-2 shadow-2xl bg-white border-white/20">
                                        <Image
                                            src="/images/logos/smkn11.jpg"
                                            alt="SMKN 11"
                                            width={60}
                                            height={60}
                                            className="object-contain"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 md:gap-8 items-center mb-10 md:mb-16">
                                    <div className="logo-orb w-20 h-20 md:w-28 md:h-28 p-3 shadow-2xl border-white/20">
                                        <Image
                                            src={user?.role === 'MPK_OFFICER' ? "/images/logos/mpk.jpg" : "/images/logos/osis.jpg"}
                                            alt="Org Logo"
                                            width={100}
                                            height={100}
                                            className="object-contain relative z-10 filter drop-shadow-2xl"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white text-xl md:text-3xl font-black tracking-tighter mb-2 uppercase break-words leading-[0.9]">{user?.name}</p>
                                        <div className="px-4 py-1.5 bg-brand-accent text-brand-primary text-[9px] md:text-[11px] font-black rounded-full inline-block uppercase tracking-widest shadow-xl shadow-brand-accent/20">
                                            {
                                                user?.role === 'ADMINISTRATOR' ? 'Sistem Admin' :
                                                    user?.role === 'PEMBINA' ? 'Pembina OSIS-MPK' :
                                                        user?.role === 'DEWAN' ? 'Dewan Pengurus' :
                                                            user?.role === 'OSIS_OFFICER' ? 'Pengurus OSIS' :
                                                                user?.role === 'MPK_OFFICER' ? 'Pengurus MPK' : 'Siswa Aktif'
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Email Institusi</p>
                                        <p className="text-white font-bold text-sm tracking-wide">{user?.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">ID Siswa</p>
                                        <p className="text-white font-black text-xl italic">{user?.id?.substring(0, 8).toUpperCase()}</p>
                                    </div>
                                </div>

                                {/* Holographic Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Content Grid */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: "Status Aktivitas", value: "Aktif", icon: "✨", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            { title: "Point Kontribusi", value: "145", icon: "🏆", color: "text-amber-500", bg: "bg-amber-500/10" },
                            { title: "Agenda Terdekat", value: "Rapat Mingguan", icon: "📅", color: "text-blue-500", bg: "bg-blue-500/10" },
                            { title: "Pesan Baru", value: "3 Pesan", icon: "✉️", color: "text-purple-500", bg: "bg-purple-500/10" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="group glass p-8 rounded-[2.5rem] hover:bg-white/80 dark:hover:bg-white/5 transition-all"
                            >
                                <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-6 shadow-glow transition-transform group-hover:scale-110`}>
                                    {stat.icon}
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/50 mb-2">{stat.title}</p>
                                <p className="text-3xl font-black tracking-tighter text-foreground leading-none">{stat.value}</p>
                            </motion.div>
                        ))}

                        {/* Announcements Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="md:col-span-2 glass p-10 rounded-[2.5rem] border-white/50"
                        >
                            <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3 text-foreground">
                                <span className="w-2 h-6 bg-brand-primary rounded-full" />
                                Pengumuman Terbaru
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { date: "2 Feb", text: "Registrasi LDK 2026 telah dibuka untuk seluruh siswa." },
                                    { date: "31 Jan", text: "Hasil pemilihan Ketua OSIS periode 2026 sudah dapat dilihat." },
                                ].map((news, i) => (
                                    <div key={i} className="flex gap-6 items-start group cursor-pointer">
                                        <div className="px-3 py-2 bg-foreground/5 rounded-xl text-[11px] font-black text-foreground/40 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                            {news.date}
                                        </div>
                                        <p className="text-sm font-bold text-foreground/60 leading-relaxed group-hover:text-foreground transition-all">
                                            {news.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                    {/* Aspiration Section - Only for Students */}
                    {user?.role === 'STUDENT' && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="lg:col-span-12 mt-8 md:mt-16"
                        >
                            <AspirationForm />
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}
