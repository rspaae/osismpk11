// src/lib/piketSchedule.ts
// Master Jadwal Piket Sapa Pagi & Danus Pengurus OSIS-MPK SMKN 11 Bandung (Client & Server Safe)

export interface PiketOfficer {
    name: string;
    org: "OSIS" | "MPK";
    division?: string;
    isSwapped?: boolean;
    swapInfo?: string;
}

export interface DaySchedule {
    day: "SENIN" | "SELASA" | "RABU" | "KAMIS" | "JUMAT";
    dayLabel: string;
    officers: PiketOfficer[];
}

export interface WeekSchedule {
    week: 1 | 2;
    weekLabel: string;
    schedule: Record<"SENIN" | "SELASA" | "RABU" | "KAMIS" | "JUMAT", PiketOfficer[]>;
}

export interface ScheduleSwap {
    id: string;
    type: "SAPA_PAGI" | "DANUS";
    sourceWeek: 1 | 2;
    sourceDay: string;
    sourceOfficer: string;
    sourceOrg?: "OSIS" | "MPK";
    targetWeek: 1 | 2;
    targetDay: string;
    targetOfficer: string;
    targetOrg?: "OSIS" | "MPK";
    specificDate?: string; // e.g. "2026-09-22"
    reason?: string;
    swappedBy?: string;
    createdAt: string;
}

export const SAPA_PAGI_ROSTER: Record<1 | 2, Record<string, PiketOfficer[]>> = {
    // ═════════════════════════════════════════════════════════════════════════
    // MINGGU KE-1
    // ═════════════════════════════════════════════════════════════════════════
    1: {
        SENIN: [
            { name: "Nuri Anggraeni", org: "OSIS" },
            { name: "Muhammad Hatta Rasyahputra", org: "OSIS" },
            { name: "Aqlan Fawaz Ghassani", org: "MPK" },
            { name: "Erika Febriyanti", org: "OSIS" },
            { name: "Rafa Ramdani", org: "OSIS" },
            { name: "Nayla Zaina Alesha", org: "MPK" },
            { name: "Nayla Saskia Zaini", org: "MPK" },
            { name: "Nazmi Keiza Nazhifa", org: "OSIS" },
        ],
        SELASA: [
            { name: "Nabila Nur Sadrina", org: "OSIS" },
            { name: "Meysya Apriliani Putri", org: "MPK" },
            { name: "Zalfa Zakiyyah Khoirunnisa", org: "MPK" },
            { name: "Sakina Qurrota A’yunin", org: "OSIS" },
            { name: "Sevanni Kusuma Madhani", org: "OSIS" },
            { name: "Santi Listiani", org: "OSIS" },
            { name: "Hasyafakhri Hafizh", org: "MPK" },
        ],
        RABU: [
            { name: "Nakesha Putri Rahayu", org: "MPK" },
            { name: "Nabila Safa Lesmana", org: "OSIS" },
            { name: "Nisrina Maharani", org: "OSIS" },
            { name: "Reza Maulana Dhabith", org: "MPK" },
            { name: "Metha Khairinnisa", org: "OSIS" },
            { name: "Salma Nur Azizah", org: "MPK" },
            { name: "Antania Putri Wibowo", org: "MPK" },
        ],
        KAMIS: [
            { name: "Keyla Brahmi Andani", org: "MPK" },
            { name: "Fiorenzia Izzati", org: "OSIS" },
            { name: "Resta Auliana", org: "OSIS" },
            { name: "Marvel Mapaliye", org: "OSIS" },
            { name: "Alena Veyra Pramudita", org: "MPK" },
            { name: "Keisa Zahra Rianty", org: "MPK" },
            { name: "Muhammad Ilham Romadon", org: "MPK" },
        ],
        JUMAT: [
            { name: "Anis Maheera", org: "MPK" },
            { name: "Laudri Zahra Aura Hasanah", org: "MPK" },
            { name: "Jeanny Wynnie Pratama", org: "OSIS" },
            { name: "Mohammad Risky Ramadhan", org: "OSIS" },
            { name: "Dzaki Fairuz", org: "OSIS" },
            { name: "Ahmad Fattah Nasrullah", org: "MPK" },
            { name: "Revand Arif Sugiarto", org: "OSIS" },
        ],
    },

    // ═════════════════════════════════════════════════════════════════════════
    // MINGGU KE-2
    // ═════════════════════════════════════════════════════════════════════════
    2: {
        SENIN: [
            { name: "Silvia Indriani", org: "OSIS" },
            { name: "Nisrina Khoirunnisa", org: "OSIS" },
            { name: "Pina Pitriani", org: "OSIS" },
            { name: "Salsabila Ramadhani M", org: "OSIS" },
            { name: "Muhammad Rafi Fadhillah", org: "MPK" },
            { name: "Nazwa Septiani", org: "MPK" },
            { name: "Faiz Hilmi Firdaus", org: "OSIS" },
            { name: "Aluna Fathia Syabila", org: "MPK" },
        ],
        SELASA: [
            { name: "Siti Rahma", org: "OSIS" },
            { name: "Siti Nurjanah", org: "MPK" },
            { name: "Muhammad Ilham Romadon", org: "MPK" },
            { name: "Muhammad Rizky Pratama", org: "OSIS" },
            { name: "Adelia Putri", org: "OSIS" },
            { name: "M. Azka Al-Ghifari", org: "MPK" },
            { name: "Kayla Aurelia", org: "OSIS" },
        ],
        RABU: [
            { name: "Alya Zahra", org: "OSIS" },
            { name: "Rifqi Ahmad", org: "MPK" },
            { name: "Dinda Amelia", org: "OSIS" },
            { name: "Fathir Muhammad", org: "MPK" },
            { name: "Syifa Aulia", org: "OSIS" },
            { name: "Bagas Pratama", org: "OSIS" },
            { name: "Clarissa Putri", org: "MPK" },
        ],
        KAMIS: [
            { name: "Zahra Salsabila", org: "OSIS" },
            { name: "Hafizh Al-Farisi", org: "MPK" },
            { name: "Naufal Ramadhan", org: "OSIS" },
            { name: "Tiara Andini", org: "MPK" },
            { name: "Farhan Ardiansyah", org: "OSIS" },
            { name: "Nayla Khairunnisa", org: "OSIS" },
            { name: "Reno Saputra", org: "MPK" },
        ],
        JUMAT: [
            { name: "Dewi Sartika", org: "MPK" },
            { name: "Fajar Nugraha", org: "OSIS" },
            { name: "Salwa Nurfadilah", org: "OSIS" },
            { name: "Ghaisan Akbar", org: "MPK" },
            { name: "Cynthia Bella", org: "OSIS" },
            { name: "Irfan Maulana", org: "MPK" },
            { name: "Alifia Rahmawati", org: "OSIS" },
        ],
    },
};

