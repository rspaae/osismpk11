import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma, Division, PostStatus } from "@/lib/prisma";
import { canPublishActivities, canManageDivision } from "@/lib/permissions";
import { validatePublicSubmission } from "@/lib/security";

// GET /api/activities — Ambil daftar berita / kegiatan
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const division = searchParams.get("division") as Division | null;
        const category = searchParams.get("category");
        const status = (searchParams.get("status") as PostStatus) || "PUBLISHED";
        const limit = parseInt(searchParams.get("limit") || "20");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        const where: any = {};
        if (division) where.division = division;
        if (category) where.category = category;
        if (status) where.status = status;

        const [activities, total] = await Promise.all([
            prisma.activity.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                            division: true,
                            position: true,
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
            }),
            prisma.activity.count({ where }),
        ]);

        return NextResponse.json({
            data: activities,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.warn("GET /api/activities query notice (database offline or table empty):", error);
        return NextResponse.json({
            data: [],
            meta: {
                total: 0,
                page: 1,
                limit: 20,
                totalPages: 0,
            }
        });
    }
}

// POST /api/activities — Buat berita / dokumentasi kegiatan baru
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, slug, excerpt, content, coverImage, galleryImages, category, division, eventDate } = body;

        if (!title || !content) {
            return NextResponse.json({ error: "Judul dan konten wajib diisi" }, { status: 400 });
        }

        // Anti-Judol & Anti-SEO Spam Filter
        const securityCheck = validatePublicSubmission({ title, content: `${excerpt || ""} ${content}`, category });
        if (!securityCheck.isValid) {
            return NextResponse.json(
                { error: securityCheck.error || "Konten ditolak oleh sistem keamanan." },
                { status: 400 }
            );
        }

        const targetDivision: Division = division || session.user.division || "GENERAL";

        // Check permission
        const user = session.user;
        const hasPermission = canPublishActivities(user, targetDivision) || canManageDivision(user, targetDivision);

        if (!hasPermission) {
            return NextResponse.json({ error: "Anda tidak memiliki izin mempublikasikan konten untuk divisi ini" }, { status: 403 });
        }

        // Generate slug if not provided
        const baseSlug = (slug || title)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

        const activity = await prisma.activity.create({
            data: {
                title,
                slug: uniqueSlug,
                excerpt,
                content,
                coverImage,
                galleryImages: galleryImages || [],
                category: category || "Umum",
                division: targetDivision,
                status: "PUBLISHED",
                eventDate: eventDate ? new Date(eventDate) : new Date(),
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        division: true,
                    }
                }
            }
        });

        return NextResponse.json({ message: "Kegiatan berhasil dipublikasikan", data: activity }, { status: 201 });
    } catch (error) {
        console.error("POST /api/activities error:", error);
        return NextResponse.json({ error: "Gagal membuat kegiatan" }, { status: 500 });
    }
}
