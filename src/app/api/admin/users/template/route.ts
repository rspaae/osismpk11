import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMINISTRATOR", "KESISWAAN", "PEMBINA", "BPH_OSIS", "BPH_MPK"].includes(session.user.role as any)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // CSV Template dengan UTF-8 BOM untuk kompatibilitas Excel Indonesia / Google Sheets
    const BOM = "\uFEFF";
    const csvHeader = "Nama Siswa,NIS,NISN,Kelas,Jurusan,Email,Password Default,RFID Card,Role\n";
    const csvExamples = [
        "Muhammad Rizky Pratama,232410001,0071234567,X PPLG 1,PPLG,232410001@smkn11bdg.sch.id,password123,,STUDENT",
        "Alya Putri Maharani,232410002,0071234568,XI RPL 2,PPLG,232410002@smkn11bdg.sch.id,password123,04A1B2C3D4,STUDENT",
        "Farhan Fauzan,222310003,0061234569,XII TKJ 1,TJKT,222310003@smkn11bdg.sch.id,password123,,STUDENT",
        "Siti Nurhaliza,232410004,0071234570,X DKV 2,DKV,232410004@smkn11bdg.sch.id,password123,,STUDENT"
    ].join("\n");

    const csvContent = BOM + csvHeader + csvExamples;

    return new NextResponse(csvContent, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": 'attachment; filename="template_import_siswa_smkn11.csv"',
        },
    });
}
