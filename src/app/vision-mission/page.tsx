'use client';

import { motion } from "framer-motion";
import Image from "next/image";

export default function VisionMission() {
    return (
        <main className="min-h-screen pt-32 md:pt-44 pb-20 md:pb-32 px-4 md:px-6 bg-background">
            <div className="container mx-auto max-w-5xl">
                <header className="mb-16 md:mb-32 text-center max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-6 mb-12"
                    >
                        <div className="logo-orb w-14 h-14 p-2 shadow-xl">
                            <Image src="/images/logos/smkn11.jpg" alt="SMKN 11" width={50} height={50} className="object-contain" />
                        </div>
                        <div className="h-10 w-[1px] bg-border-strong/20 rotate-12" />
                        <div className="flex gap-4">
                            <div className="logo-orb w-16 h-16 p-2 shadow-xl hover:scale-110 transition-transform">
                                <Image src="/images/logos/osis.jpg" alt="OSIS" width={55} height={55} className="object-contain" />
                            </div>
                            <div className="logo-orb w-16 h-16 p-2 shadow-xl hover:scale-110 transition-transform">
                                <Image src="/images/logos/mpk.jpg" alt="MPK" width={55} height={55} className="object-contain" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-2 glass rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mb-6"
                    >
                        Komitmen & Filosofi
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-8"
                    >
                        Visi & <span className="text-foreground/20">Misi Kami</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-foreground/70 text-xl font-medium italic"
                    >
                        "Landasan fundamental dalam setiap langkah pengabdian."
                    </motion.p>
                </header>

                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 md:mb-32"
                >
                    <div className="glass p-8 md:p-16 lg:p-24 rounded-[2rem] md:rounded-[3.5rem] relative overflow-hidden border-white/40 dark:border-white/10 shadow-3xl shadow-brand-primary/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-accent/5 blur-[80px] rounded-full" />

                        <div className="inline-block px-6 py-2 mb-12 text-[10px] font-black tracking-[0.3em] uppercase bg-brand-primary text-white rounded-xl shadow-xl shadow-brand-primary/20">
                            Visi Utama
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black leading-[1.2] tracking-tight text-foreground/90 italic">
                            &quot;Menjadikan OSIS-MPK sebagai wadah kolaborasi inovatif yang berbasis pada integritas, kreativitas, dan pengabdian demi menciptakan ekosistem sekolah yang harmonis serta inklusif.&quot;
                        </h2>
                    </div>
                </motion.section>

                <section>
                    <div className="flex items-center gap-6 mb-16">
                        <div className="w-16 h-[2px] bg-brand-primary" />
                        <div className="inline-block px-6 py-2 text-[10px] font-black tracking-[0.3em] uppercase bg-brand-secondary text-white rounded-xl">
                            Misi Strategis
                        </div>
                    </div>

                    <div className="grid gap-10">
                        {[
                            {
                                id: "01",
                                title: "Sinergi Organisasi",
                                text: "Mewujudkan koordinasi yang solid antara pengurus OSIS-MPK dengan seluruh organisasi sekolah."
                            },
                            {
                                id: "02",
                                title: "Digitalisasi Aspirasi",
                                text: "Memaksimalkan penyerapan aspirasi siswa melalui platform digital yang interaktif dan transparan."
                            },
                            {
                                id: "03",
                                title: "Ekosistem Kreatif",
                                text: "Menyelenggarakan program kerja kreatif yang mendukung pengembangan minat, bakat, dan karakter siswa."
                            },
                            {
                                id: "04",
                                title: "Jejaring Strategis",
                                text: "Membangun hubungan eksternal yang strategis dengan berbagai pihak untuk memperluas jejaring siswa."
                            },
                            {
                                id: "05",
                                title: "Karakter Unggul",
                                text: "Mengedepankan nilai-nilai kedisplinan dan tanggung jawab dalam setiap pengabdian kepada sekolah."
                            }
                        ].map((misi, i) => (
                            <motion.div
                                key={misi.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-6 md:p-10 glass rounded-2xl md:rounded-[2.5rem] flex flex-col md:flex-row gap-8 md:gap-10 items-start hover:bg-white/80 dark:hover:bg-white/5 transition-all outline outline-1 outline-transparent hover:outline-brand-primary/10"
                            >
                                <span className="text-6xl font-black text-foreground/5 group-hover:text-brand-primary transition-colors leading-none">
                                    {misi.id}
                                </span>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight mb-3 text-foreground/90">{misi.title}</h3>
                                    <p className="text-lg text-foreground/50 leading-relaxed font-medium italic">
                                        {misi.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
