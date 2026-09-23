import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#f2f6f3] dark:bg-[#121915] border-t border-[#e3ece6] dark:border-[#24342c] pt-14 pb-12 px-4 md:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl lg:max-w-[1360px]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                    <div className="md:col-span-5">
                        <Link href="/" className="flex items-center gap-3 mb-4 group">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] p-1 flex items-center justify-center shadow-xs group-hover:border-[#468366]/40 transition-colors overflow-hidden shrink-0">
                                <Image
                                    src="/images/logos/smkn11.jpg"
                                    alt="SMKN 11 Bandung"
                                    width={36}
                                    height={36}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tight text-[#2c3831] dark:text-[#dce6e0] leading-none">
                                    OSIS - MPK
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#468366] dark:text-[#a3d4bd] mt-0.5">
                                    SMKN 11 Bandung
                                </span>
                            </div>
                        </Link>
                        <p className="text-[#5f7167] dark:text-[#a5b8ad] text-xs leading-relaxed max-w-sm">
                            Wadah inspirasi, kolaborasi, dan aksi nyata seluruh siswa SMKN 11 Bandung menuju generasi berkarakter, unggul, dan berprestasi.
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-semibold uppercase tracking-wider text-xs text-[#2c3831] dark:text-[#dce6e0] mb-3">
                            Organisasi
                        </h4>
                        <ul className="space-y-2 text-xs text-[#5f7167] dark:text-[#a5b8ad]">
                            <li><Link href="/vision-mission" className="hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors">Visi & Misi</Link></li>
                            <li><Link href="/structure" className="hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors">Struktur Organisasi</Link></li>
                            <li><Link href="/departments" className="hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors">10 Sekbid OSIS</Link></li>
                            <li><Link href="/activities" className="hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors">Dokumentasi</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-semibold uppercase tracking-wider text-xs text-[#2c3831] dark:text-[#dce6e0] mb-3">
                            Layanan
                        </h4>
                        <ul className="space-y-2 text-xs text-[#5f7167] dark:text-[#a5b8ad]">
                            <li><Link href="/student/dashboard" className="hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors">Form Aspirasi Siswa</Link></li>
                            <li><Link href="/login" className="hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors">Portal Siswa</Link></li>
                            <li><a href="https://smkn11bdg.sch.id" target="_blank" rel="noopener noreferrer" className="hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors">Web Utama SMKN 11 ↗</a></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="font-semibold uppercase tracking-wider text-xs text-[#2c3831] dark:text-[#dce6e0] mb-3">
                            Media Sosial
                        </h4>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://instagram.com/osissmkn11bdg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors flex items-center gap-1.5"
                            >
                                <span>📷</span> @osissmkn11bdg
                            </a>
                            <a
                                href="https://instagram.com/mpksmkn11bdg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#468366] dark:hover:text-[#dce6e0] transition-colors flex items-center gap-1.5"
                            >
                                <span>📷</span> @mpksmkn11bdg
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-[#e3ece6] dark:border-[#24342c] flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-[#8a9a91] dark:text-[#73887d]">
                    <p>&copy; {new Date().getFullYear()} OSIS-MPK SMKN 11 Bandung. All rights reserved.</p>
                    <p>
                        Official Portal — <a href="https://smkn11bdg.sch.id" target="_blank" rel="noopener noreferrer" className="font-medium text-[#468366] dark:text-[#a3d4bd] hover:underline">SMKN 11 Bandung</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
