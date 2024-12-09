import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const guitars = await prisma.guitars.findMany();
        console.log("Fetched Guitars: ", guitars);
    } catch (error) {
        console.error("Error fetching guitars: ", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
