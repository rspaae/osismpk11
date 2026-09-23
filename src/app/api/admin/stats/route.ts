import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [
            totalUsers,
            totalAspirations,
            pendingAspirations,
            totalWorkPrograms,
            ongoingWorkPrograms,
            activeAttendanceSessions,
            totalActivities,
            totalTasks,
            pendingTasks,
            activePeriod,
            recentAspirations,
            recentSessions
        ] = await Promise.all([
            prisma.user.count({ where: { isActive: true } }),
            prisma.aspiration.count(),
            prisma.aspiration.count({ where: { status: "PENDING" } }),
            prisma.workProgram.count(),
            prisma.workProgram.count({ where: { status: "ONGOING" } }),
            prisma.attendanceSession.count({ where: { isOpen: true } }),
            prisma.activity.count(),
            prisma.memberTask.count(),
            prisma.memberTask.count({ where: { status: { in: ["TODO", "IN_PROGRESS"] } } }),
            prisma.academicPeriod.findFirst({ where: { isActive: true } }),
            prisma.aspiration.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: { user: { select: { name: true, kelas: true, role: true } } }
            }),
            prisma.attendanceSession.findMany({
                where: { isOpen: true },
                take: 3,
                orderBy: { date: "desc" },
                include: { _count: { select: { records: true } } }
            })
        ]);

        return NextResponse.json({
            metrics: {
                totalUsers,
                totalAspirations,
                pendingAspirations,
                totalWorkPrograms,
                ongoingWorkPrograms,
                activeAttendanceSessions,
                totalActivities,
                totalTasks,
                pendingTasks,
            },
            activePeriod,
            recentAspirations,
            recentSessions
        });
    } catch (error: any) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
