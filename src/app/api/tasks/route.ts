import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, Division, TaskPriority, TaskStatus } from "@/lib/prisma";
import { isOfficerOrStaff, canManageDivision } from "@/lib/permissions";

// GET /api/tasks — Daftar tugas anggota / divisi
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const division = searchParams.get("division") as Division | null;
        const status = searchParams.get("status") as TaskStatus | null;
        const myTasksOnly = searchParams.get("my") === "true";

        const where: any = {};
        if (myTasksOnly) where.assignedToId = session.user.id;
        if (division) where.division = division;
        if (status) where.status = status;

        const tasks = await prisma.memberTask.findMany({
            where,
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        division: true,
                        position: true,
                        kelas: true,
                        image: true,
                    }
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        position: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ data: tasks });
    } catch (error) {
        console.error("GET /api/tasks error:", error);
        return NextResponse.json({ error: "Gagal memuat daftar tugas" }, { status: 500 });
    }
}

// POST /api/tasks — Berikan tugas baru ke anggota
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !isOfficerOrStaff(session.user)) {
            return NextResponse.json({ error: "Hanya pengurus yang berhak memberikan tugas" }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, division, priority, dueDate, assignedToId } = body;

        if (!title || !description || !assignedToId || !division) {
            return NextResponse.json({ error: "Judul, deskripsi, divisi, dan anggota tujuan wajib diisi" }, { status: 400 });
        }

        const task = await prisma.memberTask.create({
            data: {
                title,
                description,
                division: division as Division,
                priority: (priority as TaskPriority) || "MEDIUM",
                status: "TODO",
                dueDate: dueDate ? new Date(dueDate) : null,
                assignedToId,
                createdById: session.user.id,
            },
            include: {
                assignedTo: {
                    select: {
                        name: true,
                        position: true,
                    }
                }
            }
        });

        return NextResponse.json({ message: "Tugas berhasil diberikan", data: task }, { status: 201 });
    } catch (error) {
        console.error("POST /api/tasks error:", error);
        return NextResponse.json({ error: "Gagal membuat tugas" }, { status: 500 });
    }
}

// PATCH /api/tasks — Update progress tugas / serahkan laporan tugas (Submission)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, status, submissionNote, submissionLink } = body;

        if (!id) {
            return NextResponse.json({ error: "ID tugas diperlukan" }, { status: 400 });
        }

        const task = await prisma.memberTask.findUnique({ where: { id } });
        if (!task) {
            return NextResponse.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
        }

        // Cek wewenang: Pemilik tugas atau Pembuat tugas/BPH/Admin
        const isAssignee = task.assignedToId === session.user.id;
        const isLeader = isOfficerOrStaff(session.user) && (task.createdById === session.user.id || canManageDivision(session.user, task.division));

        if (!isAssignee && !isLeader) {
            return NextResponse.json({ error: "Anda tidak memiliki izin mengubah tugas ini" }, { status: 403 });
        }

        const updateData: any = {};
        if (status) updateData.status = status as TaskStatus;
        if (submissionNote !== undefined) updateData.submissionNote = submissionNote;
        if (submissionLink !== undefined) updateData.submissionLink = submissionLink;
        if (status === "COMPLETED") updateData.completedAt = new Date();

        const updated = await prisma.memberTask.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ message: "Tugas berhasil diperbarui", data: updated });
    } catch (error) {
        console.error("PATCH /api/tasks error:", error);
        return NextResponse.json({ error: "Gagal memperbarui tugas" }, { status: 500 });
    }
}
