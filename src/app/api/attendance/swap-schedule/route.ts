import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManagePiket } from "@/lib/permissions";
import {
    ScheduleSwap,
    SAPA_PAGI_ROSTER,
    DANUS_ROSTER
} from "@/lib/piketSchedule";
import { getSavedSwaps, saveSwaps } from "@/lib/piketOverrides.server";

export const dynamic = "force-dynamic";

// GET /api/attendance/swap-schedule — Ambil riwayat / daftar tukar jadwal aktif
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") as "SAPA_PAGI" | "DANUS" | null;

        const allSwaps = getSavedSwaps();
        const filtered = type ? allSwaps.filter(s => s.type === type) : allSwaps;

        return NextResponse.json({
            success: true,
            data: filtered,
        });
    } catch (error) {
        console.error("GET /api/attendance/swap-schedule error:", error);
        return NextResponse.json({ error: "Gagal memuat data tukar jadwal" }, { status: 500 });
    }
}

// POST /api/attendance/swap-schedule — Buat / ajukan tukar jadwal antar pengurus
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const {
            type = "SAPA_PAGI",
            sourceWeek,
            sourceDay,
            sourceOfficer,
            sourceOrg = "OSIS",
            targetWeek,
            targetDay,
            targetOfficer,
            targetOrg = "OSIS",
            specificDate,
            reason,
        } = body;

        // Validasi Otoritas Khusus (Sekbid 2 untuk Sapa Pagi, Sekbid 6 untuk Danus, atau Pimpinan)
        if (!session?.user?.id || !canManagePiket(session.user, type)) {
            const roleName = type === "SAPA_PAGI" ? "Sekbid 2 (Budi Pekerti)" : "Sekbid 6 (Danus)";
            return NextResponse.json(
                { error: `Hanya pengurus ${roleName} atau pimpinan BPH/Pembina yang berhak menukar jadwal ini.` },
                { status: 403 }
            );
        }

        if (!sourceOfficer || !targetOfficer || !sourceDay || !targetDay) {
            return NextResponse.json(
                { error: "Nama pengurus dan hari yang ditukar wajib diisi lengkap." },
                { status: 400 }
            );
        }

        const newSwap: ScheduleSwap = {
            id: `swap-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            type,
            sourceWeek: parseInt(sourceWeek) as 1 | 2,
            sourceDay,
            sourceOfficer: sourceOfficer.trim(),
            sourceOrg,
            targetWeek: parseInt(targetWeek) as 1 | 2,
            targetDay,
            targetOfficer: targetOfficer.trim(),
            targetOrg,
            specificDate: specificDate || undefined,
            reason: reason || "Tukar jadwal piket antar pengurus",
            swappedBy: session.user.name || "Pengurus",
            createdAt: new Date().toISOString(),
        };

        const existingSwaps = getSavedSwaps();
        existingSwaps.unshift(newSwap);
        saveSwaps(existingSwaps);

        return NextResponse.json({
            success: true,
            message: `Jadwal berhasil ditukar! ${newSwap.sourceOfficer} (${newSwap.sourceDay}) bertukar dengan ${newSwap.targetOfficer} (${newSwap.targetDay}). Besok sistem akan otomatis menceklis nama yang baru.`,
            data: newSwap,
        }, { status: 201 });
    } catch (error) {
        console.error("POST /api/attendance/swap-schedule error:", error);
        return NextResponse.json({ error: "Gagal menyimpan tukar jadwal" }, { status: 500 });
    }
}

// DELETE /api/attendance/swap-schedule — Batalkan / hapus tukar jadwal
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(req.url);
        const swapId = searchParams.get("id");

        if (!swapId) {
            return NextResponse.json({ error: "Swap ID diperlukan" }, { status: 400 });
        }

        const existingSwaps = getSavedSwaps();
        const target = existingSwaps.find(s => s.id === swapId);

        if (!target) {
            return NextResponse.json({ error: "Data tukar jadwal tidak ditemukan" }, { status: 404 });
        }

        if (!session?.user?.id || !canManagePiket(session.user, target.type)) {
            return NextResponse.json({ error: "Anda tidak memiliki hak akses untuk membatalkan tukar jadwal ini" }, { status: 403 });
        }

        const updated = existingSwaps.filter(s => s.id !== swapId);
        saveSwaps(updated);

        return NextResponse.json({
            success: true,
            message: "Tukar jadwal berhasil dibatalkan dan dikembalikan ke jadwal semula.",
        });
    } catch (error) {
        console.error("DELETE /api/attendance/swap-schedule error:", error);
        return NextResponse.json({ error: "Gagal membatalkan tukar jadwal" }, { status: 500 });
    }
}
