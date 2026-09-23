import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, AttendanceStatus } from "@/lib/prisma";

// POST /api/attendance/check-in — Presensi mandiri anggota (Scan QR atau input Kode PIN)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Silakan login terlebih dahulu untuk melakukan presensi" }, { status: 401 });
        }

        const body = await req.json();
        const { sessionId, passcode, qrToken, status, notes, proofImage } = body;

        if (!sessionId && !passcode && !qrToken) {
            return NextResponse.json({ error: "Kode PIN atau QR Token diperlukan" }, { status: 400 });
        }

        // Cari sesi presensi yang aktif
        let targetSession = null;
        if (qrToken) {
            targetSession = await prisma.attendanceSession.findUnique({
                where: { qrToken }
            });
        } else if (sessionId) {
            targetSession = await prisma.attendanceSession.findUnique({
                where: { id: sessionId }
            });
        } else if (passcode) {
            targetSession = await prisma.attendanceSession.findFirst({
                where: { passcode, isOpen: true },
                orderBy: { createdAt: "desc" }
            });
        }

        if (!targetSession) {
            return NextResponse.json({ error: "Sesi presensi tidak ditemukan atau kode salah" }, { status: 404 });
        }

        if (!targetSession.isOpen) {
            return NextResponse.json({ error: "Sesi presensi ini telah ditutup" }, { status: 400 });
        }

        // Cek apakah sudah pernah absen di sesi ini
        const existingRecord = await prisma.attendanceRecord.findUnique({
            where: {
                sessionId_userId: {
                    sessionId: targetSession.id,
                    userId: session.user.id,
                }
            }
        });

        if (existingRecord) {
            return NextResponse.json({
                message: "Anda sudah melakukan presensi pada sesi ini",
                data: existingRecord
            }, { status: 200 });
        }

        // Simpan kehadiran
        const attendanceStatus: AttendanceStatus = (status as AttendanceStatus) || "PRESENT";

        const record = await prisma.attendanceRecord.create({
            data: {
                sessionId: targetSession.id,
                userId: session.user.id,
                status: attendanceStatus,
                checkInTime: new Date(),
                notes: notes || null,
                proofImage: proofImage || null,
                isVerified: true,
            },
            include: {
                session: {
                    select: {
                        title: true,
                        location: true,
                        date: true,
                    }
                },
                user: {
                    select: {
                        name: true,
                        role: true,
                        division: true,
                        position: true,
                        kelas: true,
                    }
                }
            }
        });

        return NextResponse.json({
            message: `Presensi berhasil! Status: ${attendanceStatus === 'PRESENT' ? 'Hadir' : attendanceStatus}`,
            data: record
        }, { status: 201 });
    } catch (error) {
        console.error("POST /api/attendance/check-in error:", error);
        return NextResponse.json({ error: "Gagal memproses presensi" }, { status: 500 });
    }
}
