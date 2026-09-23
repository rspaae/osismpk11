import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/attendance/my-records — Riwayat absensi peserta yang sedang login
// Hanya mengembalikan data milik user yang sedang login — tidak bisa override via query param
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

        const records = await prisma.attendanceRecord.findMany({
            where: {
                userId: session.user.id, // SELALU filter by user sendiri — tidak bisa diubah dari luar
            },
            include: {
                session: {
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        targetDivision: true,
                        date: true,
                        startTime: true,
                        endTime: true,
                        location: true,
                        isOpen: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        return NextResponse.json({ data: records });
    } catch (error) {
        console.error("GET /api/attendance/my-records error:", error);
        return NextResponse.json({ error: "Gagal memuat riwayat absensi" }, { status: 500 });
    }
}
