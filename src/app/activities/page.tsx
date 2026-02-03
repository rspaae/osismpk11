'use client';

import { motion } from "framer-motion";

export default function Activities() {
    const posts = [
        {
            id: 1,
            title: "Latihan Dasar Kepemimpinan (LDK) 2026",
            date: "25 Jan 2026",
            category: "Kepemimpinan",
            desc: "Membentuk karakter pemimpin masa depan yang tangguh, berintegritas, dan inovatif melalui serangkaian simulasi aksi nyata.",
            color: "brand-primary"
        },
        {
            id: 2,
            title: "Porseni: Harmony in Sports",
            date: "10 Jan 2026",
            category: "Olahraga",
            desc: "Menjunjung sportivitas dan mempererat tali silaturahmi antar siswa melalui kompetisi antar kelas yang meriah.",
            color: "brand-secondary"
        },
        {
            id: 3,
            title: "Bakti Sosial: OSIS Peduli",
            date: "02 Jan 2026",
            category: "Sosial",
            desc: "Aksi nyata peduli lingkungan dengan melakukan penanaman pohon dan bersih-beraih di sekitar area sekolah.",
            color: "brand-accent"
        }
    ];

    return (
        <main className="min-h-screen pt-32 md:pt-44 pb-20 md:pb-32 px-4 md:px-6">
            <div className="container mx-auto">
                <header className="mb-16 md:mb-24 text-center max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-2 glass rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mb-6"
                    >
                        Jejak Langkah Kami
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-8"
                    >
                        Dokumentasi & <span className="text-foreground/20">Berita</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-foreground/50 text-xl font-medium italic"
                    >
                        "Setiap momen adalah pelajaran, setiap aksi adalah sejarah."
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {posts.map((post, i) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative"
                        >
                            <div className="glass rounded-[2.5rem] overflow-hidden hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-700 shadow-2xl shadow-black/5 hover:translate-y-[-12px]">
                                <div className="aspect-[4/3] bg-foreground/[0.03] relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-foreground/10 text-xs font-black uppercase tracking-widest italic">
                                        No Preview Image
                                    </div>
                                    <div className="absolute top-8 left-8 p-3 glass rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6 md:p-10">
                                    <time className="text-[10px] font-black text-foreground/30 mb-4 block uppercase tracking-[0.2em]">
                                        {post.date}
                                    </time>
                                    <h2 className="text-2xl font-black mb-6 tracking-tight leading-tight group-hover:text-brand-primary transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-foreground/50 text-sm font-medium leading-relaxed mb-10">
                                        {post.desc}
                                    </p>
                                    <button className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-brand-primary group/btn">
                                        Selengkapnya
                                        <span className="w-8 h-[2px] bg-brand-primary group-hover/btn:w-12 transition-all" />
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </main>
    );
}
