import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Add seed data here
  console.log("Seeding database...");

  // Example: Create a default admin user
  // const admin = await prisma.user.create({
  //   data: {
  //     email: 'admin@example.com',
  //     passwordHash: 'hashed_password_here',
  //     role: 'admin',
  //   },
  // });

  console.log("Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
