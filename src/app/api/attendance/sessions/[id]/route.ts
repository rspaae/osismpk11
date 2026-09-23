import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, AttendanceStatus } from "@/lib/prisma";
import { isOfficerOrStaff } from "@/lib/permissions";

// GET /api/attendance/sessions/[id] — Detail sesi + statistik + daftar rekap
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const attendanceSession = await prisma.attendanceSession.findUnique({
            where: { id },
            include: {
                creator: {
                    select: { id: true, name: true, role: true, position: true }
                },
                records: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                nis: true,
                                kelas: true,
                                role: true,
                                division: true,
                                position: true,
                                image: true,
                            }
                        },
                        verifiedBy: {
                            select: { id: true, name: true }
                        }
                    },
                    orderBy: { checkInTime: "asc" }
                },
                _count: {
                    select: { records: true }
                }
            }
        });

        if (!attendanceSession) {
            return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
        }

        // Hitung statistik
        const records = attendanceSession.records;
        const summary = {
            total: records.length,
            present: records.filter(r => r.status === "PRESENT").length,
            late: records.filter(r => r.status === "LATE").length,
            permission: records.filter(r => r.status === "PERMISSION").length,
            sick: records.filter(r => r.status === "SICK").length,
            absent: records.filter(r => r.status === "ABSENT").length,
            attendanceRate: records.length > 0
                ? Math.round(
                    (records.filter(r => r.status === "PRESENT" || r.status === "LATE").length / records.length) * 100
                )
                : 0,
        };

        return NextResponse.json({ data: attendanceSession, summary });
    } catch (error) {
        console.error("GET /api/attendance/sessions/[id] error:", error);
        return NextResponse.json({ error: "Gagal memuat detail sesi" }, { status: 500 });
    }
}

// PATCH /api/attendance/sessions/[id] — Buka/tutup sesi atau update info sesi (officer only)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !isOfficerOrStaff(session.user)) {
            return NextResponse.json({ error: "Hanya pengurus yang dapat mengubah sesi presensi" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { isOpen, title, description, location, startTime, endTime } = body;

        // Cek sesi ada
        const existing = await prisma.attendanceSession.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
        }

        const updated = await prisma.attendanceSession.update({
            where: { id },
            data: {
                ...(isOpen !== undefined ? { isOpen } : {}),
                ...(title ? { title } : {}),
                ...(description !== undefined ? { description } : {}),
                ...(location ? { location } : {}),
                ...(startTime ? { startTime } : {}),
                ...(endTime ? { endTime } : {}),
            }
        });

        const action = isOpen === true ? "dibuka" : isOpen === false ? "ditutup" : "diperbarui";
        return NextResponse.json({
            message: `Sesi presensi berhasil ${action}`,
            data: updated
        });
    } catch (error) {
        console.error("PATCH /api/attendance/sessions/[id] error:", error);
        return NextResponse.json({ error: "Gagal memperbarui sesi" }, { status: 500 });
    }
}

// DELETE /api/attendance/sessions/[id] — Hapus sesi (admin only, jika belum ada rekap)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !isOfficerOrStaff(session.user)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;

        // Cek apakah sudah ada rekap — jika ya, tolak hapus
        const recordCount = await prisma.attendanceRecord.count({ where: { sessionId: id } });
        if (recordCount > 0) {
            return NextResponse.json({
                error: `Tidak dapat menghapus sesi yang sudah memiliki ${recordCount} data absensi. Tutup sesi saja.`
            }, { status: 409 });
        }

        await prisma.attendanceSession.delete({ where: { id } });
        return NextResponse.json({ message: "Sesi berhasil dihapus" });
    } catch (error) {
        console.error("DELETE /api/attendance/sessions/[id] error:", error);
        return NextResponse.json({ error: "Gagal menghapus sesi" }, { status: 500 });
    }
}
