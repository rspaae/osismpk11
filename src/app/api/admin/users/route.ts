import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, Role, Division } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Ambil daftar user dengan Pagination, Search Server-side, & Filter Skala Besar (~1700+ Siswa)
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMINISTRATOR", "KESISWAAN", "PEMBINA", "BPH_OSIS", "BPH_MPK"].includes(session.user.role as any)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q")?.trim() || "";
        const role = searchParams.get("role") as Role | null;
        const division = searchParams.get("division") as Division | null;
        const kelas = searchParams.get("kelas")?.trim() || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limitParam = searchParams.get("limit") || "25";
        const limit = limitParam === "all" ? 5000 : Math.min(Math.max(parseInt(limitParam), 10), 500);
        const skip = limitParam === "all" ? 0 : (page - 1) * limit;

        // Bangun query where yang fleksibel & cepat
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

        // Jalankan query data & total count secara paralel
        const [users, totalCount, totalStudents, totalOfficers, classesRaw] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    nis: true,
                    nisn: true,
                    email: true,
                    role: true,
                    division: true,
                    position: true,
                    kelas: true,
                    major: true,
                    phone: true,
                    rfidCard: true,
                    isActive: true,
                    createdAt: true,
                },
                orderBy: [
                    { role: "asc" },
                    { kelas: "asc" },
                    { name: "asc" }
                ],
                skip: limitParam === "all" ? undefined : skip,
                take: limitParam === "all" ? undefined : limit,
            }),
            prisma.user.count({ where }),
            prisma.user.count({ where: { role: "STUDENT", isActive: true } }),
            prisma.user.count({ where: { role: { not: "STUDENT" }, isActive: true } }),
            prisma.user.findMany({
                where: { kelas: { not: null }, isActive: true },
                select: { kelas: true },
                distinct: ['kelas'],
                orderBy: { kelas: 'asc' }
            })
        ]);

        const uniqueClasses = classesRaw
            .map(c => c.kelas)
            .filter((k): k is string => Boolean(k && k.trim().length > 0));

        const totalPages = limitParam === "all" ? 1 : Math.ceil(totalCount / limit);

        const metaPayload = {
            page,
            limit: limitParam === "all" ? totalCount : limit,
            total: totalCount,
            totalPages,
            totalStudents,
            totalOfficers,
            uniqueClasses,
        };

        return NextResponse.json({
            data: users,
            pagination: metaPayload,
            meta: metaPayload,
            classes: uniqueClasses,
        });
    } catch (error) {
        console.error("GET /api/admin/users error:", error);
        return NextResponse.json({ error: "Gagal mengambil data user" }, { status: 500 });
    }
}

// POST: Buat user satuan
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMINISTRATOR", "KESISWAAN"].includes(session.user.role as any)) {
        return NextResponse.json({ error: "Unauthorized: Hanya Administrator & Kesiswaan yang dapat membuat user" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, nis, nisn, email, role, password, division, position, kelas, rfidCard } = body;

        if (!name || (!email && !nis)) {
            return NextResponse.json({ error: "Nama dan NIS/Email wajib diisi" }, { status: 400 });
        }

        const cleanNis = nis ? nis.trim() : null;
        const cleanEmail = email ? email.trim() : (cleanNis ? `${cleanNis}@smkn11bdg.sch.id` : null);
        const passToHash = password || cleanNis || "password123";

        // Cek duplikasi
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    cleanNis ? { nis: cleanNis } : {},
                    cleanEmail ? { email: cleanEmail } : {}
                ].filter(condition => Object.keys(condition).length > 0)
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: `User dengan NIS [${cleanNis}] atau Email [${cleanEmail}] sudah terdaftar` }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(passToHash, 10);
        const activePeriod = await prisma.academicPeriod.findFirst({ where: { isActive: true } });

        const newUser = await prisma.user.create({
            data: {
                name: name.trim(),
                nis: cleanNis,
                nisn: nisn ? nisn.trim() : null,
                email: cleanEmail,
                role: (role as Role) || "STUDENT",
                division: (division as Division) || "GENERAL",
                position: position ? position.trim() : null,
                kelas: kelas ? kelas.trim() : null,
                rfidCard: rfidCard ? rfidCard.trim() : null,
                periodId: activePeriod ? activePeriod.id : null,
                password: hashedPassword,
                isActive: true,
            },
        });

        return NextResponse.json({
            message: `User ${newUser.name} berhasil dibuat!`,
            data: newUser
        }, { status: 201 });
    } catch (error) {
        console.error("POST /api/admin/users error:", error);
        return NextResponse.json({ error: "Gagal membuat user" }, { status: 500 });
    }
}