export const DANUS_ROSTER: Record<1 | 2, Record<string, PiketOfficer[]>> = {
    1: {
        SENIN: [
            { name: "Muhammad Rizky Pratama", org: "OSIS" },
            { name: "Alya Putri Maharani", org: "OSIS" },
            { name: "Farhan Fauzan", org: "MPK" },
            { name: "Siti Nurhaliza", org: "OSIS" },
        ],
        SELASA: [
            { name: "Bima Arya Prasetya", org: "MPK" },
            { name: "Dinda Kirana Putri", org: "OSIS" },
            { name: "Eko Prasetyo", org: "OSIS" },
            { name: "Fitri Handayani", org: "MPK" },
        ],
        RABU: [
            { name: "Gilang Ramadhan", org: "OSIS" },
            { name: "Hana Safitri", org: "MPK" },
            { name: "Indra Lesmana", org: "OSIS" },
            { name: "Jasmine Nurul", org: "OSIS" },
        ],
        KAMIS: [
            { name: "Kurniawan Dwi", org: "MPK" },
            { name: "Lestari Wulandari", org: "OSIS" },
            { name: "Mochamad Wildan", org: "OSIS" },
            { name: "Novi Anggraeni", org: "MPK" },
        ],
        JUMAT: [
            { name: "Oki Setiawan", org: "OSIS" },
            { name: "Putri Rahmadani", org: "MPK" },
            { name: "Qoriatul Hasanah", org: "OSIS" },
            { name: "Rian Hidayat", org: "OSIS" },
        ],
    },
    2: {
        SENIN: [
            { name: "Syahrul Gunawan", org: "OSIS" },
            { name: "Tania Aurelia", org: "MPK" },
            { name: "Umar Faruq", org: "OSIS" },
            { name: "Vina Panduwinata", org: "OSIS" },
        ],
        SELASA: [
            { name: "Wahyu Setiawan", org: "MPK" },
            { name: "Xena Radinka", org: "OSIS" },
            { name: "Yoga Pratama", org: "OSIS" },
            { name: "Zaskia Gotik", org: "MPK" },
        ],
        RABU: [
            { name: "Aldi Taher", org: "OSIS" },
            { name: "Bella Shofie", org: "MPK" },
            { name: "Charly Van Houten", org: "OSIS" },
            { name: "Desta Mahendra", org: "OSIS" },
        ],
        KAMIS: [
            { name: "Enzy Storia", org: "MPK" },
            { name: "Fedi Nuril", org: "OSIS" },
            { name: "Gading Marten", org: "OSIS" },
            { name: "Hesti Purwadinata", org: "MPK" },
        ],
        JUMAT: [
            { name: "Irfan Hakim", org: "OSIS" },
            { name: "Jessica Mila", org: "MPK" },
            { name: "Kaesang Pangarep", org: "OSIS" },
            { name: "Luna Maya", org: "OSIS" },
        ],
    },
};

