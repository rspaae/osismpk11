import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/violations — Daftar pelanggaran siswa
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const studentClass = searchParams.get("class");
        const severity = searchParams.get("severity");
        const context = searchParams.get("context");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const search = searchParams.get("search");

        const where: any = {};
        if (studentClass) where.studentClass = studentClass;
        if (severity) where.severity = severity;
        if (context) where.context = { contains: context, mode: "insensitive" };
        if (search) {
            where.OR = [
                { studentName: { contains: search, mode: "insensitive" } },
                { violationType: { contains: search, mode: "insensitive" } },
            ];
        }
        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom) where.date.gte = new Date(dateFrom);
            if (dateTo) {
                const to = new Date(dateTo);
                to.setHours(23, 59, 59, 999);
                where.date.lte = to;
            }
        }

        const violations = await prisma.studentViolation.findMany({
            where,
            include: {
                recordedBy: {
                    select: { id: true, name: true, position: true },
                },
            },
            orderBy: { date: "desc" },
        });

        // Hitung rekap per kelas
        const recapByClass = await prisma.studentViolation.groupBy({
            by: ["studentClass"],
            _count: { id: true },
        });

        return NextResponse.json({ data: violations, recap: recapByClass });
    } catch (error) {
        console.error("GET /api/violations error:", error);
        return NextResponse.json({ error: "Gagal memuat data pelanggaran" }, { status: 500 });
    }
}

// POST /api/violations — Catat pelanggaran baru
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { studentName, studentClass, violationType, context, notes, severity, date, pointDeduction } = body;

        if (!studentName || !studentClass || !violationType) {
            return NextResponse.json(
                { error: "Nama siswa, kelas, dan jenis pelanggaran wajib diisi" },
                { status: 400 }
            );
        }

        const violation = await prisma.studentViolation.create({
            data: {
                studentName: studentName.trim(),
                studentClass: studentClass.trim(),
                violationType: violationType.trim(),
                context: context?.trim() || null,
                notes: notes?.trim() || null,
                severity: severity || "RINGAN",
                date: date ? new Date(date) : new Date(),
                pointDeduction: pointDeduction || 0,
                recordedById: session.user.id,
            },
            include: {
                recordedBy: {
                    select: { name: true, position: true },
                },
            },
        });

        return NextResponse.json({ message: "Pelanggaran berhasil dicatat", data: violation }, { status: 201 });
    } catch (error) {
        console.error("POST /api/violations error:", error);
        return NextResponse.json({ error: "Gagal mencatat pelanggaran" }, { status: 500 });
    }
}
