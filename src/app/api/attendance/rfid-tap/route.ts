import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, AttendanceStatus } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/attendance/rfid-tap — Endpoint Tap Kartu RFID Cepat
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId, rfidCard } = body;

        if (!sessionId || !rfidCard) {
            return NextResponse.json(
                { error: "Sesi presensi dan UID Kartu RFID wajib disertakan" },
                { status: 400 }
            );
        }

        const cleanRfid = rfidCard.trim();

        // 1. Cek Sesi Presensi
        const targetSession = await prisma.attendanceSession.findUnique({
            where: { id: sessionId },
            include: {
                _count: { select: { records: true } }
            }
        });

        if (!targetSession) {
            return NextResponse.json({ error: "Sesi presensi tidak ditemukan" }, { status: 404 });
        }

        if (!targetSession.isOpen) {
            return NextResponse.json({ error: "Sesi presensi ini telah ditutup" }, { status: 400 });
        }

        // 2. Cari Anggota berdasarkan UID Kartu RFID
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { rfidCard: cleanRfid },
                    { nis: cleanRfid }, // Dukung juga barcode scan NIS
                ],
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                nis: true,
                nisn: true,
                role: true,
                division: true,
                position: true,
                kelas: true,
                major: true,
                image: true,
                rfidCard: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: "Kartu RFID belum terdaftar",
                    cardUid: cleanRfid,
                    message: `Kartu dengan UID [${cleanRfid}] belum ditautkan ke akun anggota manapun.`
                },
                { status: 404 }
            );
        }

        // 3. Cek apakah sudah pernah check-in di sesi ini
        const existingRecord = await prisma.attendanceRecord.findUnique({
            where: {
                sessionId_userId: {
                    sessionId: targetSession.id,
                    userId: user.id,
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                        role: true,
                        position: true,
                        kelas: true,
                    }
                }
            }
        });

        if (existingRecord) {
            return NextResponse.json(
                {
                    message: "Sudah Melakukan Presensi Sebelumnya",
                    alreadyCheckedIn: true,
                    user,
                    record: existingRecord,
                    totalAttendees: targetSession._count.records,
                },
                { status: 200 }
            );
        }

        // 4. Catat Kehadiran Baru
        const newRecord = await prisma.attendanceRecord.create({
            data: {
                sessionId: targetSession.id,
                userId: user.id,
                status: "PRESENT",
                checkInTime: new Date(),
                notes: `RFID Tap (${cleanRfid})`,
                isVerified: true,
            },
        });

        const totalAttendees = await prisma.attendanceRecord.count({
            where: { sessionId: targetSession.id }
        });

        return NextResponse.json(
            {
                message: "Presensi Berhasil!",
                success: true,
                user,
                record: newRecord,
                totalAttendees,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("POST /api/attendance/rfid-tap error:", error);
        return NextResponse.json({ error: "Gagal memproses tap kartu RFID" }, { status: 500 });
    }
}
