import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, AttendanceStatus, Division, AttendanceType } from "@/lib/prisma";
import { canAccessPiket, canManagePiket } from "@/lib/permissions";
import {
    SAPA_PAGI_ROSTER,
    DANUS_ROSTER,
    getIndonesianDayName,
    getCalculatedPiketWeek,
    PiketOfficer
} from "@/lib/piketSchedule";
import { getEffectiveSchedule } from "@/lib/piketOverrides.server";

export const dynamic = "force-dynamic";

// Helper: dapatkan atau buat otomatis sesi harian
async function getOrCreateDailySession(
    dutyType: "SAPA_PAGI" | "DANUS",
    targetDate: Date = new Date(),
    createdById?: string
) {
    const division: Division = dutyType === "SAPA_PAGI" ? "SEKBID_2" : "SEKBID_6";
    const typeLabel = dutyType === "SAPA_PAGI" ? "Sapa Pagi" : "Piket Danus";
    const location = dutyType === "SAPA_PAGI"
        ? "Gerbang Utama SMKN 11 Bandung"
        : "Stand Danus / Kantin Sekolah";

    // Set jam batas 06:00 WIB
    const startTime = "05:30";
    const endTime = "06:00";

    // Format tanggal string untuk title
    const dateStr = targetDate.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const title = `${typeLabel} (${dateStr})`;

    // Cari sesi pada tanggal ini (start of day to end of day)
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    let session = await prisma.attendanceSession.findFirst({
        where: {
            targetDivision: division,
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            records: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            nis: true,
                            kelas: true,
                            rfidCard: true,
                            role: true,
                            image: true,
                        }
                    }
                }
            }
        }
    });

    // Jika belum ada sesi hari ini, AUTO-CREATE secara otomatis di background
    if (!session) {
        // Cari admin/creator default jika createdById tidak ada
        let creatorId = createdById;
        if (!creatorId) {
            const adminUser = await prisma.user.findFirst({
                where: { role: "ADMINISTRATOR" },
                select: { id: true }
            });
            creatorId = adminUser?.id;
        }

        if (!creatorId) {
            const anyUser = await prisma.user.findFirst({ select: { id: true } });
            creatorId = anyUser?.id || "system";
        }

        const activePeriod = await prisma.academicPeriod.findFirst({
            where: { isActive: true },
            select: { id: true }
        });

        session = await prisma.attendanceSession.create({
            data: {
                title,
                type: "DUTY_PIKET" as AttendanceType,
                targetDivision: division,
                location,
                date: targetDate,
                startTime,
                endTime,
                isOpen: true,
                createdById: creatorId,
                periodId: activePeriod?.id || null,
                description: `Pencatatan kehadiran otomatis ${typeLabel}. Batas maksimal absensi pukul 06:00 WIB.`,
            },
            include: {
                records: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                nis: true,
                                kelas: true,
                                rfidCard: true,
                                role: true,
                                image: true,
                            }
                        }
                    }
                }
            }
        });
    }

    return session;
}

