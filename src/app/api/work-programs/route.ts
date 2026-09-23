import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, Division, ProkerStatus } from "@/lib/prisma";
import { canManageDivision, canEvaluateWorkPrograms } from "@/lib/permissions";

// GET /api/work-programs — Ambil program kerja per Sekbid/Komisi
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const division = searchParams.get("division") as Division | null;
        const status = searchParams.get("status") as ProkerStatus | null;

        const where: any = {};
        if (division) where.division = division;
        if (status) where.status = status;

        const prokers = await prisma.workProgram.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        division: true,
                        position: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ data: prokers });
    } catch (error) {
        console.error("GET /api/work-programs error:", error);
        return NextResponse.json({ error: "Gagal mengambil data program kerja" }, { status: 500 });
    }
}

// POST /api/work-programs — Tambah program kerja baru
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, division, targetPeriod, budget, personInCharge } = body;

        if (!title || !description || !division) {
            return NextResponse.json({ error: "Judul, deskripsi, dan divisi wajib diisi" }, { status: 400 });
        }

        const targetDivision: Division = division;

        // Check permission
        const user = session.user;
        if (!canManageDivision(user, targetDivision)) {
            return NextResponse.json({ error: "Anda tidak memiliki wewenang membuat program kerja untuk divisi ini" }, { status: 403 });
        }

        const proker = await prisma.workProgram.create({
            data: {
                title,
                description,
                division: targetDivision,
                targetPeriod: targetPeriod || "Periode 2026/2027",
                budget: budget ? parseFloat(budget) : 0,
                personInCharge: personInCharge || user.name || "Pengurus Bidang",
                status: "PLANNED",
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        division: true,
                    }
                }
            }
        });

        return NextResponse.json({ message: "Program kerja berhasil dibuat", data: proker }, { status: 201 });
    } catch (error) {
        console.error("POST /api/work-programs error:", error);
        return NextResponse.json({ error: "Gagal membuat program kerja" }, { status: 500 });
    }
}

// PATCH /api/work-programs — Update status / evaluasi (Komisi D / Pembina / Admin / Pengurus)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, status, evaluationNotes } = body;

        if (!id) {
            return NextResponse.json({ error: "ID program kerja diperlukan" }, { status: 400 });
        }

        const existing = await prisma.workProgram.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Program kerja tidak ditemukan" }, { status: 404 });
        }

        const user = session.user;
        const canEdit = canManageDivision(user, existing.division) || canEvaluateWorkPrograms(user);

        if (!canEdit) {
            return NextResponse.json({ error: "Anda tidak memiliki izin mengubah program kerja ini" }, { status: 403 });
        }

        const updated = await prisma.workProgram.update({
            where: { id },
            data: {
                ...(status ? { status } : {}),
                ...(evaluationNotes ? { evaluationNotes } : {}),
            }
        });

        return NextResponse.json({ message: "Program kerja berhasil diperbarui", data: updated });
    } catch (error) {
        console.error("PATCH /api/work-programs error:", error);
        return NextResponse.json({ error: "Gagal memperbarui program kerja" }, { status: 500 });
    }
}
