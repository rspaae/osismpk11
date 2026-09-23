import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, Role, Division } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ImportRow {
    name: string;
    nis?: string;
    nisn?: string;
    kelas?: string;
    major?: string;
    email?: string;
    password?: string;
    rfidCard?: string;
    role?: string;
    division?: string;
    position?: string;
}

// POST /api/admin/users/bulk-import — Import Data Ribuan Siswa Sekaligus (CSV / JSON Batch)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["ADMINISTRATOR", "KESISWAAN"].includes(session.user.role as any)) {
            return NextResponse.json(
                { error: "Unauthorized: Hanya Administrator & Kesiswaan yang dapat mengimpor data siswa massal" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const rawStudents: ImportRow[] = Array.isArray(body) ? body : body.students || [];

        if (rawStudents.length === 0) {
            return NextResponse.json(
                { error: "Data siswa kosong atau format tidak sesuai" },
                { status: 400 }
            );
        }

        const activePeriod = await prisma.academicPeriod.findFirst({ where: { isActive: true } });
        const periodId = activePeriod?.id || null;

        // Cache default hashed password agar tidak membuang CPU compute berulang untuk 1,700 siswa
        const defaultHashPassword = await bcrypt.hash("password123", 10);

        let insertedCount = 0;
        let updatedCount = 0;
        let failedCount = 0;
        const errors: { row: number; name: string; error: string }[] = [];

        // Proses batch dalam chunk 50 untuk performa maksimal & tidak timeout
        const CHUNK_SIZE = 50;
        for (let i = 0; i < rawStudents.length; i += CHUNK_SIZE) {
            const chunk = rawStudents.slice(i, i + CHUNK_SIZE);

            await Promise.all(
                chunk.map(async (row, idx) => {
                    const rowNumber = i + idx + 1;
                    const cleanName = row.name?.trim();
                    const cleanNis = row.nis ? String(row.nis).trim() : undefined;
                    const cleanNisn = row.nisn ? String(row.nisn).trim() : undefined;
                    const cleanKelas = row.kelas ? String(row.kelas).trim().toUpperCase() : undefined;
                    const cleanMajor = row.major ? String(row.major).trim() : undefined;
                    const cleanRfid = row.rfidCard ? String(row.rfidCard).trim() : undefined;

                    if (!cleanName) {
                        failedCount++;
                        errors.push({ row: rowNumber, name: "Tanpa Nama", error: "Nama siswa wajib diisi" });
                        return;
                    }

                    // Generate email standar jika tidak ada: {nis}@smkn11bdg.sch.id
                    let cleanEmail = row.email ? String(row.email).trim().toLowerCase() : undefined;
                    if (!cleanEmail && cleanNis) {
                        cleanEmail = `${cleanNis}@smkn11bdg.sch.id`;
                    }

                    // Password: jika custom, hash. Jika tidak ada / default, pakai pre-computed hash
                    let userPasswordHash = defaultHashPassword;
                    if (row.password && row.password !== "password123") {
                        userPasswordHash = await bcrypt.hash(row.password, 10);
                    } else if (cleanNis) {
                        // Jika ingin password default = NIS siswa
                        userPasswordHash = await bcrypt.hash(cleanNis, 10);
                    }

                    const targetRole = (row.role as Role) || "STUDENT";
                    const targetDivision = (row.division as Division) || "GENERAL";
                    const targetPosition = row.position ? String(row.position).trim() : null;

                    try {
                        // Cari user berdasarkan NIS atau Email
                        const existingUser = await prisma.user.findFirst({
                            where: {
                                OR: [
                                    cleanNis ? { nis: cleanNis } : {},
                                    cleanEmail ? { email: cleanEmail } : {},
                                ].filter(c => Object.keys(c).length > 0)
                            }
                        });

                        if (existingUser) {
                            // Update data yang ada
                            await prisma.user.update({
                                where: { id: existingUser.id },
                                data: {
                                    name: cleanName,
                                    nis: cleanNis || existingUser.nis,
                                    nisn: cleanNisn || existingUser.nisn,
                                    kelas: cleanKelas || existingUser.kelas,
                                    major: cleanMajor || existingUser.major,
                                    rfidCard: cleanRfid || existingUser.rfidCard,
                                    role: targetRole,
                                    division: targetDivision,
                                    position: targetPosition,
                                    isActive: true,
                                }
                            });
                            updatedCount++;
                        } else {
                            // Insert siswa baru
                            await prisma.user.create({
                                data: {
                                    name: cleanName,
                                    nis: cleanNis || null,
                                    nisn: cleanNisn || null,
                                    email: cleanEmail || null,
                                    kelas: cleanKelas || null,
                                    major: cleanMajor || null,
                                    rfidCard: cleanRfid || null,
                                    password: userPasswordHash,
                                    role: targetRole,
                                    division: targetDivision,
                                    position: targetPosition,
                                    periodId,
                                    isActive: true,
                                }
                            });
                            insertedCount++;
                        }
                    } catch (err: any) {
                        failedCount++;
                        errors.push({
                            row: rowNumber,
                            name: cleanName,
                            error: err.message || "Gagal menyimpan ke database"
                        });
                    }
                })
            );
        }

        return NextResponse.json({
            success: true,
            message: `Proses import selesai: ${insertedCount} akun baru dibuat, ${updatedCount} akun diperbarui, ${failedCount} gagal.`,
            summary: {
                totalReceived: rawStudents.length,
                insertedCount,
                updatedCount,
                failedCount,
                errors: errors.slice(0, 20), // Tampilkan maksimal 20 log error pertama
            }
        }, { status: 200 });
    } catch (error: any) {
        console.error("POST /api/admin/users/bulk-import error:", error);
        return NextResponse.json({ error: "Gagal memproses import data siswa massal" }, { status: 500 });
    }
}
