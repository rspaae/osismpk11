import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma, Role, Division } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
    sanitizeIdentifier,
    sanitizePassword,
    checkRateLimit,
    recordFailedLogin,
    recordSuccessfulLogin,
    dummyHashComparison,
} from "@/lib/security";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "NIS atau Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // 1. Sanitasi & Validasi Input Anti-Injection
                const idCheck = sanitizeIdentifier(credentials?.identifier || "");
                if (!idCheck.isValid) {
                    throw new Error(idCheck.error || "Format NIS atau Email tidak valid.");
                }

                const passCheck = sanitizePassword(credentials?.password || "");
                if (!passCheck.isValid) {
                    throw new Error(passCheck.error || "Format kata sandi tidak valid.");
                }

                const cleanId = idCheck.clean;
                const cleanPass = passCheck.clean;

                // 2. Proteksi Anti-Brute Force (Rate Limiting)
                const rateCheck = checkRateLimit(cleanId);
                if (rateCheck.isLocked) {
                    throw new Error(
                        `Terlalu banyak percobaan gagal. Akun/Akses ini dibekukan sementara selama ${rateCheck.remainingLockoutMinutes || 15} menit untuk keamanan.`
                    );
                }

                // 3. Query User dengan Parameterized Prisma Binding (Aman dari SQL Injection)
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: { equals: cleanId, mode: "insensitive" } },
                            { nis: { equals: cleanId, mode: "insensitive" } },
                        ],
                    },
                });

                // 4. Mitigasi Timing Attack & Generic Error Messaging
                if (!user || !user.password) {
                    // Jalankan hashing tiruan agar waktu respons server identik (~100-150ms)
                    await dummyHashComparison(cleanPass);
                    recordFailedLogin(cleanId);
                    throw new Error("NIS/Email atau kata sandi yang Anda masukkan tidak sesuai.");
                }

                // Cek status keaktifan akun
                if (!user.isActive) {
                    throw new Error("Akun Anda saat ini sedang dinonaktifkan. Hubungi Administrator IT atau Kesiswaan.");
                }

                // 5. Verifikasi Kata Sandi dengan Bcrypt
                const isValid = await bcrypt.compare(cleanPass, user.password);

                if (!isValid) {
                    const failInfo = recordFailedLogin(cleanId);
                    if (failInfo.isNowLocked) {
                        throw new Error(
                            `Percobaan login salah mencapai batas maksimal. Akun dibekukan selama ${failInfo.lockoutMinutes} menit.`
                        );
                    }
                    throw new Error("NIS/Email atau kata sandi yang Anda masukkan tidak sesuai.");
                }

                // 6. Login Sukses: Reset Catatan Percobaan Gagal
                recordSuccessfulLogin(cleanId);

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    nis: user.nis,
                    role: user.role,
                    division: user.division,
                    position: user.position,
                    kelas: user.kelas,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60, // 8 Jam masa aktif sesi login
        updateAge: 60 * 60, // Update token setiap 1 jam aktivitas
    },
    jwt: {
        maxAge: 8 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.nis = (user as any).nis;
                token.role = (user as any).role;
                token.division = (user as any).division;
                token.position = (user as any).position;
                token.kelas = (user as any).kelas;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.nis = token.nis as string | undefined;
                session.user.role = token.role as Role;
                session.user.division = token.division as Division | undefined;
                session.user.position = token.position as string | undefined;
                session.user.kelas = token.kelas as string | undefined;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "osim11-secret-key-development-smkn11bdg-2026-auth",
};
