import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Prevent static generation - this route needs runtime database access
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    // Only Admin can create users
    if (!session || session.user.role !== "ADMINISTRATOR") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, nis, email, role, password } = await req.json();

        if (!name || !nis || !password) {
            return NextResponse.json({ error: "Missing required fields (Name, NIS, Password)" }, { status: 400 });
        }

        // Check if NIS or Email already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { nis },
                    email ? { email } : {}
                ].filter(condition => Object.keys(condition).length > 0)
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User with this NIS or Email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                nis,
                email: email || null,
                role: role || "STUDENT",
                password: hashedPassword
            }
        });

        return NextResponse.json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                nis: newUser.nis,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
