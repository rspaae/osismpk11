"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingActionWidget() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
                >
                    <Link
                        href="/student/dashboard"
                        className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 dark:bg-[#19241f]/95 text-[#2c3831] dark:text-[#dce6e0] border border-[#e3ece6] dark:border-[#24342c] shadow-[0_4px_16px_-4px_rgba(70,131,102,0.12)] hover:border-[#468366] text-xs font-semibold backdrop-blur-md transition-all hover:scale-102"
                    >
                        <span>📢</span>
                        <span>Kirim Aspirasi</span>
                    </Link>

                    <button
                        onClick={scrollToTop}
                        aria-label="Scroll to top"
                        className="w-10 h-10 rounded-full bg-[#468366] hover:bg-[#396953] text-white flex items-center justify-center text-sm shadow-[0_4px_16px_-4px_rgba(70,131,102,0.25)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        ↑
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
