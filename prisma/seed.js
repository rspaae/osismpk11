require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
        {
            email: 'admin@smkn11bdg.sch.id',
            name: 'Super Admin',
            role: 'ADMINISTRATOR',
        },
        {
            email: 'pembina@smkn11bdg.sch.id',
            name: 'Pak Budi (Pembina)',
            role: 'PEMBINA',
        },
        {
            email: 'ketua@smkn11bdg.sch.id',
            name: 'Andi Sulaeman (Ketua OSIS)',
            role: 'DEWAN',
        },
        {
            email: 'pengurus@smkn11bdg.sch.id',
            name: 'Rina (Sekbid 1)',
            role: 'OSIS_OFFICER',
        },
        {
            email: 'siswa@smkn11bdg.sch.id',
            name: 'Rafi (Siswa)',
            role: 'STUDENT',
        }
    ];

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: { role: u.role },
            create: {
                ...u,
                password: hashedPassword,
            },
        });
        console.log(`User ${user.email} with role ${user.role} ensured.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
