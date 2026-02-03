'use client';

import { motion } from "framer-motion";

export default function Departments() {
    const sekbids = [
        { id: 1, name: "Ketaqwaan terhadap Tuhan YME", icon: "🌙", focus: "Kegiatan keagamaan dan toleransi antar umat beragama." },
        { id: 2, name: "Kehidupan Berbangsa & Bernegara", icon: "🇮🇩", focus: "Upacara bendera, paskibra, dan penguatan patriotisme." },
        { id: 3, name: "Pendidikan Bela Negara", icon: "🛡️", focus: "Kedisiplinan, kesadaran hukum, dan bela negara." },
        { id: 4, name: "Kepribadian & Budi Pekerti", icon: "✨", focus: "Etika, tata krama, dan penguatan nilai sosial." },
        { id: 5, name: "Demokrasi & HAM", icon: "🗳️", focus: "Pemilu OSIS dan pendidikan politik yang sehat." },
        { id: 6, name: "Kreativitas & Kewirausahaan", icon: "💡", focus: "Kantin kejujuran dan pemberdayaan ekonomi kreatif." },
        { id: 7, name: "Jasmani & Kesehatan", icon: "🏃", focus: "Olahraga, UKS, dan kampanye hidup sehat." },
        { id: 8, name: "Sastra & Budaya", icon: "🎨", focus: "Seni, literasi, dan pelestarian budaya daerah." },
        { id: 9, name: "Teknologi Informasi", icon: "💻", focus: "Media sosial dan pengembangan ekosistem digital." },
        { id: 10, name: "Komunikasi Bahasa Inggris", icon: "🌎", focus: "English club dan pengembangan debat internasional." }
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
                        Garda Terdepan Aksi
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-8"
                    >
                        Sekretaris <span className="text-foreground/20">Bidang</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-foreground/50 text-xl font-medium italic"
                    >
                        "Pembagian peran dalam harmoni untuk implementasi program kerja yang presisi."
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                    {sekbids.map((sekbid, i) => (
                        <motion.div
                            key={sekbid.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative"
                        >
                            <div className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-500 border-white/40 dark:border-white/10 shadow-3xl shadow-black/5 hover:translate-y-[-8px]">
                                <div className="text-3xl md:text-4xl mb-6 md:mb-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-foreground/[0.03] rounded-2xl md:rounded-[2rem] group-hover:scale-110 transition-transform">
                                    {sekbid.icon}
                                </div>
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Sekbid {sekbid.id}</span>
                                    <div className="flex-1 h-[1px] bg-brand-primary/10" />
                                </div>
                                <h2 className="text-2xl font-black mb-6 leading-tight tracking-tight group-hover:text-brand-primary transition-colors">{sekbid.name}</h2>
                                <p className="text-foreground/50 text-sm font-medium leading-relaxed italic">
                                    {sekbid.focus}
                                </p>

                                <div className="absolute -bottom-2 -right-2 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                    <span className="text-[10rem] font-black">{sekbid.id}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
