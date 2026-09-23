import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET: Fetch current user's submitted aspirations
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const aspirations = await prisma.aspiration.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(aspirations);
    } catch (error) {
        console.error("Error fetching user aspirations:", error);
        return NextResponse.json({ error: "Gagal mengambil data riwayat aspirasi" }, { status: 500 });
    }
}
