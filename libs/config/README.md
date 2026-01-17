# @ichibytes/config

Centralized configuration management library for the Ichibytes monorepo.

## Features

- ✅ **Type-safe**: Full TypeScript support with Zod validation
- ✅ **Centralized**: Single source of truth for all environment variables
- ✅ **Validated**: Runtime validation with clear error messages
- ✅ **Multi-environment**: Support for development, production, and test environments
- ✅ **Framework agnostic**: Works with NestJS, Next.js, React, and any Node.js application

## Installation

This library is part of the Ichibytes monorepo and is automatically available to all projects.

```typescript
import { apiConfig, webConfig, nestjsConfigModule } from "@ichibytes/config";
```

## Usage

### NestJS Applications

```typescript
import { Module } from "@nestjs/common";
import { nestjsConfigModule } from "@ichibytes/config";

@Module({
  imports: [nestjsConfigModule],
  // ...
})
export class AppModule {}
```

Then inject the validated config:

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiConfig } from "@ichibytes/config";

@Injectable()
export class MyService {
  constructor(private configService: ConfigService<ApiConfig>) {}

  someMethod() {
    const jwtSecret = this.configService.get("JWT_SECRET", { infer: true });
    // jwtSecret is fully typed!
  }
}
```

### Next.js / React Applications

```typescript
import { webConfig } from "@ichibytes/config";

// Access validated config
const apiUrl = webConfig.NEXT_PUBLIC_API_URL;
const environment = webConfig.NODE_ENV;
```

### Direct Access (any Node.js app)

```typescript
import { apiConfig } from "@ichibytes/config";

// Access validated API configuration
console.log(apiConfig.PORT);
console.log(apiConfig.DATABASE_URL);
```

## Configuration Schemas

### API Configuration

Environment variables for the NestJS API:

- `NODE_ENV`: Environment (development, production, test)
- `PORT`: Server port
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: JWT expiration time
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration time
- `ADMIN_URL`: Admin application URL (for CORS)
- `WEB_URL`: Web application URL (for CORS)
- `S3_*`: S3/MinIO configuration

### Web Configuration

Environment variables for Next.js applications:

- `NODE_ENV`: Environment
- `NEXT_PUBLIC_API_URL`: API base URL
- `NEXT_PUBLIC_SITE_URL`: Site URL

## Environment Files

Create a `.env` file at the workspace root:

```bash
# See .env.example for all available variables
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/ichibytes
JWT_SECRET=your-secret-key
# ... more variables
```

## Validation

All environment variables are validated at application startup. If any required variable is missing or invalid, the application will fail to start with a clear error message.

## Adding New Variables

1. Update the schema in `libs/config/src/lib/schemas/`
2. Export the new schema from `libs/config/src/index.ts`
3. Update `.env.example` with the new variable
4. Update this README

## Testing

The library includes tests for all validation schemas:

```bash
nx test config
```
