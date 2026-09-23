import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    DIVISIONS_METADATA,
    canManageDivision,
    canRespondAspirations,
    canEvaluateWorkPrograms,
    canPublishActivities,
    canManageUsers,
} from "@/lib/permissions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                nis: true,
                name: true,
                email: true,
                image: true,
                role: true,
                division: true,
                position: true,
                kelas: true,
                createdAt: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const divisionMeta = user.division ? DIVISIONS_METADATA[user.division] : null;

        const permissions = {
            canManageUsers: canManageUsers(user),
            canRespondAspirations: canRespondAspirations(user),
            canEvaluateWorkPrograms: canEvaluateWorkPrograms(user),
            canPublishActivities: canPublishActivities(user),
        };

        return NextResponse.json({
            user,
            divisionMeta,
            permissions,
        });
    } catch (error) {
        console.error("GET /api/auth/me error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
