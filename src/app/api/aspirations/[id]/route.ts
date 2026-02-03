import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { status } = await req.json();

        if (!["PENDING", "REVIEWED", "COMPLETED"].includes(status)) {
            return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
        }

        const aspiration = await prisma.aspiration.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(aspiration);
    } catch (error) {
        console.error("Error updating aspiration status:", error);
        return NextResponse.json({ error: "Gagal memperbarui status" }, { status: 500 });
    }
}
