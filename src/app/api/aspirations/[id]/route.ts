import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, AspirationStatus } from "@/lib/prisma";
import { canRespondAspirations, isSuperOrLeadership } from "@/lib/permissions";

export const dynamic = 'force-dynamic';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id || !canRespondAspirations(session.user)) {
        return NextResponse.json({ error: "Unauthorized: Anda tidak memiliki wewenang menindaklanjuti aspirasi" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { status, response } = body;

        const validStatuses: AspirationStatus[] = ["PENDING", "IN_REVIEW", "APPROVED", "REJECTED", "RESOLVED"];

        const updateData: {
            status?: AspirationStatus;
            response?: string;
            respondedAt?: Date;
            respondedById?: string;
        } = {};

        if (status) {
            const statusUpper = status.toUpperCase() as AspirationStatus;
            if (!validStatuses.includes(statusUpper)) {
                return NextResponse.json({ error: "Status aspirasi tidak valid" }, { status: 400 });
            }
            updateData.status = statusUpper;
        }

        if (typeof response === "string") {
            updateData.response = response.trim();
            updateData.respondedAt = new Date();
            updateData.respondedById = session.user.id;
        }

        const aspiration = await prisma.aspiration.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        name: true,
                        nis: true,
                    }
                },
                respondedBy: {
                    select: {
                        name: true,
                        role: true,
                        division: true,
                    }
                }
            }
        });

        return NextResponse.json({ message: "Aspirasi berhasil diperbarui", data: aspiration });
    } catch (error) {
        console.error("Error updating aspiration:", error);
        return NextResponse.json({ error: "Gagal memperbarui aspirasi" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id || !isSuperOrLeadership(session.user)) {
        return NextResponse.json({ error: "Unauthorized: Hanya pimpinan/admin yang dapat menghapus aspirasi" }, { status: 403 });
    }

    try {
        await prisma.aspiration.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Aspirasi berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting aspiration:", error);
        return NextResponse.json({ error: "Gagal menghapus aspirasi" }, { status: 500 });
    }
}
