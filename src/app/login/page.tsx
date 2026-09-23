'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { sanitizeRedirectUrl } from '@/lib/security';

function LoginForm() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const errorCode = searchParams?.get('error');
    const callbackUrlParam = searchParams?.get('callbackUrl');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isEmail = identifier.includes('@');

        if (isEmail && !identifier.endsWith('@smkn11bdg.sch.id')) {
            setError('Email harus menggunakan domain resmi sekolah (@smkn11bdg.sch.id)');
            setLoading(false);
            return;
        }

        const result = await signIn('credentials', {
            identifier: identifier.trim(),
            password,
            redirect: false,
        });

        if (result?.error) {
            if (result.error.includes("dibekukan") || result.error.includes("dinonaktifkan") || result.error.includes("pola berbahaya")) {
                setError(result.error);
            } else {
                setError("NIS/Email atau kata sandi tidak sesuai.");
            }
            setLoading(false);
        } else {
            const safeRedirect = sanitizeRedirectUrl(callbackUrlParam, '/student/dashboard');
            router.push(safeRedirect);
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative px-4 py-16 bg-[#f7faf7] dark:bg-[#141c18] text-[#334139] dark:text-[#dce6e0]">
            <div className="w-full max-w-md relative z-10">
                {/* Back to Home Link */}
                <div className="text-center mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad] hover:text-[#468366] transition-colors shadow-xs"
                    >
                        <span>←</span>
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

                {/* Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-8 sm:p-10 bg-white dark:bg-[#19241f] rounded-3xl border border-[#e3ece6] dark:border-[#24342c] shadow-xs"
                >
                    {/* Header with Logos */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center gap-3 p-2 px-4 bg-[#f4f8f5] dark:bg-[#141c18] rounded-full border border-[#e3ece6] dark:border-[#24342c] mb-4">
                            {/* SMKN 11: Shield Shape */}
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-white dark:bg-[#19241f] border border-[#e3ece6] dark:border-[#24342c] p-0.5 relative shadow-xs flex items-center justify-center">
                                <Image src="/images/logos/smkn11.jpg" alt="SMKN 11 Bandung" fill className="object-contain" />
                            </div>
                            <span className="text-[#a5b8ad] text-xs">•</span>
                            {/* OSIS: Circular */}
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-white dark:bg-[#19241f] border border-[#d4e6db] dark:border-[#24342c] p-0.5 relative shadow-xs flex items-center justify-center">
                                <Image src="/images/logos/osis.jpg" alt="OSIS SMKN 11" fill className="object-cover rounded-full" />
                            </div>
                            <span className="text-[#a5b8ad] text-xs">•</span>
                            {/* MPK: Circular */}
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-white dark:bg-[#19241f] border border-[#ede0bc] dark:border-[#3d3119] p-0.5 relative shadow-xs flex items-center justify-center">
                                <Image src="/images/logos/mpk.jpg" alt="MPK SMKN 11" fill className="object-cover rounded-full" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-[#2c3831] dark:text-[#dce6e0] tracking-tight">
                            Portal Siswa
                        </h1>
                        <p className="text-xs text-[#5f7167] dark:text-[#a5b8ad] mt-1">
                            Masuk menggunakan NIS atau Email SMKN 11 Bandung
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad]" htmlFor="identifier">
                                NIS atau Email Sekolah
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                placeholder="Contoh: 12345678 / nama@smkn11bdg.sch.id"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#d2ded6] dark:border-[#24342c] focus:border-[#468366] dark:focus:border-[#5d9e7e] transition-colors outline-none text-sm text-[#334139] dark:text-[#dce6e0] placeholder:text-[#8a9a91]"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-semibold text-[#5f7167] dark:text-[#a5b8ad]" htmlFor="password">
                                    Kata Sandi
                                </label>
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="Masukkan kata sandi Anda"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-[#f7faf7] dark:bg-[#141c18] border border-[#d2ded6] dark:border-[#24342c] focus:border-[#468366] dark:focus:border-[#5d9e7e] transition-colors outline-none text-sm text-[#334139] dark:text-[#dce6e0] placeholder:text-[#8a9a91]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {(error || errorCode === 'restricted_domain') && (
                            <div className="p-3 rounded-xl bg-[#fae8e8] dark:bg-[#361b1b] border border-[#f0c2c2] dark:border-[#4d2525] text-[#8c3636] dark:text-[#e69898] text-xs font-medium flex items-center gap-2">
                                <span>⚠️</span>
                                <span>{error || (errorCode === 'restricted_domain' && 'Hanya email @smkn11bdg.sch.id yang diizinkan.')}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#468366] hover:bg-[#396953] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                            ) : (
                                'Masuk ke Portal'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-[#e3ece6] dark:border-[#24342c] text-center">
                        <p className="text-[11px] text-[#8a9a91] dark:text-[#73887d]">
                            Butuh bantuan login? Hubungi pengurus OSIS-MPK atau Pembina.
                        </p>
                    </div>
                </motion.div>

                <p className="mt-6 text-center text-[11px] text-[#8a9a91] dark:text-[#73887d]">
                    © {new Date().getFullYear()} OSIS-MPK SMKN 11 Bandung
                </p>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#f7faf7] dark:bg-[#141c18]">
                <div className="w-8 h-8 border-3 border-[#468366]/30 border-t-[#468366] rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
