import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, Role, Division } from "@/lib/prisma";
import { canExportUsers } from "@/lib/permissions";

export const dynamic = "force-dynamic";

function escapeCSV(val: any): string {
    if (val === null || val === undefined) return "";
    let str = String(val).trim();
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        str = `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// GET /api/admin/users/export — Export Data Siswa / Pengguna ke Berkas CSV dengan UTF-8 BOM
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || !canExportUsers(session.user)) {
            return NextResponse.json(
                { error: "Akses ditolak: Hanya Administrator IT, Kesiswaan, dan Pembina yang berhak mengekspor data pengguna." },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role") as Role | null;
        const division = searchParams.get("division") as Division | null;
        const kelas = searchParams.get("kelas")?.trim() || "";
        const q = searchParams.get("q")?.trim() || "";

        const where: any = { isActive: true };

        if (role && role !== ("ALL" as any)) {
            where.role = role;
        }

        if (division && division !== ("ALL" as any) && division !== ("GENERAL" as any)) {
            where.division = division;
        }

        if (kelas && kelas !== "ALL") {
            where.kelas = kelas;
        }

        if (q) {
            where.OR = [
                { name: { contains: q, mode: "insensitive" } },
                { nis: { contains: q, mode: "insensitive" } },
                { nisn: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { kelas: { contains: q, mode: "insensitive" } },
                { rfidCard: { contains: q, mode: "insensitive" } },
            ];
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                name: true,
                nis: true,
                nisn: true,
                kelas: true,
                major: true,
                email: true,
                phone: true,
                role: true,
                division: true,
                position: true,
                rfidCard: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: [
                { role: "asc" },
                { kelas: "asc" },
                { name: "asc" },
            ],
        });

        // Header CSV
        const BOM = "\uFEFF";
        let csv = BOM;
        csv += "No,Nama Lengkap,NIS,NISN,Kelas,Jurusan,Email,No Telepon,Peran (Role),Divisi,Jabatan,UID Kartu RFID,Status Akun,Tanggal Terdaftar\n";

        users.forEach((u, index) => {
            const row = [
                index + 1,
                escapeCSV(u.name),
                escapeCSV(u.nis || "-"),
                escapeCSV(u.nisn || "-"),
                escapeCSV(u.kelas || "-"),
                escapeCSV(u.major || "-"),
                escapeCSV(u.email || "-"),
                escapeCSV(u.phone || "-"),
                escapeCSV(u.role),
                escapeCSV(u.division || "-"),
                escapeCSV(u.position || "-"),
                escapeCSV(u.rfidCard || "-"),
                u.isActive ? "Aktif" : "Nonaktif",
                escapeCSV(new Date(u.createdAt).toLocaleDateString("id-ID")),
            ];
            csv += row.join(",") + "\n";
        });

        const filename = `data_pengguna_smkn11_${kelas && kelas !== "ALL" ? kelas.replace(/\s+/g, "_") : "semua"}_${new Date().toISOString().slice(0, 10)}.csv`;

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error: any) {
        console.error("Export users error:", error);
        return NextResponse.json({ error: error.message || "Gagal mengekspor data pengguna" }, { status: 500 });
    }
}
