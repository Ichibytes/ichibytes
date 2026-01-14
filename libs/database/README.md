# Database Library

This library contains the Prisma schema, database service, and utilities for the Ichibytes website.

## Structure

```
libs/database/
├── prisma/
│   ├── schema.prisma      # Prisma schema definition
│   ├── migrations/         # Database migrations
│   ├── seed.ts             # Database seeding script
│   └── MIGRATIONS.md        # Migration documentation
└── src/
    ├── lib/
    │   ├── prisma.service.ts    # NestJS Prisma service
    │   ├── prisma.module.ts     # NestJS Prisma module
    │   └── utils/               # Database utilities
    │       ├── slug.util.ts     # Slug generation utilities
    │       └── validation.util.ts # Validation utilities
    └── index.ts                 # Library exports
```

## Usage

### Import PrismaService

```typescript
import { PrismaService } from "@ichibytes/database";

@Injectable()
export class MyService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }
}
```

### Import Utilities

```typescript
import { generateSlug, isValidEmail } from "@ichibytes/database";

const slug = generateSlug("My Blog Post"); // 'my-blog-post'
const isValid = isValidEmail("test@example.com"); // true
```

## Prisma Schema

The schema defines the following models:

- **User** - Admin users with roles (ADMIN, EDITOR, VIEWER)
- **Post** - Blog posts with status workflow
- **Project** - Portfolio projects
- **Media** - Uploaded media files
- **Tag** - Tags for posts and projects
- **PostRevision** - Post versioning
- **AuditLog** - Activity tracking

See `prisma/schema.prisma` for full schema definition.

## Migrations

See [MIGRATIONS.md](./prisma/MIGRATIONS.md) for migration workflow and best practices.

### Quick Commands

```bash
# Create and apply migration
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy

# Generate Prisma Client
npm run db:generate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Environment Variables

Required environment variable:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ichibytes?schema=public"
```

## Development

1. Make changes to `prisma/schema.prisma`
2. Run `npm run db:migrate` to create and apply migration
3. Prisma Client will be automatically regenerated

## Testing

When testing with Prisma:

- Use a separate test database
- Run migrations before tests
- Clean up test data after tests
