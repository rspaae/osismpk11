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
            // Tampilkan pesan error aktual (seperti akun terkunci / rate-limit)
            if (result.error.includes("dibekukan") || result.error.includes("dinonaktifkan") || result.error.includes("pola berbahaya")) {
                setError(result.error);
            } else {
                setError("NIS/Email atau kata sandi tidak sesuai.");
            }
            setLoading(false);
        } else {
            // Open Redirect Shield: Pastikan hanya redirect ke internal path lokal
            const safeRedirect = sanitizeRedirectUrl(callbackUrlParam, '/student/dashboard');
            router.push(safeRedirect);
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-20 bg-brand-soft/50 dark:bg-background">
            {/* Animated Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-brand-primary/10 via-background to-brand-primary/5 -z-20" />
            
            {/* Floating Orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-brand-primary/20 rounded-full blur-[100px] animate-float -z-10" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-primary/15 rounded-full blur-[120px] animate-float -z-10" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-brand-accent/10 rounded-full blur-[80px] animate-float -z-10" style={{ animationDelay: '4s' }} />

            <div className="w-full max-w-xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <Link href="/" className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full hover:bg-white/10 transition-all group mb-12 text-foreground/70 hover:text-foreground dark:text-white/80 dark:hover:text-white">
                        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Kembali ke Beranda</span>
                    </Link>

                    {/* Logo Cards */}
                    <div className="flex items-center justify-center gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            whileHover={{ scale: 1.1, rotateY: 10 }}
                            className="relative"
                        >
                            <div className="relative logo-orb w-20 h-20 p-3 bg-white dark:bg-white/90 shadow-xl shadow-brand-primary/20 transform hover:rotate-12 transition-transform duration-500">
                                <Image src="/images/logos/smkn11.jpg" alt="SMKN 11" width={80} height={80} className="object-contain" />
                            </div>
                        </motion.div>

                        <div className="h-16 w-0.5 bg-foreground/10 dark:bg-white/20" />

                        <div className="flex gap-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ duration: 1, delay: 0.4 }}
                                whileHover={{ scale: 1.1, rotateY: -10 }}
                                className="relative"
                            >
                                <div className="relative logo-orb w-20 h-20 p-3 bg-white dark:bg-white/90 shadow-xl shadow-brand-primary/20 hover:-rotate-6 transition-all duration-500">
                                    <Image src="/images/logos/osis.jpg" alt="OSIS" width={80} height={80} className="object-contain" />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ duration: 1, delay: 0.6 }}
                                whileHover={{ scale: 1.1, rotateY: -10 }}
                                className="relative"
                            >
                                <div className="relative logo-orb w-20 h-20 p-3 bg-white dark:bg-white/90 shadow-xl shadow-brand-primary/20 hover:rotate-6 transition-all duration-500">
                                    <Image src="/images/logos/mpk.jpg" alt="MPK" width={80} height={80} className="object-contain" />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-foreground dark:text-white">
                            Portal Siswa
                        </h1>
                        <p className="text-foreground/60 dark:text-white/70 font-medium text-lg italic">
                            "Inovasi dimulai dari sini. Selamat datang kembali!"
                        </p>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="relative"
                >
                    <div className="relative glass premium-border p-10 md:p-14 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-brand-primary/10 border-white/40 dark:border-white/10 backdrop-blur-xl bg-white/5 dark:bg-white/5">
                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-4">
                                <label className="block text-xs font-black uppercase tracking-[0.3em] text-foreground/70 dark:text-white/80 ml-2" htmlFor="identifier">
                                    NIS atau Email
                                </label>
                                <input
                                    id="identifier"
                                    type="text"
                                    placeholder="NIS atau Email Anda"
                                    required
                                    className="w-full px-6 py-4 rounded-xl bg-white/90 dark:bg-white/10 backdrop-blur-sm border-2 border-white/40 dark:border-white/20 focus:border-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-white/20 transition-all outline-none font-bold text-base text-foreground dark:text-white placeholder:text-foreground/40 dark:placeholder:text-white/40"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center ml-2">
                                    <label className="block text-xs font-black uppercase tracking-[0.3em] text-foreground/70 dark:text-white/80" htmlFor="password">
                                        Password
                                    </label>
                                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 dark:text-brand-primary dark:hover:text-brand-primary/80 transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password Anda"
                                    required
                                    className="w-full px-6 py-4 rounded-xl bg-white/90 dark:bg-white/10 backdrop-blur-sm border-2 border-white/40 dark:border-white/20 focus:border-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-white/20 transition-all outline-none font-bold text-base text-foreground dark:text-white placeholder:text-foreground/40 dark:placeholder:text-white/40"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {(error || errorCode === 'restricted_domain') && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-5 rounded-xl bg-red-500/15 dark:bg-red-500/20 backdrop-blur-sm border-2 border-red-400/40 dark:border-red-400/50 text-foreground dark:text-white text-sm font-bold flex items-center gap-4"
                                >
                                    <span className="text-xl">⚠️</span>
                                    {error || (errorCode === 'restricted_domain' && 'Hanya email @smkn11bdg.sch.id yang diizinkan.')}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full py-5 bg-brand-primary hover:bg-brand-primary/90 text-white font-black uppercase tracking-[0.2em] text-sm rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
                            >
                                <span className="relative z-10">
                                    {loading ? (
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                    ) : (
                                        'Masuk ke Portal'
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-12 text-center text-xs font-black uppercase tracking-[0.3em] text-foreground/50 dark:text-white/60"
                >
                    © {new Date().getFullYear()} OSIS-MPK SMKN 11 Bandung
                </motion.p>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-brand-soft/50 dark:bg-background">
                <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
