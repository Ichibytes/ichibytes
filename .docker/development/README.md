# Development Docker Compose

This directory contains Docker Compose configuration for local development services.

## Services

### PostgreSQL Database

A PostgreSQL 16 database container for local development (latest stable version for future-proofing).

**Default Configuration:**

- User: `ichibytes`
- Password: `password`
- Database: `ichibytes_dev`
- Port: `5432`

**Connection String:**

```
postgresql://ichibytes:password@localhost:5432/ichibytes_dev?schema=public
```

### Optional Services

The compose file includes commented-out services that can be enabled when needed:

- **pgAdmin 8**: Web-based PostgreSQL administration tool (stable version)
- **Redis 7**: For caching, sessions, and future features (current stable version)

## Quick Start

### 1. Set Up Environment Variables

Copy the example environment file:

```bash
cp .docker/development/.env.example .docker/development/.env
```

Edit `.docker/development/.env` if you need to change default values.

### 2. Start Services

From the workspace root:

```bash
docker compose -f .docker/development/compose.yaml up -d
```

Or using the npm script (if added to package.json):

```bash
npm run docker:dev:up
```

### 3. Verify Services

Check that containers are running:

```bash
docker compose -f .docker/development/compose.yaml ps
```

### 4. Connect to Database

The database is now available at `localhost:5432`.

Update your `.env` file in the workspace root:

```env
DATABASE_URL="postgresql://ichibytes:password@localhost:5432/ichibytes_dev?schema=public"
```

### 5. Run Migrations

```bash
npm run db:migrate
```

### 6. Seed Database

```bash
npm run db:seed
```

## Common Commands

### Start Services

```bash
docker compose -f .docker/development/compose.yaml up -d
```

### Stop Services

```bash
docker compose -f .docker/development/compose.yaml down
```

### Stop and Remove Volumes (⚠️ Deletes all data)

```bash
docker compose -f .docker/development/compose.yaml down -v
```

### View Logs

```bash
# All services
docker compose -f .docker/development/compose.yaml logs -f

# Specific service
docker compose -f .docker/development/compose.yaml logs -f postgres
```

### Access PostgreSQL CLI

```bash
docker compose -f .docker/development/compose.yaml exec postgres psql -U ichibytes -d ichibytes_dev
```

### Restart Services

```bash
docker compose -f .docker/development/compose.yaml restart
```

## Enabling Optional Services

### pgAdmin

1. Uncomment the `pgadmin` service in `compose.yaml`
2. Uncomment the `pgadmin_data` volume
3. Restart services: `docker compose -f .docker/development/compose.yaml up -d`
4. Access at `http://localhost:5050`
5. Login with credentials from `.env` file

### Redis

1. Uncomment the `redis` service in `compose.yaml`
2. Uncomment the `redis_data` volume
3. Restart services: `docker compose -f .docker/development/compose.yaml up -d`
4. Connect to Redis at `localhost:6379`

## Data Persistence

All data is stored in Docker volumes:

- `postgres_data`: PostgreSQL database files
- `pgadmin_data`: pgAdmin configuration (if enabled)
- `redis_data`: Redis data (if enabled)

Data persists even when containers are stopped. To completely remove data, use:

```bash
docker compose -f .docker/development/compose.yaml down -v
```

## Troubleshooting

### Port Already in Use

If port 5432 is already in use by a local PostgreSQL installation:

1. Stop local PostgreSQL: `brew services stop postgresql@15` (macOS)
2. Or change the port in `.docker/development/.env`: `POSTGRES_PORT=5433`
3. Update `DATABASE_URL` accordingly: `postgresql://...@localhost:5433/...`

### Container Won't Start

1. Check logs: `docker compose -f .docker/development/compose.yaml logs postgres`
2. Verify environment variables are set correctly
3. Check if ports are available: `lsof -i :5432`

### Database Connection Issues

1. Verify container is running: `docker compose -f .docker/development/compose.yaml ps`
2. Check health status: `docker compose -f .docker/development/compose.yaml ps`
3. Verify `DATABASE_URL` matches compose configuration
4. Test connection: `docker compose -f .docker/development/compose.yaml exec postgres psql -U ichibytes -d ichibytes_dev -c "SELECT 1;"`

### Reset Database

To completely reset the database:

```bash
# Stop and remove containers and volumes
docker compose -f .docker/development/compose.yaml down -v

# Start fresh
docker compose -f .docker/development/compose.yaml up -d

# Run migrations and seed
npm run db:migrate
npm run db:seed
```

## Integration with Nx Workspace

The database service is designed to work seamlessly with the Nx workspace:

1. Set `DATABASE_URL` in workspace root `.env` file
2. Run Prisma commands from workspace root
3. All Prisma commands will use the Docker PostgreSQL instance

## Production

⚠️ **This configuration is for development only!**

For production:

- Use managed database services (AWS RDS, Supabase, Neon, etc.)
- Use proper secrets management
- Configure proper security settings
- Set up backups and monitoring
