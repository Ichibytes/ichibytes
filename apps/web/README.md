# Web Application

Next.js public website with SSG/ISR for SEO optimization.

## Features

- Blog posts (SSG/ISR)
- Projects showcase (SSG/ISR)
- About page
- Contact form
- SEO optimized (structured data, sitemap, RSS)

## Technology

- Next.js (App Router)
- TailwindCSS
- TypeScript
- SSG/ISR for performance

## Configuration

This application uses the centralized `@ichibytes/config` library for environment variables.

### Environment Variables

All environment variables are validated at runtime using Zod schemas. The configuration is imported from `@ichibytes/config/web`.

**Server Configuration:**

```bash
# Development server settings
NEXT_PORT=3001               # Server port (default: 3001)
NEXT_HOST=localhost          # Server host (default: localhost)
```

**Public Variables (exposed to browser):**

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

**Hardcoded Values:**

- `SITE_NAME`: "Ichibytes" (defined in `src/lib/config.ts`)
- `SITE_DESCRIPTION`: "Personal website and blog" (defined in `src/lib/config.ts`)
- `FEATURES`: Comments and newsletter flags (defined in `src/lib/config.ts`)

### Usage

Import the validated configuration in your components:

```typescript
import { config } from "../lib/config";

// Access validated config
console.log(config.apiUrl);
console.log(config.siteName);
console.log(config.features.comments);
```

### Development

```bash
# Start development server (uses NEXT_PORT and NEXT_HOST from env)
nx serve web

# Build for production
nx build web
```
