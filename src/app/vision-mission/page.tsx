'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function VisionMission() {
    const misiList = [
        {
            id: "01",
            title: "Kepengurusan Solid & Kreatif",
            text: "Membangun kepengurusan OSIS yang solid, kreatif, dan kompeten melalui pengembangan kemampuan, kolaborasi, dan rasa kebersamaan."
        },
        {
            id: "02",
            title: "Wadah Minat, Bakat & Prestasi",
            text: "Menyediakan wadah bagi siswa untuk mengembangkan minat, bakat, serta potensi yang dimiliki, sehingga setiap siswa memiliki kesempatan untuk berkembang dan menunjukkan kemampuannya."
        },
        {
            id: "03",
            title: "Sinergi MPK & Keterampilan Kerja",
            text: "Bekerja sama dengan MPK dalam menindaklanjuti aspirasi siswa melalui kegiatan yang relevan dan inovatif, serta mengembangkan keterampilan yang dapat diterapkan dalam pendidikan maupun dunia kerja."
        },
        {
            id: "04",
            title: "Optimalisasi Media Digital",
            text: "Mengoptimalkan media digital sebagai ruang informasi, edukasi, dan publikasi yang kreatif dan bermanfaat bagi siswa serta memperluas eksistensi OSIS SMKN 11 Bandung."
        }
    ];

    const prokerList = [
        {
            id: "01",
            title: "Gerakan Peduli Siswa",
            tag: "Sosial & Empati",
            text: "Program kepedulian untuk membantu siswa yang membutuhkan melalui kolaborasi dengan alumni, warga sekolah, dan pihak terkait, sesuai kebutuhan siswa."
        },
        {
            id: "02",
            title: "Bonding OSIM 11",
            tag: "Kekeluargaan",
            text: "Kegiatan refreshing dan bonding pengurus OSIS & MPK melalui berbagai aktivitas di luar sekolah untuk mempererat kebersamaan, meningkatkan komunikasi, serta kekompakan."
        },
        {
            id: "03",
            title: "Studi Banding",
            tag: "Wawasan Organisasi",
            text: "Kunjungan dan bertukar pengalaman dengan OSIS sekolah lain untuk menambah wawasan dan mengembangkan sistem kerja OSIS SMKN 11 Bandung."
        },
        {
            id: "04",
            title: "ELSAVA Vol.II",
            tag: "Festival & Karya",
            text: "Festival akhir kepengurusan yang menjadi wadah kreativitas, bakat, dan karya siswa melalui berbagai pertunjukan dengan melibatkan pihak eksternal."
        },
        {
            id: "05",
            title: "One Skill, One Growth",
            tag: "Pengembangan Diri",
            text: "Program pengembangan kemampuan siswa melalui kegiatan berbagi ilmu dan pembelajaran keterampilan baru bersama OSIS, alumni, guru, maupun pihak yang berkompeten di bidangnya."
        }
    ];

    return (
        <main className="min-h-screen pt-28 md:pt-36 pb-20 px-4 md:px-6 lg:px-8 bg-[#f7faf7] dark:bg-[#141c18] text-[#334139] dark:text-[#dce6e0] font-sans">
            <div className="container mx-auto max-w-7xl lg:max-w-[1360px]">
                {/* Header Section */}
                <header className="mb-14 md:mb-20 text-center max-w-3xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center gap-3 p-2 px-4 bg-white dark:bg-[#19241f] rounded-full border border-[#e3ece6] dark:border-[#24342c] shadow-xs mb-6"
                    >
                        {/* SMKN 11: Shield Shape */}
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-[#141c18] border border-[#e3ece6] dark:border-[#24342c] p-0.5 relative shadow-xs flex items-center justify-center">
                            <Image src="/images/logos/smkn11.jpg" alt="SMKN 11 Bandung" fill className="object-contain" />
                        </div>
                        <span className="text-[#a5b8ad] text-xs">•</span>
                        {/* OSIS: Circular */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-[#141c18] border border-[#d4e6db] dark:border-[#24342c] p-0.5 relative shadow-xs flex items-center justify-center">
                            <Image src="/images/logos/osis.jpg" alt="OSIS SMKN 11" fill className="object-cover rounded-full" />
                        </div>
                        <span className="text-[#a5b8ad] text-xs">•</span>
                        {/* MPK: Circular */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-[#141c18] border border-[#ede0bc] dark:border-[#3d3119] p-0.5 relative shadow-xs flex items-center justify-center">
                            <Image src="/images/logos/mpk.jpg" alt="MPK SMKN 11" fill className="object-cover rounded-full" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-3.5 py-1 bg-[#e8f2ec] dark:bg-[#1d2c25] text-[#396953] dark:text-[#a3d4bd] border border-[#d4e6db] dark:border-[#24342c] rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                    >
                        Arah Gerak & Komitmen Kepengurusan
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-[#202924] dark:text-[#f0f5f2] mb-3"
                    >
                        Visi & Misi OSIS
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm md:text-base text-[#5f7167] dark:text-[#a5b8ad] font-medium italic"
                    >
                        "Bukan Sekedar Janji, Tapi Bukti Nyata"
                    </motion.p>
                </header>

                {/* Visi Section */}
                <motion.section
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <div className="p-8 md:p-12 bg-white dark:bg-[#19241f] rounded-3xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs relative overflow-hidden">
                        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider uppercase bg-[#468366] text-white rounded-xl shadow-xs">
                            Visi Utama
                        </div>
                        <h2 className="text-lg md:text-2xl font-bold leading-relaxed tracking-tight text-[#2c3831] dark:text-[#dce6e0]">
                            &ldquo;Mewujudkan OSIS SMKN 11 Bandung sebagai organisasi yang solid, aktif, peduli, dan berlandaskan keimanan dan ketakwaan kepada Tuhan Yang Maha Esa, dalam menciptakan lingkungan sekolah yang positif, mendukung siswa untuk berkembang dan berprestasi, serta mengoptimalkan media digital sebagai sarana informasi, edukasi, dan publikasi potensi siswa.&rdquo;
                        </h2>
                    </div>
                </motion.section>

                {/* Misi Section */}
                <section className="mb-14">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-1.5 h-6 bg-[#468366] rounded-full" />
                        <h3 className="text-xl md:text-2xl font-bold text-[#2c3831] dark:text-[#dce6e0]">
                            4 Misi Strategis
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {misiList.map((misi, i) => (
                            <motion.div
                                key={misi.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="p-6 bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs flex gap-4 items-start hover:border-[#468366]/40 transition-colors"
                            >
                                <span className="w-8 h-8 rounded-xl bg-[#e8f2ec] dark:bg-[#1d2c25] text-[#396953] dark:text-[#a3d4bd] border border-[#d4e6db] dark:border-[#24342c] flex items-center justify-center text-xs font-bold shrink-0">
                                    {misi.id}
                                </span>
                                <div>
                                    <h4 className="text-sm md:text-base font-bold text-[#2c3831] dark:text-[#dce6e0] mb-1.5">
                                        {misi.title}
                                    </h4>
                                    <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] leading-relaxed">
                                        {misi.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Program Kerja Unggulan */}
                <section className="mb-14">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-1.5 h-6 bg-[#468366] rounded-full" />
                        <h3 className="text-xl md:text-2xl font-bold text-[#2c3831] dark:text-[#dce6e0]">
                            5 Program Kerja Pokok
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {prokerList.map((proker, i) => (
                            <motion.div
                                key={proker.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                                className="p-5 bg-white dark:bg-[#19241f] rounded-2xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs flex flex-col justify-between hover:border-[#468366]/40 hover:-translate-y-0.5 transition-all"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="w-7 h-7 rounded-lg bg-[#e8f2ec] dark:bg-[#1d2c25] text-[#396953] dark:text-[#a3d4bd] text-xs font-bold flex items-center justify-center">
                                            {proker.id}
                                        </span>
                                        <span className="text-[10px] font-semibold text-[#8a9a91] dark:text-[#73887d] uppercase tracking-wider">
                                            {proker.tag}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-[#2c3831] dark:text-[#dce6e0] mb-2 leading-snug">
                                        {proker.title}
                                    </h4>
                                    <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] leading-relaxed">
                                        {proker.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Back to Home CTA */}
                <div className="text-center pt-8 border-t border-[#e3ece6] dark:border-[#24342c]">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#468366] hover:bg-[#396953] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs"
                    >
                        <span>←</span>
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
