import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMINISTRATOR", "KESISWAAN", "PEMBINA"].includes(session.user.role as any)) {
        return NextResponse.json({ error: "Unauthorized. Hanya Administrator, Kesiswaan, dan Pembina yang berhak melakukan aksi massal." }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { action, userIds, targetKelas, targetMajor, newPassword } = body;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ error: "Tidak ada pengguna yang dipilih untuk diproses." }, { status: 400 });
        }

        // Limit pencegahan overload (max 2000 users per bulk action)
        if (userIds.length > 2000) {
            return NextResponse.json({ error: "Maksimal 2.000 pengguna per aksi massal." }, { status: 400 });
        }

        switch (action) {
            case "RESET_PASSWORD": {
                const passToSet = newPassword?.trim() || "password123";
                const hashedPassword = await bcrypt.hash(passToSet, 10);

                const result = await prisma.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { password: hashedPassword },
                });

                return NextResponse.json({
                    success: true,
                    message: `Berhasil mereset password untuk ${result.count} pengguna menjadi '${passToSet}'.`,
                    count: result.count,
                });
            }

            case "UPDATE_CLASS": {
                if (!targetKelas || !targetKelas.trim()) {
                    return NextResponse.json({ error: "Target kelas baru wajib diisi." }, { status: 400 });
                }

                const result = await prisma.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { kelas: targetKelas.trim() },
                });

                return NextResponse.json({
                    success: true,
                    message: `Berhasil memindahkan ${result.count} pengguna ke kelas '${targetKelas.trim()}'.`,
                    count: result.count,
                });
            }

            case "UPDATE_MAJOR": {
                if (!targetMajor || !targetMajor.trim()) {
                    return NextResponse.json({ error: "Target jurusan baru wajib diisi." }, { status: 400 });
                }

                const result = await prisma.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { major: targetMajor.trim() },
                });

                return NextResponse.json({
                    success: true,
                    message: `Berhasil memperbarui jurusan ${result.count} pengguna menjadi '${targetMajor.trim()}'.`,
                    count: result.count,
                });
            }

            case "DEACTIVATE": {
                const result = await prisma.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { isActive: false },
                });

                return NextResponse.json({
                    success: true,
                    message: `Berhasil menonaktifkan ${result.count} akun pengguna.`,
                    count: result.count,
                });
            }

            case "ACTIVATE": {
                const result = await prisma.user.updateMany({
                    where: { id: { in: userIds } },
                    data: { isActive: true },
                });

                return NextResponse.json({
                    success: true,
                    message: `Berhasil mengaktifkan kembali ${result.count} akun pengguna.`,
                    count: result.count,
                });
            }

            case "DELETE": {
                if (session.user.role !== "ADMINISTRATOR" && session.user.role !== "KESISWAAN") {
                    return NextResponse.json({ error: "Hanya Administrator IT & Kesiswaan yang dapat menghapus akun secara permanen." }, { status: 403 });
                }

                // Jangan izinkan admin menghapus akun diri sendiri dalam batch
                const filteredIds = userIds.filter((id) => id !== session.user.id);

                const result = await prisma.user.deleteMany({
                    where: { id: { in: filteredIds } },
                });

                return NextResponse.json({
                    success: true,
                    message: `Berhasil menghapus permanen ${result.count} akun pengguna.`,
                    count: result.count,
                });
            }

            default:
                return NextResponse.json({ error: `Aksi massal '${action}' tidak dikenali.` }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Bulk action error:", error);
        return NextResponse.json({ error: error.message || "Gagal memproses aksi massal" }, { status: 500 });
    }
}