// GET /api/attendance/auto-piket — Dapatkan roster jadwal & status checklist kehadiran hari ini
export async function GET(req: NextRequest) {
    try {
        const authSession = await getServerSession(authOptions);
        if (!authSession?.user?.id) {
            return NextResponse.json({ error: "Unauthorized. Silakan masuk terlebih dahulu." }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = (searchParams.get("type") || "SAPA_PAGI") as "SAPA_PAGI" | "DANUS";

        if (!canAccessPiket(authSession.user, type)) {
            return NextResponse.json(
                { error: `Akses ditolak: Anda tidak memiliki wewenang untuk mengakses piket '${type}'. Wewenang dibatasi untuk Sekbid terkait, BPH, Pembina, Kesiswaan, dan Admin.` },
                { status: 403 }
            );
        }

        const customDateStr = searchParams.get("date");
        const customWeek = searchParams.get("week") ? parseInt(searchParams.get("week")!) as 1 | 2 : null;
        const customDay = searchParams.get("day")?.toUpperCase();

        const targetDate = customDateStr ? new Date(customDateStr) : new Date();
        const activeDay = (customDay && ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"].includes(customDay))
            ? customDay
            : getIndonesianDayName(targetDate);
        const activeWeek = customWeek || getCalculatedPiketWeek(targetDate);

        // Ambil roster jadwal efektif (termasuk hasil tukar jadwal)
        const scheduledOfficers: PiketOfficer[] = getEffectiveSchedule(
            type,
            activeWeek,
            activeDay,
            customDateStr || undefined
        );

        // Ambil atau buat otomatis sesi absensi tanggal ini
        const dailySession = await getOrCreateDailySession(type, targetDate);

        // Map data checklist per pengurus terjadwal
        const checklist = scheduledOfficers.map((officer, index) => {
            // Cari apakah pengurus ini sudah ada record absensi di sesi ini
            const record = dailySession.records.find((r: any) => {
                if (!r.user?.name) return false;
                const rName = r.user.name.toLowerCase().trim();
                const oName = officer.name.toLowerCase().trim();
                return rName === oName || rName.includes(oName) || oName.includes(rName);
            });

            const isChecked = !!record;
            const checkInTime = record ? record.checkInTime : null;

            // Evaluasi keterlambatan berdasarkan waktu check-in (maksimal 06:00:00)
            let isOnTime = true;
            if (checkInTime) {
                const checkInDate = new Date(checkInTime);
                const hours = checkInDate.getHours();
                const minutes = checkInDate.getMinutes();
                if (hours > 6 || (hours === 6 && minutes > 0)) {
                    isOnTime = false;
                }
            }

            return {
                id: record?.id || `scheduled-${index}`,
                name: officer.name,
                org: officer.org,
                division: officer.division,
                user: record?.user || null,
                isChecked,
                status: record?.status || "ABSENT",
                checkInTime,
                isOnTime,
                notes: record?.notes || null,
            };
        });

        // Rekap ringkas
        const summary = {
            totalScheduled: scheduledOfficers.length,
            present: checklist.filter(c => c.isChecked && (c.status === "PRESENT" || c.status === "LATE")).length,
            onTime: checklist.filter(c => c.isChecked && c.isOnTime && c.status === "PRESENT").length,
            late: checklist.filter(c => c.isChecked && (!c.isOnTime || c.status === "LATE")).length,
            permission: checklist.filter(c => c.isChecked && (c.status === "PERMISSION" || c.status === "SICK")).length,
            absent: checklist.filter(c => !c.isChecked || c.status === "ABSENT").length,
        };

        return NextResponse.json({
            success: true,
            dutyType: type,
            date: targetDate.toISOString(),
            dayName: activeDay,
            weekNumber: activeWeek,
            session: {
                id: dailySession.id,
                title: dailySession.title,
                isOpen: dailySession.isOpen,
                startTime: dailySession.startTime,
                endTime: dailySession.endTime,
                location: dailySession.location,
            },
            summary,
            checklist,
            allSessionsToday: dailySession.records,
        });
    } catch (error) {
        console.error("GET /api/attendance/auto-piket error:", error);
        return NextResponse.json({ error: "Gagal memuat jadwal & absensi otomatis" }, { status: 500 });
    }
}

// POST /api/attendance/auto-piket — Tap Kartu RFID / Ceklis kehadiran otomatis
export async function POST(req: NextRequest) {
    try {
        const sessionAuth = await getServerSession(authOptions);
        if (!sessionAuth?.user?.id) {
            return NextResponse.json({ error: "Unauthorized. Silakan masuk terlebih dahulu." }, { status: 401 });
        }

        const body = await req.json();
        const {
            officerName,
            rfidCard,
            nis,
            dutyType = "SAPA_PAGI",
            customStatus,
            notes,
            date
        } = body;

        // Otorisasi Kelola Piket (Sekbid 2 -> Sapa Pagi, Sekbid 6 -> Danus, BPH/Admin/Pembina -> Semua)
        if (!canManagePiket(sessionAuth.user, dutyType)) {
            return NextResponse.json(
                { error: `Akses ditolak: Anda tidak memiliki wewenang untuk mencatat / mengelola absensi piket '${dutyType}'.` },
                { status: 403 }
            );
        }

        const targetDate = date ? new Date(date) : new Date();

        // 1. Ambil atau buat otomatis sesi hari ini
        const session = await getOrCreateDailySession(dutyType, targetDate, sessionAuth.user.id);

        // 2. Cari User di Database berdasarkan RFID / NIS / Nama
        let user = null;
        if (rfidCard) {
            user = await prisma.user.findFirst({
                where: { rfidCard: rfidCard.trim(), isActive: true }
            });
        }

        if (!user && nis) {
            user = await prisma.user.findFirst({
                where: { nis: nis.trim(), isActive: true }
            });
        }

        if (!user && officerName) {
            user = await prisma.user.findFirst({
                where: {
                    name: { contains: officerName.trim(), mode: "insensitive" },
                    isActive: true
                }
            });
        }

        // Jika user belum terdaftar di database, buat akun pengurus otomatis
        if (!user && officerName) {
            const sanitizedEmail = `piket.${officerName.toLowerCase().replace(/[^a-z0-9]/g, "")}@smkn11bdg.sch.id`;
            user = await prisma.user.create({
                data: {
                    name: officerName.trim(),
                    email: sanitizedEmail,
                    role: "SEKBID_OFFICER",
                    division: dutyType === "SAPA_PAGI" ? "SEKBID_2" : "SEKBID_6",
                    position: dutyType === "SAPA_PAGI" ? "Pengurus Piket Sapa Pagi" : "Pengurus Piket Danus",
                    rfidCard: rfidCard ? rfidCard.trim() : null,
                    nis: nis ? nis.trim() : null,
                }
            });
        }

        if (!user) {
            return NextResponse.json({
                error: "Pengurus tidak ditemukan. Masukkan nama pengurus yang valid."
            }, { status: 404 });
        }

        // 3. Cek apakah kartu/nama ini terjadwal hari ini (termasuk hasil tukar jadwal)
        const activeDay = getIndonesianDayName(targetDate);
        const activeWeek = getCalculatedPiketWeek(targetDate);
        const targetDateStr = targetDate.toISOString().split("T")[0];
        const scheduledOfficers = getEffectiveSchedule(dutyType, activeWeek, activeDay, targetDateStr);
        const isScheduledToday = scheduledOfficers.some(o =>
            o.name.toLowerCase().includes(user!.name?.toLowerCase() || "") ||
            (user!.name || "").toLowerCase().includes(o.name.toLowerCase())
        );

        // 4. Tentukan Status Kehadiran (Evaluasi batas jam 06:00 WIB)
        const now = new Date();
        const checkInTime = now;
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const isLate = hours > 6 || (hours === 6 && minutes > 0);

        let finalStatus: AttendanceStatus = "PRESENT";
        if (customStatus) {
            finalStatus = customStatus as AttendanceStatus;
        } else if (isLate) {
            finalStatus = "LATE";
        }

        // 5. Cek apakah sudah pernah absen di sesi hari ini
        const existingRecord = await prisma.attendanceRecord.findUnique({
            where: {
                sessionId_userId: {
                    sessionId: session.id,
                    userId: user.id,
                }
            }
        });

        let record;
        if (existingRecord) {
            // Update status jika diubah oleh admin
            record = await prisma.attendanceRecord.update({
                where: { id: existingRecord.id },
                data: {
                    status: finalStatus,
                    notes: notes || (isLate ? "Hadir (Tap setelah 06:00 WIB)" : "Hadir Tepat Waktu"),
                },
                include: { user: true }
            });
        } else {
            // Buat record baru
            record = await prisma.attendanceRecord.create({
                data: {
                    sessionId: session.id,
                    userId: user.id,
                    status: finalStatus,
                    checkInTime,
                    notes: notes || (
                        isLate
                            ? "Hadir (Tap setelah batas 06:00 WIB)"
                            : (rfidCard ? `RFID Tap (${rfidCard})` : "Hadir Tepat Waktu")
                    ),
                    isVerified: true,
                },
                include: { user: true }
            });
        }

        const formattedTime = checkInTime.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        });

        return NextResponse.json({
            success: true,
            message: existingRecord
                ? `Data kehadiran ${user.name} diperbarui: ${finalStatus}`
                : `Absensi Berhasil! ${user.name} dicatat ${finalStatus === "LATE" ? "Terlambat (lewat 06:00)" : "Hadir"} pada ${formattedTime}`,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                nis: user.nis,
                kelas: user.kelas,
            },
            record,
            isScheduledToday,
            isOnTime: !isLate,
            time: formattedTime,
        }, { status: 201 });
    } catch (error) {
        console.error("POST /api/attendance/auto-piket error:", error);
        return NextResponse.json({ error: "Gagal memproses absensi otomatis" }, { status: 500 });
    }
}
