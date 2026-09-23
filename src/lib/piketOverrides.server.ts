// src/lib/piketOverrides.server.ts
// Server-Only module for persistent Piket Schedule Overrides (JSON storage)
import fs from "fs";
import path from "path";
import {
    PiketOfficer,
    ScheduleSwap,
    SAPA_PAGI_ROSTER,
    DANUS_ROSTER,
    applySwapsToRoster,
} from "./piketSchedule";

const OVERRIDES_FILE = path.join(process.cwd(), "src", "data", "piketOverrides.json");

export function getSavedSwaps(): ScheduleSwap[] {
    try {
        if (!fs.existsSync(OVERRIDES_FILE)) {
            return [];
        }
        const raw = fs.readFileSync(OVERRIDES_FILE, "utf-8");
        const json = JSON.parse(raw);
        return json.swaps || [];
    } catch {
        return [];
    }
}

export function saveSwaps(swaps: ScheduleSwap[]): boolean {
    try {
        const dir = path.dirname(OVERRIDES_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(
            OVERRIDES_FILE,
            JSON.stringify({ swaps, updatedAt: new Date().toISOString() }, null, 2),
            "utf-8"
        );
        return true;
    } catch {
        return false;
    }
}

// Helper: Dapatkan roster jadwal dengan hasil tukar jadwal yang aktif
export function getEffectiveSchedule(
    dutyType: "SAPA_PAGI" | "DANUS" = "SAPA_PAGI",
    week: 1 | 2 = 1,
    day: string = "SENIN",
    specificDateStr?: string
): PiketOfficer[] {
    const baseRoster = dutyType === "SAPA_PAGI" ? SAPA_PAGI_ROSTER : DANUS_ROSTER;
    const baseList: PiketOfficer[] = JSON.parse(JSON.stringify(baseRoster[week]?.[day] || []));
    const swaps = getSavedSwaps();

    return applySwapsToRoster(baseList, swaps, dutyType, week, day, specificDateStr);
}

// Helper: Cari apakah seorang nama pengurus terdaftar di jadwal hari ini (termasuk hasil swap)
export function findOfficerInSchedule(
    searchQuery: string,
    scheduleType: "SAPA_PAGI" | "DANUS" = "SAPA_PAGI",
    week: 1 | 2 = 1,
    day: string = "SENIN",
    dateStr?: string
): PiketOfficer | null {
    const dayOfficers = getEffectiveSchedule(scheduleType, week, day, dateStr);
    const q = searchQuery.toLowerCase().trim();

    return dayOfficers.find((o) =>
        o.name.toLowerCase().includes(q) || q.includes(o.name.toLowerCase())
    ) || null;
}
