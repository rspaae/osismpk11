"use client";

import { motion } from "framer-motion";

const tickerItems = [
    "SMKN 11 Bandung",
    "OSIS Navastra 2026/2027",
    "MPK Navandya 2026/2027",
    "Inovasi & Karakter Unggul",
    "Ruang Aspirasi Siswa",
    "ELEVEN Fest & Porseni XI",
    "Kolaborasi & Kepemimpinan",
];

export default function RunningTicker() {
    return (
        <div className="w-full overflow-hidden py-3 bg-[#edf5f0]/80 dark:bg-[#19241f]/80 border-y border-[#e3ece6] dark:border-[#24342c] backdrop-blur-xs select-none">
            <motion.div
                className="flex items-center gap-8 whitespace-nowrap will-change-transform"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 25,
                }}
            >
                {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
                    <div key={index} className="inline-flex items-center gap-8">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#468366] dark:text-[#a3d4bd]">
                            {item}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b5d5c2] dark:bg-[#2f4339]" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
