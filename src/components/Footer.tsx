import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-brand-soft dark:bg-brand-primary/20 border-t border-border pt-20 md:pt-32 pb-12 md:pb-16 px-4 md:px-6">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
                    <div className="md:col-span-5">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-12 h-12 bg-brand-primary dark:bg-black rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-brand-primary/20 group-hover:shadow-brand-primary/40 transition-all">
                                11
                            </div>
                            <span className="text-2xl font-black tracking-tight text-foreground dark:text-white group-hover:text-brand-primary transition-colors">
                                OSIS-MPK
                            </span>
                        </Link>
                        <p className="text-foreground/50 leading-relaxed text-lg font-medium max-w-sm">
                            Wadah aspirasi dan inovasi siswa untuk sekolah yang lebih baik. Beraksi nyata dalam harmoni untuk SMKN 11 Bandung.
                        </p>
                    </div>

                    <div className="md:col-span-2 p-6 md:p-8 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10">
                        <h4 className="font-black uppercase tracking-widest text-xs text-brand-primary mb-8">Organisasi</h4>
                        <ul className="space-y-4 text-sm font-bold text-foreground/60 dark:text-white/70">
                            <li><Link href="/vision-mission" className="hover:text-brand-primary dark:hover:text-brand-accent transition-all">Visi & Misi</Link></li>
                            <li><Link href="/structure" className="hover:text-brand-primary dark:hover:text-brand-accent transition-all">Struktur</Link></li>
                            <li><Link href="/departments" className="hover:text-brand-primary dark:hover:text-brand-accent transition-all">Sekbid</Link></li>
                            <li><Link href="/activities" className="hover:text-brand-primary dark:hover:text-brand-accent transition-all">Dokumentasi</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 p-6 md:p-8 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10">
                        <h4 className="font-black uppercase tracking-widest text-xs text-brand-primary mb-8">Informasi</h4>
                        <ul className="space-y-4 text-sm font-bold text-foreground/60 dark:text-white/70">
                            <li><Link href="#" className="hover:text-brand-primary dark:hover:text-brand-accent transition-all">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary dark:hover:text-brand-accent transition-all">Kontak</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary dark:hover:text-brand-accent transition-all">Privacy</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3 p-6 md:p-8 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10">
                        <h4 className="font-black uppercase tracking-widest text-xs text-brand-primary mb-8">Social Media</h4>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { name: "@osissmkn11bdg", url: "https://instagram.com/osissmkn11bdg", icon: "📷" },
                                { name: "@mpksmkn11bdg", url: "https://instagram.com/mpksmkn11bdg", icon: "📷" },
                                { name: "Saluran Whatsapp OSIS", url: "#", icon: "📢" },
                                { name: "Saluran WhatsApp MPK", url: "#", icon: "📢" }
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target={social.url !== "#" ? "_blank" : undefined}
                                    rel={social.url !== "#" ? "noopener noreferrer" : undefined}
                                    className="px-3 py-2 rounded-xl bg-black/10 dark:bg-black/50 border border-black/20 dark:border-white/20 text-foreground dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white hover:border-brand-primary dark:hover:border-brand-primary transition-all flex items-center gap-2"
                                >
                                    <span className="text-sm">{social.icon}</span>
                                    {social.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                        &copy; {new Date().getFullYear()} OSIS-MPK SMKN 11 Bandung.
                    </p>
                    <div className="flex items-center gap-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 flex items-center gap-2">
                            by <a href="https://instagram.com/inirspaa" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-primary/80 transition-colors">rapa ganteng</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
