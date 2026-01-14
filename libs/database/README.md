# Database Library

Prisma schema, database services, and database-related utilities.

## Contents

- Prisma schema (`prisma/schema.prisma`)
- PrismaService (NestJS service)
- PrismaModule (NestJS module)
- Database utilities
- Seed scripts

## Usage

Import PrismaModule in your NestJS application:

```typescript
import { PrismaModule } from "database";

@Module({
  imports: [PrismaModule],
  // ...
})
export class AppModule {}
```

Then inject PrismaService:

```typescript
import { PrismaService } from "database";

@Injectable()
export class MyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }
}
```

## Technology

- Prisma
- PostgreSQL
- NestJS
- TypeScript
- Jest
