import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-100/70 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12 px-4 md:px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                    <div className="md:col-span-5">
                        <Link href="/" className="flex items-center gap-2.5 mb-4 group">
                            <div className="w-9 h-9 bg-emerald-700 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                                11
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                OSIS - MPK
                            </span>
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                            Wadah inspirasi, kolaborasi, dan aksi nyata seluruh siswa SMKN 11 Bandung menuju generasi berkarakter dan berprestasi.
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-bold uppercase tracking-wider text-xs text-slate-900 dark:text-white mb-4">
                            Organisasi
                        </h4>
                        <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                            <li><Link href="/vision-mission" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Visi & Misi</Link></li>
                            <li><Link href="/structure" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Struktur</Link></li>
                            <li><Link href="/departments" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">10 Sekbid</Link></li>
                            <li><Link href="/activities" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Dokumentasi</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-bold uppercase tracking-wider text-xs text-slate-900 dark:text-white mb-4">
                            Layanan
                        </h4>
                        <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                            <li><Link href="/student/dashboard" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Form Aspirasi</Link></li>
                            <li><Link href="/login" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">Portal Siswa</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="font-bold uppercase tracking-wider text-xs text-slate-900 dark:text-white mb-4">
                            Media Sosial
                        </h4>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://instagram.com/osissmkn11bdg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                            >
                                <span>📷</span> @osissmkn11bdg
                            </a>
                            <a
                                href="https://instagram.com/mpksmkn11bdg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                            >
                                <span>📷</span> @mpksmkn11bdg
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
                    <p>&copy; {new Date().getFullYear()} OSIS-MPK SMKN 11 Bandung. All rights reserved.</p>
                    <p>
                        by <a href="https://instagram.com/inirspaa" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">rapa ganteng</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
