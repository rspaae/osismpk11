import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: Submit a new aspiration
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "STUDENT") {
        return NextResponse.json({ error: "Hanya siswa yang dapat mengirim aspirasi" }, { status: 403 });
    }

    try {
        const { title, content, category } = await req.json();

        if (!title || !content || !category) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        const aspiration = await prisma.aspiration.create({
            data: {
                title,
                content,
                category,
                userId: session.user.id,
            },
        });

        return NextResponse.json(aspiration, { status: 201 });
    } catch (error) {
        console.error("Error creating aspiration:", error);
        return NextResponse.json({ error: "Gagal mengirim aspirasi" }, { status: 500 });
    }
}

// GET: List all aspirations (Admin/Staff only)
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMINISTRATOR", "PEMBINA", "DEWAN"].includes(session.user.role as string)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const aspirations = await prisma.aspiration.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(aspirations);
    } catch (error) {
        console.error("Error fetching aspirations:", error);
        return NextResponse.json({ error: "Gagal mengambil data aspirasi" }, { status: 500 });
    }
}
