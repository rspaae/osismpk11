"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Aspiration {
    id: string;
    title: string;
    content: string;
    category: string;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export default function AdminAspirations() {
    const { data: session, status } = useSession();
    const [aspirations, setAspirations] = useState<Aspiration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchAspirations();
        }
    }, [session]);

    const fetchAspirations = async () => {
        try {
            const res = await fetch("/api/aspirations");
            const data = await res.json();
            setAspirations(data);
        } catch (error) {
            console.error("Error fetching aspirations:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/aspirations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setAspirations(aspirations.map(a => a.id === id ? { ...a, status: newStatus } : a));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (status === "loading") return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!session) redirect("/login");
    if (!['ADMINISTRATOR', 'PEMBINA', 'DEWAN'].includes(session.user.role as any)) redirect("/student/dashboard");

    return (
        <main className="min-h-screen pt-24 md:pt-44 pb-12 md:pb-32 px-4 md:px-6 bg-background">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-12 md:mb-20 text-center md:text-left">
                    <h1 className="text-3xl md:text-6xl font-black tracking-tighter mb-4 text-foreground leading-tight">Suara Siswa</h1>
                    <p className="text-foreground/50 font-medium text-base md:text-lg italic">Kelola aspirasi dan masukan dari seluruh warga sekolah.</p>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-foreground/20 font-black uppercase tracking-widest italic">Memuat data...</div>
                ) : (
                    <div className="grid gap-10">
                        <AnimatePresence>
                            {aspirations.map((asp, i) => (
                                <motion.div
                                    key={asp.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border-[1.5px] border-border-strong/20 hover:border-brand-primary/40 transition-all shadow-3xl shadow-brand-primary/5 relative overflow-hidden group"
                                >
                                    <div className="flex flex-col lg:flex-row justify-between gap-10 md:gap-14 items-start">
                                        <div className="flex-1 w-full">
                                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                                <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${asp.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                    asp.status === 'REVIEWED' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                                        'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                    }`}>
                                                    {asp.status}
                                                </span>
                                                <span className="px-6 py-2 rounded-full text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] border border-border/50 bg-foreground/[0.02]">
                                                    {asp.category}
                                                </span>
                                            </div>

                                            <h2 className="text-2xl md:text-3xl font-black mb-6 tracking-tight group-hover:text-brand-primary transition-colors leading-tight">
                                                {asp.title}
                                            </h2>

                                            <div className="relative mb-10">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary/20 rounded-full" />
                                                <p className="text-foreground/70 leading-relaxed font-medium pl-8 py-2 italic text-lg">
                                                    "{asp.content}"
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-5 p-5 glass rounded-[2rem] bg-foreground/[0.02] border-border/30 w-fit">
                                                <div className="w-12 h-12 rounded-2xl bg-brand-primary shadow-lg shadow-brand-primary/20 flex items-center justify-center text-white text-lg font-black">
                                                    {asp.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-foreground font-black uppercase text-[10px] tracking-[0.2em] mb-1">{asp.user.name}</p>
                                                    <p className="text-[10px] font-bold text-foreground/40 uppercase">{new Date(asp.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 justify-center min-w-[220px] w-full lg:w-auto pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border/20 lg:pl-10">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 text-center mb-4 w-full sm:hidden lg:block">Navigasi Status</p>
                                            <button
                                                onClick={() => updateStatus(asp.id, 'PENDING')}
                                                className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${asp.status === 'PENDING' ? 'bg-amber-500 text-white border-amber-500 shadow-xl shadow-amber-500/20 scale-105' : 'glass border-transparent hover:border-amber-500/30 hover:bg-amber-500/5'}`}
                                            >
                                                Set Pending
                                            </button>
                                            <button
                                                onClick={() => updateStatus(asp.id, 'REVIEWED')}
                                                className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${asp.status === 'REVIEWED' ? 'bg-blue-500 text-white border-blue-500 shadow-xl shadow-blue-500/20 scale-105' : 'glass border-transparent hover:border-blue-500/30 hover:bg-blue-500/5'}`}
                                            >
                                                Set Reviewed
                                            </button>
                                            <button
                                                onClick={() => updateStatus(asp.id, 'COMPLETED')}
                                                className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${asp.status === 'COMPLETED' ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20 scale-105' : 'glass border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/5'}`}
                                            >
                                                Set Completed
                                            </button>
                                        </div>
                                    </div>

                                    {/* Decor */}
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full -z-10 group-hover:bg-brand-primary/10 transition-colors" />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {aspirations.length === 0 && (
                            <div className="text-center py-40 glass rounded-[3rem] text-foreground/20 font-black uppercase tracking-[0.3em] italic">
                                Belum ada aspirasi yang masuk.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
