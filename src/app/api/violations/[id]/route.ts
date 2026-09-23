import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/violations/[id] — Hapus catatan pelanggaran
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const violation = await prisma.studentViolation.findUnique({ where: { id } });
        if (!violation) {
            return NextResponse.json({ error: "Data pelanggaran tidak ditemukan" }, { status: 404 });
        }

        // Hanya pencatat atau admin yang boleh hapus
        const isAdmin = ["ADMINISTRATOR", "KESISWAAN", "PEMBINA"].includes(session.user.role as string);
        const isRecorder = violation.recordedById === session.user.id;

        if (!isAdmin && !isRecorder) {
            return NextResponse.json({ error: "Anda tidak memiliki izin menghapus data ini" }, { status: 403 });
        }

        await prisma.studentViolation.delete({ where: { id } });
        return NextResponse.json({ message: "Data pelanggaran berhasil dihapus" });
    } catch (error) {
        console.error("DELETE /api/violations/[id] error:", error);
        return NextResponse.json({ error: "Gagal menghapus data pelanggaran" }, { status: 500 });
    }
}
