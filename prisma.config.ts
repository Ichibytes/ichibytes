import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "libs/database/prisma/schema.prisma",
  migrations: {
    path: "libs/database/prisma/migrations",
  },
  datasource: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://dummy:dummy@localhost:5432/dummy",
  },
});
