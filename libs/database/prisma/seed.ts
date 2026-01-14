import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create default admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ichibytes.dev" },
    update: {},
    create: {
      email: "admin@ichibytes.dev",
      passwordHash: adminPassword,
      role: "ADMIN",
      name: "Admin User",
    },
  });

  console.log("Created admin user:", admin.email);

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "typescript" },
      update: {},
      create: {
        name: "TypeScript",
        slug: "typescript",
      },
    }),
    prisma.tag.upsert({
      where: { slug: "react" },
      update: {},
      create: {
        name: "React",
        slug: "react",
      },
    }),
    prisma.tag.upsert({
      where: { slug: "nestjs" },
      update: {},
      create: {
        name: "NestJS",
        slug: "nestjs",
      },
    }),
    prisma.tag.upsert({
      where: { slug: "web-development" },
      update: {},
      create: {
        name: "Web Development",
        slug: "web-development",
      },
    }),
  ]);

  console.log(`Created ${tags.length} tags`);

  // Create sample project
  const project = await prisma.project.upsert({
    where: { slug: "ichibytes-website" },
    update: {},
    create: {
      title: "Ichibytes Website",
      slug: "ichibytes-website",
      description:
        "Personal website and portfolio built with Next.js, NestJS, and Prisma.",
      featured: true,
      order: 1,
      techStack: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "TypeScript"],
      links: {
        github: "https://github.com/Ichibytes/ichibytes",
        demo: "https://ichibytes.dev",
      },
      tags: {
        create: tags.slice(0, 3).map((tag) => ({
          tagId: tag.id,
        })),
      },
    },
  });

  console.log("Created sample project:", project.title);

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
