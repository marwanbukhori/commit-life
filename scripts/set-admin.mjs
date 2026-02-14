import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.log("Usage: node set-admin.mjs <email>");
        const users = await prisma.user.findMany();
        console.log("Existing users:", users.map(u => u.email));
        return;
    }

    const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    });
    console.log(`User ${user.email} is now ADMIN.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
