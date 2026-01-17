# Admin Application

React admin panel for managing the Ichibytes website.

## Features

- User authentication
- Content management (posts, projects)
- Media management
- Analytics dashboard
- User management

## Technology

- React 18
- Vite
- TypeScript
- TailwindCSS

## Configuration

This application uses the centralized `@ichibytes/config` library for environment variables.

### Environment Variables

All environment variables are validated at build time. See [Environment Variables Documentation](../../docs/ENVIRONMENT_VARIABLES.md) for the complete list.

**Required variables:**

- None (all have defaults for development)

**Optional variables:**

```bash
VITE_API_URL=http://localhost:3000/api/v1
VITE_SITE_NAME=Ichibytes Admin
VITE_ENABLE_DEBUG=false
```
