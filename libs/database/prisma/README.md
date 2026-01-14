# Prisma Setup

This directory contains the Prisma schema and migrations for the database.

## Schema Location

The Prisma schema is located at: `libs/database/prisma/schema.prisma`

## Commands

All Prisma commands should be run from the workspace root with the `--schema` flag:

```bash
# Generate Prisma Client
npm run db:generate

# Create a new migration
npm run db:migrate

# Apply migrations (production)
npm run db:migrate:deploy

# Open Prisma Studio
npm run db:studio

# Seed the database
npm run db:seed
```

## Environment Variables

Set `DATABASE_URL` in your `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/ichibytes_dev
```

## Migration Workflow

1. Update `schema.prisma` with your changes
2. Run `npm run db:migrate` to create a migration
3. Review the generated migration files
4. Commit both schema and migration files

## Generated Client

Prisma Client is generated to `node_modules/.prisma/client` and can be imported as:

```typescript
import { PrismaClient } from "@prisma/client";
```
