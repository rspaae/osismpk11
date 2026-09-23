import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, Division, AttendanceType } from "@/lib/prisma";
import { isOfficerOrStaff, isSuperOrLeadership } from "@/lib/permissions";
import crypto from "crypto";

// GET /api/attendance/sessions — Daftar sesi presensi
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") as AttendanceType | null;
        const division = searchParams.get("division") as Division | null;
        const divisionGroup = searchParams.get("divisionGroup"); // e.g. "SEKBID" → all SEKBID_1..10
        const isOpen = searchParams.get("isOpen");

        const where: any = {};
        if (type) where.type = type;
        if (divisionGroup === "SEKBID") {
            // Filter semua Sekbid (SEKBID_1 hingga SEKBID_10) — untuk modul Absensi Sekbid
            where.targetDivision = {
                in: ["SEKBID_1", "SEKBID_2", "SEKBID_3", "SEKBID_4", "SEKBID_5",
                     "SEKBID_6", "SEKBID_7", "SEKBID_8", "SEKBID_9", "SEKBID_10"] as Division[]
            };
        } else if (division) {
            where.targetDivision = division;
        }
        if (isOpen !== null && isOpen !== undefined) where.isOpen = isOpen === "true";


        const sessions = await prisma.attendanceSession.findMany({
            where,
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        position: true,
                    }
                },
                _count: {
                    select: {
                        records: true,
                    }
                }
            },
            orderBy: { date: "desc" },
            take: 30,
        });

        return NextResponse.json({ data: sessions });
    } catch (error) {
        console.error("GET /api/attendance/sessions error:", error);
        return NextResponse.json({ error: "Gagal memuat sesi presensi" }, { status: 500 });
    }
}

// POST /api/attendance/sessions — Buat sesi presensi baru (Rapat, Event, Piket)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = session.user;
        // Hanya Pengurus/Staf yang dapat membuat sesi presensi
        if (!isOfficerOrStaff(user)) {
            return NextResponse.json({ error: "Hanya pengurus yang berhak membuat sesi presensi" }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, type, targetDivision, location, date, startTime, endTime, customPasscode } = body;

        if (!title) {
            return NextResponse.json({ error: "Judul sesi presensi wajib diisi" }, { status: 400 });
        }

        // Generate 6-digit PIN & QR Token
        const passcode = customPasscode || Math.floor(100000 + Math.random() * 900000).toString();
        const qrToken = crypto.randomBytes(16).toString("hex");

        const attendanceSession = await prisma.attendanceSession.create({
            data: {
                title,
                description,
                type: (type as AttendanceType) || "MEETING",
                targetDivision: (targetDivision as Division) || user.division || "GENERAL",
                location: location || "Ruang OSIS-MPK SMKN 11 Bandung",
                date: date ? new Date(date) : new Date(),
                startTime: startTime || "13:30",
                endTime: endTime || "16:00",
                passcode,
                qrToken,
                isOpen: true,
                createdById: user.id,
            },
            include: {
                creator: {
                    select: {
                        name: true,
                        role: true,
                        position: true,
                    }
                }
            }
        });

        return NextResponse.json({
            message: "Sesi presensi berhasil dibuat",
            data: attendanceSession
        }, { status: 201 });
    } catch (error) {
        console.error("POST /api/attendance/sessions error:", error);
        return NextResponse.json({ error: "Gagal membuat sesi presensi" }, { status: 500 });
    }
}
