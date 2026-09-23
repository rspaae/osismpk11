import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, Division } from "@/lib/prisma";
import { isOfficerOrStaff, canRespondAspirations } from "@/lib/permissions";
import { validatePublicSubmission } from "@/lib/security";

export const dynamic = 'force-dynamic';

// POST: Kirim aspirasi baru (Siswa atau Publik yang terotentikasi)
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Silakan login terlebih dahulu untuk mengirim aspirasi" }, { status: 401 });
    }

    try {
        const { title, content, category, isAnonymous, targetDivision } = await req.json();

        if (!title || !content || !category) {
            return NextResponse.json({ error: "Judul, isi aspirasi, dan kategori wajib diisi" }, { status: 400 });
        }

        // Anti-Judol, Anti-Spam & Injection Shield
        const securityCheck = validatePublicSubmission({ title, content, category });
        if (!securityCheck.isValid) {
            return NextResponse.json(
                { error: securityCheck.error || "Pesan aspirasi ditolak oleh sistem proteksi konten." },
                { status: 400 }
            );
        }

        const division: Division = targetDivision || "KOMISI_B";

        const aspiration = await prisma.aspiration.create({
            data: {
                title: title.trim(),
                content: content.trim(),
                category,
                targetDivision: division,
                isAnonymous: Boolean(isAnonymous),
                userId: session.user.id,
                status: "PENDING",
            },
        });

        return NextResponse.json({ message: "Aspirasi berhasil dikirim", data: aspiration }, { status: 201 });
    } catch (error) {
        console.error("Error creating aspiration:", error);
        return NextResponse.json({ error: "Gagal mengirim aspirasi" }, { status: 500 });
    }
}

// GET: Daftar aspirasi (Untuk Pengurus / Kesiswaan / Komisi B / Admin)
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !isOfficerOrStaff(session.user)) {
        return NextResponse.json({ error: "Akses ditolak: Hanya pengurus & staf yang dapat mengakses" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const division = searchParams.get("division") as Division | null;

        const where: any = {};
        if (status) where.status = status;
        if (division) where.targetDivision = division;

        const aspirations = await prisma.aspiration.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        nis: true,
                        kelas: true,
                    },
                },
                respondedBy: {
                    select: {
                        name: true,
                        role: true,
                        division: true,
                        position: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ data: aspirations });
    } catch (error) {
        console.error("Error fetching aspirations:", error);
        return NextResponse.json({ error: "Gagal mengambil data aspirasi" }, { status: 500 });
    }
}
