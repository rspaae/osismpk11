import { Role, Division } from "@/lib/prisma";

export interface AuthUser {
    id: string;
    role: Role;
    division?: Division | null;
    position?: string | null;
    name?: string | null;
    email?: string | null;
    nis?: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// METADATA DIVISI (SEKBID 1 - 10 & KOMISI A - D)
// ═══════════════════════════════════════════════════════════════════════════════

export interface DivisionMeta {
    code: Division;
    label: string;
    name: string;
    type: "OSIS" | "MPK" | "INSTITUTION";
    icon: string;
    description: string;
}

export const DIVISIONS_METADATA: Record<Division, DivisionMeta> = {
    // OSIS Sekbid 1 - 10
    SEKBID_1: {
        code: "SEKBID_1",
        label: "Sekbid 1",
        name: "Keimanan & Ketaqwaan",
        type: "OSIS",
        icon: "🕌",
        description: "Kegiatan keagamaan, peringatan hari besar, dan toleransi antar umat beragama.",
    },
    SEKBID_2: {
        code: "SEKBID_2",
        label: "Sekbid 2",
        name: "Budi Pekerti & Kepribadian (Sapa Pagi)",
        type: "OSIS",
        icon: "🌟",
        description: "Pembentukan karakter, tata krama, piket Sapa Pagi gerbang sekolah, dan penguatan moral siswa.",
    },
    SEKBID_3: {
        code: "SEKBID_3",
        label: "Sekbid 3",
        name: "Wawasan Kebangsaan",
        type: "OSIS",
        icon: "🇮🇩",
        description: "Upacara bendera, paskibra, dan penguatan rasa cinta tanah air.",
    },
    SEKBID_4: {
        code: "SEKBID_4",
        label: "Sekbid 4",
        name: "Kepribadian Bangsa",
        type: "OSIS",
        icon: "🤝",
        description: "Etika, jiwa sosial, dan penguatan semangat kekeluargaan antar siswa.",
    },
    SEKBID_5: {
        code: "SEKBID_5",
        label: "Sekbid 5",
        name: "Pendidikan Demokrasi",
        type: "OSIS",
        icon: "🗳️",
        description: "Pemilu OSIS, pendidikan politik sehat, dan hak asasi manusia.",
    },
    SEKBID_6: {
        code: "SEKBID_6",
        label: "Sekbid 6",
        name: "Kualitas Jasmani & Danus",
        type: "OSIS",
        icon: "🏃",
        description: "Olahraga, UKS, piket Dana Usaha (Danus), dan hidup bersih di lingkungan sekolah.",
    },
    SEKBID_7: {
        code: "SEKBID_7",
        label: "Sekbid 7",
        name: "Seni & Budaya",
        type: "OSIS",
        icon: "🎨",
        description: "Pentas seni, literasi, dan pelestarian kekayaan budaya daerah Nusantara.",
    },
    SEKBID_8: {
        code: "SEKBID_8",
        label: "Sekbid 8",
        name: "Pembinaan Lingkungan Hidup",
        type: "OSIS",
        icon: "🌿",
        description: "Gerakan daur ulang, penghijauan sekolah, dan aksi peduli lingkungan.",
    },
    SEKBID_9: {
        code: "SEKBID_9",
        label: "Sekbid 9",
        name: "Teknologi & Informasi",
        type: "OSIS",
        icon: "💻",
        description: "Pengelolaan media sosial OSIS dan pengembangan literasi digital siswa.",
    },
    SEKBID_10: {
        code: "SEKBID_10",
        label: "Sekbid 10",
        name: "Kewirausahaan",
        type: "OSIS",
        icon: "🚀",
        description: "Pemberdayaan ekonomi kreatif, kantin kejujuran, dan bazar karya siswa.",
    },

    // MPK Komisi A - D
    KOMISI_A: {
        code: "KOMISI_A",
        label: "Komisi A",
        name: "Keorganisasian & Hukum",
        type: "MPK",
        icon: "📜",
        description: "Mengawasi pelaksanaan AD/ART, tata tertib organisasi, dan regulasi internal OSIS-MPK.",
    },
    KOMISI_B: {
        code: "KOMISI_B",
        label: "Komisi B",
        name: "Aspirasi & Advokasi",
        type: "MPK",
        icon: "📢",
        description: "Menjaring, menampung, dan menyalurkan aspirasi seluruh siswa kepada pihak sekolah.",
    },
    KOMISI_C: {
        code: "KOMISI_C",
        label: "Komisi C",
        name: "Keuangan & Anggaran",
        type: "MPK",
        icon: "💰",
        description: "Mengawasi pengelolaan dan transparansi anggaran seluruh program kerja OSIS.",
    },
    KOMISI_D: {
        code: "KOMISI_D",
        label: "Komisi D",
        name: "Pengawasan Program Kerja",
        type: "MPK",
        icon: "📋",
        description: "Memantau dan mengevaluasi realisasi program kerja seluruh Sekretaris Bidang OSIS.",
    },

    // Pimpinan & Lembaga
    BPH_OSIS: {
        code: "BPH_OSIS",
        label: "BPH OSIS",
        name: "Badan Pengurus Harian OSIS",
        type: "OSIS",
        icon: "⚡",
        description: "Ketua, Wakil Ketua, Sekretaris, dan Bendahara OSIS Navastra.",
    },
    BPH_MPK: {
        code: "BPH_MPK",
        label: "BPH MPK",
        name: "Badan Pengurus Harian MPK",
        type: "MPK",
        icon: "⚖️",
        description: "Ketua, Wakil Ketua, Sekretaris, dan Bendahara MPK Navandya.",
    },
    KESISWAAN: {
        code: "KESISWAAN",
        label: "Kesiswaan",
        name: "Bidang Kesiswaan",
        type: "INSTITUTION",
        icon: "🎓",
        description: "Wakil Kepala Sekolah Bidang Kesiswaan SMKN 11 Bandung.",
    },
    PEMBINA: {
        code: "PEMBINA",
        label: "Pembina",
        name: "Pembina OSIS-MPK",
        type: "INSTITUTION",
        icon: "🛡️",
        description: "Pembina resmi organisasi kesiswaan SMKN 11 Bandung.",
    },
    KEPALA_SEKOLAH: {
        code: "KEPALA_SEKOLAH",
        label: "Kepala Sekolah",
        name: "Kepala SMKN 11 Bandung",
        type: "INSTITUTION",
        icon: "🏛️",
        description: "Pelindung dan penanggung jawab utama seluruh kegiatan sekolah.",
    },
    GENERAL: {
        code: "GENERAL",
        label: "Umum",
        name: "Umum & Multi-Bidang",
        type: "INSTITUTION",
        icon: "📌",
        description: "Kegiatan bersama atau publikasi umum sekolah.",
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HIERARKI & HAK AKSES PERMISSION BERDASARKAN JOBDESK
// ═══════════════════════════════════════════════════════════════════════════════

/** Apakah user adalah pengurus / staf / pimpinan (bukan siswa biasa) */
export function isOfficerOrStaff(user?: AuthUser | null): boolean {
    if (!user) return false;
    return user.role !== "STUDENT";
}

/** Apakah user memiliki hak akses Superadmin atau Pimpinan Sekolah */
export function isSuperOrLeadership(user?: AuthUser | null): boolean {
    if (!user) return false;
    return [
        "ADMINISTRATOR",
        "KEPALA_SEKOLAH",
        "KESISWAAN",
        "PEMBINA",
    ].includes(user.role);
}

/** Apakah user adalah BPH (OSIS / MPK) */
export function isBPH(user?: AuthUser | null): boolean {
    if (!user) return false;
    return user.role === "BPH_OSIS" || user.role === "BPH_MPK";
}

/**
 * Apakah user berhak mengakses menu / modul piket sesuai tipe (SAPA_PAGI / DANUS)
 */
export function canAccessPiket(user?: AuthUser | null, dutyType?: "SAPA_PAGI" | "DANUS" | "ALL" | null): boolean {
    if (!user) return false;
    if (isSuperOrLeadership(user) || isBPH(user)) return true;

    if (dutyType === "SAPA_PAGI") {
        return user.division === "SEKBID_2";
    }
    if (dutyType === "DANUS") {
        return user.division === "SEKBID_6";
    }

    // Jika ALL atau tidak spesifik, izinkan jika sekbid 2 ATAU sekbid 6
    return user.division === "SEKBID_2" || user.division === "SEKBID_6";
}

/**
 * Apakah user berhak mengelola data, scan RFID, dan tukar jadwal Sapa Pagi
 * (Sekbid 2, BPH OSIS/MPK, Pembina, Kesiswaan, Admin)
 */
export function canManageSapaPagi(user?: AuthUser | null): boolean {
    if (!user) return false;
    if (isSuperOrLeadership(user) || isBPH(user)) return true;
    return user.division === "SEKBID_2";
}

/**
 * Apakah user berhak mengelola data, scan RFID, dan tukar jadwal Danus
 * (Sekbid 6, BPH OSIS/MPK, Pembina, Kesiswaan, Admin)
 */
export function canManageDanus(user?: AuthUser | null): boolean {
    if (!user) return false;
    if (isSuperOrLeadership(user) || isBPH(user)) return true;
    return user.division === "SEKBID_6";
}

/** Apakah user berhak mengelola piket sesuai tipe (Sapa Pagi atau Danus) */
export function canManagePiket(user?: AuthUser | null, dutyType: "SAPA_PAGI" | "DANUS" = "SAPA_PAGI"): boolean {
    return dutyType === "SAPA_PAGI" ? canManageSapaPagi(user) : canManageDanus(user);
}

/**
 * Apakah user berhak mengekspor data absensi ke spreadsheet sesuai jobdesknya
 */
export function canExportAttendance(
    user?: AuthUser | null,
    dutyType?: "SAPA_PAGI" | "DANUS" | "ALL" | null,
    targetDivision?: Division | null
): boolean {
    if (!user) return false;

    // Superadmin & Pimpinan Sekolah (Admin, Kepsek, Kesiswaan, Pembina) bisa export semua
    if (isSuperOrLeadership(user)) return true;

    // BPH OSIS & BPH MPK bisa export semua piket dan proker organisasi
    if (isBPH(user)) return true;

    // Sekbid 2 hanya boleh export Sapa Pagi / Divisi Sekbid 2
    if (user.division === "SEKBID_2") {
        if (dutyType === "DANUS" || (targetDivision && targetDivision !== "SEKBID_2")) {
            return false;
        }
        return true;
    }

    // Sekbid 6 hanya boleh export Danus / Divisi Sekbid 6
    if (user.division === "SEKBID_6") {
        if (dutyType === "SAPA_PAGI" || (targetDivision && targetDivision !== "SEKBID_6")) {
            return false;
        }
        return true;
    }

    // Sekbid / Komisi lainnya hanya boleh export kegiatan divisinya sendiri
    if (targetDivision && user.division === targetDivision) {
        return true;
    }

    return false;
}

/**
 * Apakah user berhak mengakses & mengelola data 1.700+ akun pengguna
 */
export function canAccessUserManagement(user?: AuthUser | null): boolean {
    if (!user) return false;
    return ["ADMINISTRATOR", "KESISWAAN", "PEMBINA"].includes(user.role);
}

export const canManageUsers = canAccessUserManagement;

/**
 * Apakah user berhak mengekspor seluruh data pengguna / akun siswa
 */
export function canExportUsers(user?: AuthUser | null): boolean {
    if (!user) return false;
    return ["ADMINISTRATOR", "KESISWAAN", "PEMBINA", "KEPALA_SEKOLAH"].includes(user.role);
}

/**
 * Apakah user berhak melakukan aksi massal (Reset Password, Pindah Kelas, Hapus Akun)
 */
export function canPerformBulkUserAction(user?: AuthUser | null): boolean {
    if (!user) return false;
    return ["ADMINISTRATOR", "KESISWAAN", "PEMBINA"].includes(user.role);
}

/** Apakah user boleh mengelola (CRUD) konten divisi tertentu */
export function canManageDivision(user: AuthUser | null | undefined, divisionCode: Division): boolean {
    if (!user) return false;
    
    // Superadmin & Pimpinan Sekolah bisa kelola semua divisi
    if (isSuperOrLeadership(user)) return true;

    // BPH OSIS bisa kelola semua Sekbid & BPH OSIS
    if (user.role === "BPH_OSIS" && (divisionCode.startsWith("SEKBID_") || divisionCode === "BPH_OSIS")) {
        return true;
    }

    // BPH MPK bisa kelola semua Komisi & BPH MPK
    if (user.role === "BPH_MPK" && (divisionCode.startsWith("KOMISI_") || divisionCode === "BPH_MPK")) {
        return true;
    }

    // Pengurus Sekbid/Komisi spesifik hanya bisa mengelola divisinya sendiri
    if (user.division === divisionCode) {
        return true;
    }

    return false;
}

/** Apakah user berhak merespon / menindaklanjuti aspirasi siswa */
export function canRespondAspirations(user?: AuthUser | null): boolean {
    if (!user) return false;
    if (isSuperOrLeadership(user)) return true;
    if (user.role === "BPH_MPK") return true;
    if (user.role === "KOMISI_OFFICER" && user.division === "KOMISI_B") return true; // Komisi B = Aspirasi & Advokasi
    return false;
}

/** Apakah user berhak mengaudit atau mengawasi program kerja */
export function canEvaluateWorkPrograms(user?: AuthUser | null): boolean {
    if (!user) return false;
    if (isSuperOrLeadership(user)) return true;
    if (user.role === "BPH_MPK") return true;
    if (user.role === "KOMISI_OFFICER" && user.division === "KOMISI_D") return true; // Komisi D = Pengawasan Proker
    return false;
}

/** Apakah user berhak mempublikasikan berita / dokumentasi kegiatan */
export function canPublishActivities(user?: AuthUser | null, targetDivision?: Division): boolean {
    if (!user) return false;
    if (isSuperOrLeadership(user)) return true;
    if (user.role === "BPH_OSIS" || user.role === "BPH_MPK") return true;
    if (user.role === "SEKBID_OFFICER" && user.division === "SEKBID_9") return true; // Sekbid 9 = TIK & Medsos
    
    if (targetDivision && user.division === targetDivision) return true;
    return false;
}

/**
 * Mendapatkan daftar divisi yang boleh diakses dan dikelola oleh user saat ini
 */
export function getAuthorizedDivisions(user?: AuthUser | null): Division[] {
    if (!user) return [];
    if (isSuperOrLeadership(user)) {
        return Object.keys(DIVISIONS_METADATA) as Division[];
    }
    if (user.role === "BPH_OSIS") {
        return [
            "BPH_OSIS", "SEKBID_1", "SEKBID_2", "SEKBID_3", "SEKBID_4", "SEKBID_5",
            "SEKBID_6", "SEKBID_7", "SEKBID_8", "SEKBID_9", "SEKBID_10", "GENERAL"
        ];
    }
    if (user.role === "BPH_MPK") {
        return ["BPH_MPK", "KOMISI_A", "KOMISI_B", "KOMISI_C", "KOMISI_D", "GENERAL"];
    }
    if (user.division) {
        return [user.division];
    }
    return [];
}
