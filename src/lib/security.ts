import bcrypt from "bcryptjs";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. INPUT SANITIZER & ANTI-INJECTION SHIELD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Daftar pola umum SQL Injection, NoSQL Injection, dan karakter berbahaya
 */
const SQL_INJECTION_PATTERNS = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))(\s)*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))(\s)*(union|select|insert|update|delete|drop|truncate|exec|execute|declare)/i,
    /\b(UNION\s+ALL\s+SELECT|UNION\s+SELECT|OR\s+1\s*=\s*1|OR\s+'1'\s*=\s*'1')\b/i,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
];

/**
 * Memeriksa apakah suatu string mengandung pola SQL Injection atau exploit berbahaya
 */
export function hasMaliciousPatterns(input: string): boolean {
    if (!input || typeof input !== "string") return false;
    return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Sanitasi string identifier (NIS / Email)
 */
export function sanitizeIdentifier(input: string): { clean: string; isValid: boolean; error?: string } {
    if (!input || typeof input !== "string") {
        return { clean: "", isValid: false, error: "NIS atau Email harus diisi" };
    }

    const trimmed = input.trim();

    // Batasi panjang maksimum untuk mencegah ReDoS / Buffer Overload
    if (trimmed.length > 100) {
        return { clean: "", isValid: false, error: "Panjang input melebihi batas maksimum (100 karakter)" };
    }

    // Deteksi SQL Injection pada identifier login
    if (hasMaliciousPatterns(trimmed)) {
        return {
            clean: "",
            isValid: false,
            error: "Karakter tidak valid atau pola berbahaya terdeteksi.",
        };
    }

    // Bersihkan karakter kontrol dan tag HTML
    const sanitized = trimmed.replace(/[\x00-\x1F\x7F<>]/g, "");

    return { clean: sanitized, isValid: true };
}

/**
 * Sanitasi password untuk mencegah Denial-of-Service via password hashing yang terlalu panjang
 */
export function sanitizePassword(password: string): { clean: string; isValid: boolean; error?: string } {
    if (!password || typeof password !== "string") {
        return { clean: "", isValid: false, error: "Kata sandi harus diisi" };
    }

    // Batasi password max 128 karakter (bcrypt standard limit is 72 bytes)
    if (password.length > 128) {
        return { clean: "", isValid: false, error: "Panjang kata sandi melebihi batas maksimum 128 karakter" };
    }

    return { clean: password, isValid: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. ANTI-JUDI ONLINE (JUDOL) & MALICIOUS SEO SPAM FILTER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Database kata kunci dan frasa terlarang sindikat Judi Online / Slot / Scam
 */
const JUDOL_KEYWORDS = [
    // Slot & Kasino
    /\b(slot\s*gacor|slot\s*online|situs\s*slot|bocoran\s*slot|rtp\s*slot|rtp\s*live)\b/i,
    /\b(maxwin|gacor|zeus\s*slot|kakek\s*zeus|gates\s*of\s*olympus|mahjong\s*ways|starlight\s*princess)\b/i,
    /\b(pragmatic\s*play|pg\s*soft|habanero|microgaming|spadegaming|joker123)\b/i,
    /\b(scatter\s*hitam|scatter\s*merah|freespin|buy\s*spin|jackpot\s*paus)\b/i,
    
    // Togel & Judi Bola
    /\b(togel\s*online|bandar\s*togel|toto\s*macau|singapore\s*pools|hongkong\s*pools|sydney\s*pools)\b/i,
    /\b(judi\s*online|situs\s*judi|agen\s*judi|bandar\s*bola|sbobet|taruhan\s*bola|mix\s*parlay)\b/i,
    /\b(poker\s*online|domino\s*qiu|capsa\s*susun|bandarqq|pkv\s*games|ceme\s*keliling)\b/i,
    /\b(live\s*casino|roulette\s*online|baccarat\s*online|sicbo|dragon\s*tiger)\b/i,

    // Transaksi & Promosi Judol
    /\b(depo\s*pulsa|depo\s*dana|depo\s*gopay|depo\s*qris|depo\s*10k|depo\s*20k|depo\s*50k)\b/i,
    /\b(bonus\s*new\s*member|bonus\s*100%|garansi\s*kekalahan|to\s*kecil|tanpa\s*potongan)\b/i,
    /\b(link\s*alternatif|daftar\s*sekarang|klik\s*disini\s*daftar|link\s*gacor)\b/i,
];

/**
 * Pola URL & Shortlink mencurigakan yang sering dipakai spam SEO judol
 */
const SUSPICIOUS_URL_PATTERNS = [
    /\bhttps?:\/\/[^\s]+(?:\.xyz|\.top|\.vip|\.icu|\.live|\.casino|\.bet|\.pro|\.click|\.site|\.online|\.club)\b/i,
    /\b(?:t\.me|telegram\.me|bit\.ly|cutt\.ly|s\.id|linkr\.bio|heylink\.me)\/[a-zA-Z0-9_\-\.\/]+/i,
    /\b(href\s*=\s*['"][^'"]*)/i, // Mencegah HTML anchor link injection di form teks
];

/**
 * Memeriksa apakah suatu teks mengandung konten promosi judi online atau link berbahaya
 */
export function containsJudolOrSpam(text: string): { isClean: boolean; matchedKeyword?: string } {
    if (!text || typeof text !== "string") return { isClean: true };

    const lower = text.toLowerCase();

    // 1. Cek Kata Kunci Judol
    for (const pattern of JUDOL_KEYWORDS) {
        if (pattern.test(lower)) {
            return {
                isClean: false,
                matchedKeyword: `Konten mengandung istilah terlarang yang dilarang oleh sistem keamanan (${pattern.source})`,
            };
        }
    }

    // 2. Cek Link / Domain Mencurigakan
    for (const pattern of SUSPICIOUS_URL_PATTERNS) {
        if (pattern.test(text)) {
            return {
                isClean: false,
                matchedKeyword: "Teks terdeteksi mengandung tautan eksternal atau link mencurigakan.",
            };
        }
    }

    return { isClean: true };
}

/**
 * Validasi Konten Formulir Publik (Kotak Aspirasi, Berita, Komentar)
 */
export function validatePublicSubmission(data: {
    title?: string;
    content?: string;
    category?: string;
}): { isValid: boolean; error?: string } {
    if (data.title) {
        const titleCheck = containsJudolOrSpam(data.title);
        if (!titleCheck.isClean) {
            return {
                isValid: false,
                error: "Judul ditolak oleh sistem keamanan: Terdeteksi kata kunci terlarang atau spam tautan.",
            };
        }
    }

    if (data.content) {
        const contentCheck = containsJudolOrSpam(data.content);
        if (!contentCheck.isClean) {
            return {
                isValid: false,
                error: "Isi pesan/konten ditolak: Terdeteksi materi promosi ilegal atau link mencurigakan.",
            };
        }
    }

    return { isValid: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. OPEN REDIRECT SHIELD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Memastikan URL redirect hanya mengarah ke rute internal lokal aplikasi kita
 * Menolak skema http://, https://, //, javascript:, data:
 */
export function sanitizeRedirectUrl(url?: string | null, fallback: string = "/student/dashboard"): string {
    if (!url || typeof url !== "string") return fallback;

    const trimmed = url.trim();

    // Hanya izinkan relative path yang diawali dengan '/' tunggal
    // Menolak: 'http://', 'https://', '//external.com', 'javascript:alert(1)', '\\'
    if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\")) {
        return trimmed;
    }

    return fallback;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. ANTI-BRUTE FORCE RATE LIMITER (IN-MEMORY WITH EXPIRY CLEANUP)
// ═══════════════════════════════════════════════════════════════════════════════

interface RateLimitRecord {
    attempts: number;
    firstAttemptTime: number;
    lockedUntil: number | null;
}

const loginAttemptsMap = new Map<string, RateLimitRecord>();

const MAX_FAILED_ATTEMPTS = 5; // Maksimal 5 percobaan gagal
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // Jendela waktu 15 menit
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // Dibekukan selama 15 menit

/**
 * Membersihkan record rate limit yang sudah kedaluwarsa secara berkala
 */
function cleanupExpiredRecords() {
    const now = Date.now();
    for (const [key, record] of loginAttemptsMap.entries()) {
        if (record.lockedUntil && record.lockedUntil < now) {
            loginAttemptsMap.delete(key);
        } else if (!record.lockedUntil && now - record.firstAttemptTime > ATTEMPT_WINDOW_MS) {
            loginAttemptsMap.delete(key);
        }
    }
}

// Jalankan cleanup setiap 10 menit
if (typeof setInterval !== "undefined") {
    setInterval(cleanupExpiredRecords, 10 * 60 * 1000);
}

/**
 * Memeriksa apakah identifier/IP sedang dibekukan karena terlalu banyak gagal login
 */
export function checkRateLimit(identifier: string): { isLocked: boolean; remainingLockoutMinutes?: number } {
    const key = identifier.toLowerCase().trim();
    const now = Date.now();
    const record = loginAttemptsMap.get(key);

    if (!record) {
        return { isLocked: false };
    }

    // Jika sedang dalam masa lockout
    if (record.lockedUntil) {
        if (now < record.lockedUntil) {
            const remainingMinutes = Math.ceil((record.lockedUntil - now) / (60 * 1000));
            return { isLocked: true, remainingLockoutMinutes: remainingMinutes };
        } else {
            // Lockout sudah berakhir, hapus record
            loginAttemptsMap.delete(key);
            return { isLocked: false };
        }
    }

    // Jika window waktu sudah lewat tapi belum terkunci
    if (now - record.firstAttemptTime > ATTEMPT_WINDOW_MS) {
        loginAttemptsMap.delete(key);
        return { isLocked: false };
    }

    return { isLocked: false };
}

/**
 * Mencatat percobaan login yang gagal
 */
export function recordFailedLogin(identifier: string): { isNowLocked: boolean; remainingAttempts: number; lockoutMinutes?: number } {
    const key = identifier.toLowerCase().trim();
    const now = Date.now();
    let record = loginAttemptsMap.get(key);

    if (!record || now - record.firstAttemptTime > ATTEMPT_WINDOW_MS) {
        record = {
            attempts: 1,
            firstAttemptTime: now,
            lockedUntil: null,
        };
        loginAttemptsMap.set(key, record);
        return { isNowLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - 1 };
    }

    record.attempts += 1;

    if (record.attempts >= MAX_FAILED_ATTEMPTS) {
        record.lockedUntil = now + LOCKOUT_DURATION_MS;
        return {
            isNowLocked: true,
            remainingAttempts: 0,
            lockoutMinutes: Math.ceil(LOCKOUT_DURATION_MS / (60 * 1000)),
        };
    }

    return {
        isNowLocked: false,
        remainingAttempts: MAX_FAILED_ATTEMPTS - record.attempts,
    };
}

/**
 * Mereset status rate limit setelah login berhasil
 */
export function recordSuccessfulLogin(identifier: string): void {
    const key = identifier.toLowerCase().trim();
    loginAttemptsMap.delete(key);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. DUMMY HASH FOR TIMING ATTACK MITIGATION
// ═══════════════════════════════════════════════════════════════════════════════

// Pre-computed constant hash untuk mensimulasikan waktu eksekusi bcrypt saat user tidak ditemukan
export const DUMMY_HASH = "$2a$10$7EqJtq98hPqEX7fNZaFWoOimq3oI4nO0LqgQpB1zKzLgO5A8tW02y";

/**
 * Memastikan eksekusi hashing selalu konsisten untuk mencegah timing attacks
 */
export async function dummyHashComparison(password: string): Promise<void> {
    try {
        await bcrypt.compare(password, DUMMY_HASH);
    } catch {
        // Ignored
    }
}
