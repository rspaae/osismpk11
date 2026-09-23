import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = ["ADMINISTRATOR", "KESISWAAN", "PEMBINA", "BPH_OSIS", "BPH_MPK", "SEKBID_OFFICER", "KOMISI_OFFICER"];

// PATCH /api/activities/[id] — Update status atau konten
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !ALLOWED_ROLES.includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, excerpt, content, coverImage, category, division, status, eventDate } = body;

        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (content !== undefined) updateData.content = content;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (category !== undefined) updateData.category = category;
        if (division !== undefined) updateData.division = division;
        if (status !== undefined) updateData.status = status;
        if (eventDate !== undefined) updateData.eventDate = eventDate ? new Date(eventDate) : null;

        const activity = await prisma.activity.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json({ message: "Berhasil diperbarui", data: activity });
    } catch (error) {
        console.error("PATCH /api/activities/[id] error:", error);
        return NextResponse.json({ error: "Gagal memperbarui kegiatan" }, { status: 500 });
    }
}

// DELETE /api/activities/[id] — Hapus artikel
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !ALLOWED_ROLES.includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.activity.delete({ where: { id: params.id } });

        return NextResponse.json({ message: "Artikel berhasil dihapus" });
    } catch (error) {
        console.error("DELETE /api/activities/[id] error:", error);
        return NextResponse.json({ error: "Gagal menghapus artikel" }, { status: 500 });
    }
}
