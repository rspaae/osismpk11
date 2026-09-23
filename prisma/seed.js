require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Menyiapkan 1 akun Administrator OSIM11 SMKN 11 Bandung...');
    const defaultPassword = await bcrypt.hash('password123', 10);

    // 1. Inisialisasi Periode Kepengurusan Aktif (2025/2026)
    const activePeriod = await prisma.academicPeriod.upsert({
        where: {
            yearStart_yearEnd: {
                yearStart: 2025,
                yearEnd: 2026,
            },
        },
        update: {
            name: '2025/2026',
            cabinetNameOsis: 'Navastra',
            cabinetNameMpk: 'Navandya',
            theme: 'Sinergi Aksi, Nyata Berprestasi untuk SMKN 11 Bandung Juara',
            isActive: true,
            startDate: new Date('2025-07-01'),
            endDate: new Date('2026-06-30'),
        },
        create: {
            name: '2025/2026',
            yearStart: 2025,
            yearEnd: 2026,
            cabinetNameOsis: 'Navastra',
            cabinetNameMpk: 'Navandya',
            theme: 'Sinergi Aksi, Nyata Berprestasi untuk SMKN 11 Bandung Juara',
            isActive: true,
            startDate: new Date('2025-07-01'),
            endDate: new Date('2026-06-30'),
        },
    });

    // 2. Buat HANYA 1 Akun Administrator Tunggal
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@smkn11bdg.sch.id' },
        update: {
            name: 'Administrator OSIM11',
            role: 'ADMINISTRATOR',
            division: 'GENERAL',
            position: 'Administrator Utama',
            periodId: activePeriod.id,
            isActive: true,
        },
        create: {
            email: 'admin@smkn11bdg.sch.id',
            name: 'Administrator OSIM11',
            role: 'ADMINISTRATOR',
            division: 'GENERAL',
            position: 'Administrator Utama',
            password: defaultPassword,
            periodId: activePeriod.id,
            isActive: true,
        },
    });

    console.log(`✅ [${adminUser.role}] ${adminUser.email} (${adminUser.name}) berhasil dibuat!`);
    console.log('🎉 Selesai! Hanya terdapat 1 akun Administrator di sistem.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
