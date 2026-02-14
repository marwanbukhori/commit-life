const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    if (users.length === 0) { console.log('No users found in database.'); return; }

    console.log('Current Users:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));

    // Automatically promote the first user found to ADMIN for testing purposes
    if (users.length > 0) {
        const u = users[0];
        if (u.role !== 'ADMIN') {
            await prisma.user.update({
                where: { id: u.id },
                data: { role: 'ADMIN' }
            });
            console.log(`Updated user ${u.email} (ID: ${u.id}) to ADMIN role.`);
        } else {
            console.log(`User ${u.email} is already ADMIN.`);
        }
    }
}

main()
    .catch((e) => {
        console.error("Error updating user role:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
