import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/admin/users/rfid — Daftarkan / Tautkan Kartu RFID ke Anggota
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMINISTRATOR", "KESISWAAN", "BPH_OSIS", "BPH_MPK"].includes(session.user.role as any)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { userId, rfidCard } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID wajib disertakan" }, { status: 400 });
        }

        const cleanRfid = rfidCard ? rfidCard.trim() : null;

        if (cleanRfid) {
            // Cek apakah UID RFID ini sudah dipakai user lain
            const existing = await prisma.user.findFirst({
                where: {
                    rfidCard: cleanRfid,
                    id: { not: userId },
                },
            });

            if (existing) {
                return NextResponse.json(
                    { error: `Kartu RFID [${cleanRfid}] sudah terdaftar pada pengguna: ${existing.name}` },
                    { status: 400 }
                );
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                rfidCard: cleanRfid,
            },
            select: {
                id: true,
                name: true,
                nis: true,
                role: true,
                rfidCard: true,
            },
        });

        return NextResponse.json({
            message: cleanRfid ? "Kartu RFID berhasil ditautkan!" : "Kartu RFID berhasil dilepas",
            user: updatedUser,
        });
    } catch (error: any) {
        console.error("POST /api/admin/users/rfid error:", error);
        return NextResponse.json({ error: "Gagal menghubungkan kartu RFID" }, { status: 500 });
    }
}
