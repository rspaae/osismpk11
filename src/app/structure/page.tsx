'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function Structure() {
    const structure = [
        {
            level: "Pimpinan",
            roles: [
                { title: "Ketua Umum", desc: "Penanggung jawab utama seluruh program kerja OSIS.", icon: "👑" },
                { title: "Ketua MPK", desc: "Pengawas dan evaluator kinerja pengurus OSIS.", icon: "🏛️" }
            ]
        },
        {
            level: "Inti",
            roles: [
                { title: "Sekretaris", desc: "Manajemen administrasi dan persuratan organisasi.", icon: "📝" },
                { title: "Bendahara", desc: "Pengelolaan keuangan dan transparansi anggaran.", icon: "💰" }
            ]
        }
    ];

    return (
        <main className="min-h-screen pt-32 md:pt-44 pb-20 md:pb-32 px-4 md:px-6 bg-background">
            <div className="container mx-auto">
                <header className="mb-16 md:mb-32 text-center max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-2 glass rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mb-6"
                    >
                        Pilar Pergerakan Kami
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-8"
                    >
                        Struktur <span className="text-foreground/20">Organisasi</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-foreground/50 text-xl font-medium italic"
                    >
                        "Sinergi antar pilar untuk mewujudkan visi yang besar."
                    </motion.p>
                </header>

                <div className="flex flex-col gap-20 md:gap-32">
                    {structure.map((group, idx) => (
                        <section key={idx} className="relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 glass rounded-full text-xs font-black uppercase tracking-[0.3em] text-brand-primary z-10">
                                Level {group.level}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto border-t border-border pt-16">
                                {group.roles.map((role, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass p-8 md:p-10 rounded-2xl md:rounded-[2.5rem] hover:bg-white/50 dark:hover:bg-white/5 transition-all group relative overflow-hidden"
                                    >
                                        <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{role.icon}</div>
                                        <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-brand-primary transition-colors">{role.title}</h3>
                                        <p className="text-foreground/50 leading-relaxed font-medium italic">
                                            {role.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    ))}

                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center pt-6 md:pt-10"
                    >
                        <div className="inline-block p-8 md:p-16 glass rounded-[2rem] md:rounded-[3rem] border-white/40 dark:border-white/10 shadow-3xl shadow-brand-primary/5 max-w-3xl">
                            <h3 className="text-3xl font-black tracking-tight mb-6">Sekretaris Bidang (Sekbid)</h3>
                            <p className="text-foreground/50 font-medium text-lg italic mb-10 leading-relaxed">
                                Garda terdepan pelaksana program kerja teknis yang terbagi dalam 10 bidang minat dan kontribusi siswa.
                            </p>
                            <Link
                                href="/departments"
                                className="px-10 py-4 bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:shadow-2xl hover:shadow-brand-primary/30 transition-all inline-block"
                            >
                                Lihat Detail Sekbid
                            </Link>
                        </div>
                    </motion.section>
                </div>
            </div>
        </main>
    );
}
