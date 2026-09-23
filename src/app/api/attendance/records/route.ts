import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, AttendanceStatus } from "@/lib/prisma";
import { isOfficerOrStaff } from "@/lib/permissions";

// GET /api/attendance/records — Rekap data kehadiran anggota per sesi
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");
        const userId = searchParams.get("userId");
        const status = searchParams.get("status") as AttendanceStatus | null;

        const where: any = {};
        if (sessionId) where.sessionId = sessionId;
        if (userId) where.userId = userId;
        if (status) where.status = status;

        const records = await prisma.attendanceRecord.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        nis: true,
                        role: true,
                        division: true,
                        position: true,
                        kelas: true,
                        image: true,
                    }
                },
                session: {
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        date: true,
                        location: true,
                    }
                }
            },
            orderBy: { checkInTime: "asc" },
        });

        // Hitung statistik ringkas
        const summary = {
            total: records.length,
            present: records.filter(r => r.status === "PRESENT").length,
            late: records.filter(r => r.status === "LATE").length,
            permission: records.filter(r => r.status === "PERMISSION").length,
            sick: records.filter(r => r.status === "SICK").length,
            absent: records.filter(r => r.status === "ABSENT").length,
        };

        return NextResponse.json({ summary, data: records });
    } catch (error) {
        console.error("GET /api/attendance/records error:", error);
        return NextResponse.json({ error: "Gagal memuat rekap kehadiran" }, { status: 500 });
    }
}

// PATCH /api/attendance/records — Ubah / verifikasi status kehadiran (Sekretaris / BPH / Admin)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !isOfficerOrStaff(session.user)) {
            return NextResponse.json({ error: "Unauthorized: Hanya sekretaris/pengurus yang dapat mengubah rekap kehadiran" }, { status: 403 });
        }

        const body = await req.json();
        const { recordId, status, notes } = body;

        if (!recordId) {
            return NextResponse.json({ error: "Record ID diperlukan" }, { status: 400 });
        }

        const updated = await prisma.attendanceRecord.update({
            where: { id: recordId },
            data: {
                ...(status ? { status: status as AttendanceStatus } : {}),
                ...(notes !== undefined ? { notes } : {}),
                verifiedById: session.user.id,
                isVerified: true,
            }
        });

        return NextResponse.json({ message: "Data kehadiran berhasil diperbarui", data: updated });
    } catch (error) {
        console.error("PATCH /api/attendance/records error:", error);
        return NextResponse.json({ error: "Gagal memperbarui status kehadiran" }, { status: 500 });
    }
}

// POST /api/attendance/records — Tambah absensi manual oleh pengurus (untuk peserta lain)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !isOfficerOrStaff(session.user)) {
            return NextResponse.json({ error: "Hanya pengurus yang dapat menambah absensi secara manual" }, { status: 403 });
        }

        const body = await req.json();
        const { sessionId, userId, status, notes } = body;

        if (!sessionId || !userId) {
            return NextResponse.json({ error: "sessionId dan userId wajib diisi" }, { status: 400 });
        }

        // Cek sesi ada
        const targetSession = await prisma.attendanceSession.findUnique({ where: { id: sessionId } });
        if (!targetSession) {
            return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
        }

        // Cek user ada (bisa pakai id langsung)
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!targetUser) {
            return NextResponse.json({ error: "User tidak ditemukan. Periksa User ID yang dimasukkan." }, { status: 404 });
        }

        // Cek duplikat
        const existing = await prisma.attendanceRecord.findUnique({
            where: { sessionId_userId: { sessionId, userId } }
        });
        if (existing) {
            return NextResponse.json({
                error: `${targetUser.name || userId} sudah memiliki data absensi di kegiatan ini.`
            }, { status: 409 });
        }

        const record = await prisma.attendanceRecord.create({
            data: {
                sessionId,
                userId,
                status: (status as AttendanceStatus) || "ABSENT",
                checkInTime: new Date(),
                notes: notes || `Ditambahkan manual oleh ${session.user.name || "pengurus"}`,
                isVerified: true,
                verifiedById: session.user.id,
                verifiedAt: new Date(),
            },
            include: {
                user: { select: { id: true, name: true, nis: true, kelas: true } }
            }
        });

        return NextResponse.json({ message: "Absensi manual berhasil ditambahkan", data: record }, { status: 201 });
    } catch (error) {
        console.error("POST /api/attendance/records error:", error);
        return NextResponse.json({ error: "Gagal menambah absensi" }, { status: 500 });
    }
}