// Helper: Tentukan nama hari Bahasa Indonesia
export function getIndonesianDayName(date: Date = new Date()): "SENIN" | "SELASA" | "RABU" | "KAMIS" | "JUMAT" | "SABTU" | "MINGGU" {
    const days: ("MINGGU" | "SENIN" | "SELASA" | "RABU" | "KAMIS" | "JUMAT" | "SABTU")[] = [
        "MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"
    ];
    return days[date.getDay()];
}

// Helper: Tentukan Minggu ke-1 atau Minggu ke-2 berdasarkan nomor pekan kalender
export function getCalculatedPiketWeek(date: Date = new Date()): 1 | 2 {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return (weekNumber % 2 === 1) ? 1 : 2;
}

// Helper: Terapkan daftar swaps ke base roster secara murni tanpa I/O
export function applySwapsToRoster(
    baseList: PiketOfficer[],
    swaps: ScheduleSwap[],
    dutyType: "SAPA_PAGI" | "DANUS",
    week: 1 | 2,
    day: string,
    specificDateStr?: string
): PiketOfficer[] {
    const result: PiketOfficer[] = JSON.parse(JSON.stringify(baseList));

    swaps.forEach((swap) => {
        if (swap.type !== dutyType) return;

        // Jika swap untuk tanggal spesifik, cek apakah tanggalnya cocok
        if (swap.specificDate && specificDateStr && swap.specificDate !== specificDateStr) {
            return;
        }

        // Cek jika slot ini adalah source
        if (swap.sourceWeek === week && swap.sourceDay === day) {
            const idx = result.findIndex((o) => o.name.toLowerCase() === swap.sourceOfficer.toLowerCase());
            if (idx !== -1) {
                result[idx] = {
                    name: swap.targetOfficer,
                    org: swap.targetOrg || "OSIS",
                    isSwapped: true,
                    swapInfo: `Tukar jadwal dari ${swap.sourceOfficer}${swap.reason ? ` (${swap.reason})` : ""}`,
                };
            }
        }

        // Cek jika slot ini adalah target
        if (swap.targetWeek === week && swap.targetDay === day) {
            const idx = result.findIndex((o) => o.name.toLowerCase() === swap.targetOfficer.toLowerCase());
            if (idx !== -1) {
                result[idx] = {
                    name: swap.sourceOfficer,
                    org: swap.sourceOrg || "OSIS",
                    isSwapped: true,
                    swapInfo: `Tukar jadwal dari ${swap.targetOfficer}${swap.reason ? ` (${swap.reason})` : ""}`,
                };
            }
        }
    });

    return result;
}
