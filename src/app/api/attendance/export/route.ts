import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, Division } from "@/lib/prisma";
import { isOfficerOrStaff, canExportAttendance } from "@/lib/permissions";
import { getCalculatedPiketWeek, getIndonesianDayName } from "@/lib/piketSchedule";

export const dynamic = "force-dynamic";

// Helper: Escape CSV fields to prevent formatting breaks and CSV injection
function escapeCSV(val: any): string {
    if (val === null || val === undefined) return "";
    let str = String(val).trim();
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        str = `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// GET /api/attendance/export — Export Rekapitulasi Absensi ke Format Spreadsheet (CSV / Excel)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !isOfficerOrStaff(session.user)) {
            return NextResponse.json(
                { error: "Akses ditolak: Hanya pengurus, pembina, dan administrator yang berhak mengekspor data absensi." },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const dutyType = searchParams.get("type") as "SAPA_PAGI" | "DANUS" | "ALL" | null; // "SAPA_PAGI" | "DANUS" | "ALL"
        const targetDiv = searchParams.get("division") as Division | null;

        // Otorisasi Ketat Berdasarkan Jobdesk & Divisi
        if (!canExportAttendance(session.user, dutyType, targetDiv)) {
            return NextResponse.json(
                {
                    error: `Akses ditolak: Anda tidak memiliki wewenang untuk mengekspor data absensi kategori '${dutyType || targetDiv || "ini"}'. Izin ekspor dibatasi sesuai jobdesk divisi Anda.`,
                },
                { status: 403 }
            );
        }
        const category = searchParams.get("category") || "FULL_PERIOD"; // "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "SPECIFIC_DATE" | "SPECIFIC_MONTH" | "CUSTOM_RANGE" | "FULL_PERIOD"
        const specificDate = searchParams.get("date"); // e.g. "2026-09-20"
        const specificMonth = searchParams.get("month"); // e.g. "2026-09"
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Build database query filter
        const whereClause: any = {
            session: {
                targetDivision: {
                    in: ["SEKBID_2", "SEKBID_6"] as Division[]
                }
            }
        };

        if (dutyType === "SAPA_PAGI") {
            whereClause.session.targetDivision = "SEKBID_2";
        } else if (dutyType === "DANUS") {
            whereClause.session.targetDivision = "SEKBID_6";
        }

        // Kategori Tanggal Spesifik
        const now = new Date();
        let filterCategoryLabel = "Seluruh 1 Periode Kepengurusan";

        if (category === "TODAY" || (category === "SPECIFIC_DATE" && specificDate)) {
            const target = category === "SPECIFIC_DATE" && specificDate ? new Date(specificDate) : now;
            const s = new Date(target); s.setHours(0, 0, 0, 0);
            const e = new Date(target); e.setHours(23, 59, 59, 999);
            whereClause.session.date = { gte: s, lte: e };
            filterCategoryLabel = `Tanggal Spesifik: ${target.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`;
        } else if (category === "THIS_WEEK") {
            // Hitung Senin s/d Jumat pekan ini
            const currentDay = now.getDay(); // 0: Sun, 1: Mon, ...
            const diffToMonday = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
            const monday = new Date(now); monday.setDate(diffToMonday); monday.setHours(0, 0, 0, 0);
            const friday = new Date(monday); friday.setDate(monday.getDate() + 4); friday.setHours(23, 59, 59, 999);
            whereClause.session.date = { gte: monday, lte: friday };
            filterCategoryLabel = `Minggu Ini (${monday.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - ${friday.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })})`;
        } else if (category === "THIS_MONTH" || (category === "SPECIFIC_MONTH" && specificMonth)) {
            let y = now.getFullYear();
            let m = now.getMonth() + 1;
            if (category === "SPECIFIC_MONTH" && specificMonth) {
                const parts = specificMonth.split("-").map(Number);
                y = parts[0];
                m = parts[1];
            }
            const startMonth = new Date(y, m - 1, 1, 0, 0, 0, 0);
            const endMonth = new Date(y, m, 0, 23, 59, 59, 999);
            whereClause.session.date = { gte: startMonth, lte: endMonth };
            filterCategoryLabel = `Bulan Spesifik: ${startMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`;
        } else if (category === "CUSTOM_RANGE" && startDate && endDate) {
            const s = new Date(startDate); s.setHours(0, 0, 0, 0);
            const e = new Date(endDate); e.setHours(23, 59, 59, 999);
            whereClause.session.date = { gte: s, lte: e };
            filterCategoryLabel = `Rentang Tanggal: ${s.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} s/d ${e.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`;
        }

        // Ambil Data Periode Aktif
        const activePeriod = await prisma.academicPeriod.findFirst({
            where: { isActive: true }
        });

        const periodTitle = activePeriod
            ? `${activePeriod.name} (${activePeriod.cabinetNameOsis || "Navastra"} x ${activePeriod.cabinetNameMpk || "Navandya"})`
            : "2025/2026 (Navastra x Navandya)";

        // Query seluruh record kehadiran dengan relasi lengkap
        const records = await prisma.attendanceRecord.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        name: true,
                        nis: true,
                        kelas: true,
                        role: true,
                        division: true,
                        position: true,
                    }
                },
                session: {
                    select: {
                        title: true,
                        targetDivision: true,
                        date: true,
                        startTime: true,
                        endTime: true,
                        location: true,
                    }
                },
                verifiedBy: {
                    select: { name: true }
                }
            },
            orderBy: [
                { session: { date: "desc" } },
                { checkInTime: "asc" }
            ]
        });

        // Hitung statistik ringkasan
        const total = records.length;
        let onTimeCount = 0;
        let lateCount = 0;
        let permissionCount = 0;
        let sickCount = 0;
        let absentCount = 0;

        records.forEach(r => {
            if (r.status === "PERMISSION") permissionCount++;
            else if (r.status === "SICK") sickCount++;
            else if (r.status === "ABSENT") absentCount++;
            else {
                // Evaluasi jam 06:00
                const checkInDate = new Date(r.checkInTime);
                const h = checkInDate.getHours();
                const m = checkInDate.getMinutes();
                if (h > 6 || (h === 6 && m > 0)) {
                    lateCount++;
                } else {
                    onTimeCount++;
                }
            }
        });

        const presentTotal = onTimeCount + lateCount;
        const onTimePercent = total > 0 ? Math.round((onTimeCount / total) * 100) : 0;
        const latePercent = total > 0 ? Math.round((lateCount / total) * 100) : 0;

        // Susun Baris CSV
        const exportTimestamp = new Date().toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        const lines: string[] = [];

        // UTF-8 BOM untuk kompatibilitas penuh Microsoft Excel & Google Sheets
        const BOM = "\uFEFF";

        // Header Dokumen Resmi
        lines.push("REKAPITULASI RESMI ABSENSI PIKET PENGURUS OSIS & MPK SMKN 11 BANDUNG");
        lines.push(`Periode Kepengurusan,${escapeCSV(periodTitle)}`);
        lines.push(`Kategori Filter Tanggal,${escapeCSV(filterCategoryLabel)}`);
        lines.push(`Waktu Ekspor,${escapeCSV(exportTimestamp + " WIB")}`);
        lines.push(`Batas Hadir,Maksimal Pukul 06:00 WIB`);
        lines.push("");

        // Ringkasan Statistik
        lines.push("RINGKASAN REKAPITULASI KEHADIRAN");
        lines.push(`Total Catatan Kehadiran,${total}`);
        lines.push(`Hadir Tepat Waktu (<= 06:00),${onTimeCount} (${onTimePercent}%)`);
        lines.push(`Hadir Terlambat (> 06:00),${lateCount} (${latePercent}%)`);
        lines.push(`Izin,${permissionCount}`);
        lines.push(`Sakit,${sickCount}`);
        lines.push(`Tidak Hadir (Alpa),${absentCount}`);
        lines.push("");

        // Header Tabel Kolom
        const tableHeaders = [
            "No",
            "Tanggal",
            "Hari",
            "Pekan",
            "Jenis Piket",
            "Nama Pengurus",
            "Organisasi",
            "NIS",
            "Kelas",
            "Status Kehadiran",
            "Jam Tap (WIB)",
            "Batas Waktu",
            "Evaluasi Ketepatan",
            "Lokasi Piket",
            "Keterangan / Catatan",
        ];
        lines.push(tableHeaders.join(","));

        // Baris Data
        records.forEach((rec, index) => {
            const dateObj = new Date(rec.session.date);
            const checkInDate = new Date(rec.checkInTime);

            const dateStr = dateObj.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            const dayName = getIndonesianDayName(dateObj);
            const weekNumber = getCalculatedPiketWeek(dateObj);

            const isSapaPagi = rec.session.targetDivision === "SEKBID_2";
            const dutyLabel = isSapaPagi ? "Sapa Pagi (Sekbid 2)" : "Danus (Sekbid 6)";

            const isMpk = rec.user?.role?.includes("MPK") || rec.user?.division?.includes("KOMISI");
            const orgLabel = isMpk ? "MPK" : "OSIS";

            const h = checkInDate.getHours();
            const m = checkInDate.getMinutes();
            const isLate = h > 6 || (h === 6 && m > 0);

            let statusLabel = "Hadir Tepat Waktu";
            let evaluationText = "Tepat Waktu (Sebelum 06:00)";

            if (rec.status === "PERMISSION") {
                statusLabel = "Izin";
                evaluationText = "Izin Resmi";
            } else if (rec.status === "SICK") {
                statusLabel = "Sakit";
                evaluationText = "Sakit";
            } else if (rec.status === "ABSENT") {
                statusLabel = "Tidak Hadir";
                evaluationText = "Alpa / Tidak Hadir";
            } else if (isLate || rec.status === "LATE") {
                statusLabel = "Terlambat";
                const diffMinutes = ((h - 6) * 60) + m;
                evaluationText = `Terlambat ${diffMinutes} menit (Lewat 06:00)`;
            }

            const checkInTimeStr = rec.status === "PRESENT" || rec.status === "LATE"
                ? checkInDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                : "—";

            const row = [
                index + 1,
                escapeCSV(dateStr),
                escapeCSV(dayName),
                escapeCSV(`Minggu Ke-${weekNumber}`),
                escapeCSV(dutyLabel),
                escapeCSV(rec.user?.name || "Pengurus"),
                escapeCSV(orgLabel),
                escapeCSV(rec.user?.nis || "—"),
                escapeCSV(rec.user?.kelas || "—"),
                escapeCSV(statusLabel),
                escapeCSV(checkInTimeStr),
                escapeCSV("06:00:00 WIB"),
                escapeCSV(evaluationText),
                escapeCSV(rec.session.location || "SMKN 11 Bandung"),
                escapeCSV(rec.notes || "—"),
            ];

            lines.push(row.join(","));
        });

        const csvContent = BOM + lines.join("\r\n");
        const filename = `Rekap_Absensi_Piket_OSIS-MPK_${dutyType || "ALL"}_${new Date().toISOString().split("T")[0]}.csv`;

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store, max-age=0",
            }
        });
    } catch (error) {
        console.error("GET /api/attendance/export error:", error);
        return NextResponse.json({ error: "Gagal mengekspor data absensi" }, { status: 500 });
    }
}
