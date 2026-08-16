# Deploying Pets to Vercel

This project is a pnpm workspace with:

- `webapp`: Vite React static app
- `backend`: Express/tRPC API
- `shared`: shared TypeScript helpers
- Prisma PostgreSQL database

Vercel serves `webapp/dist` as static files and runs the tRPC backend as a serverless function at `/api/trpc/*`.

## Vercel Project Settings

Import the GitHub repository into Vercel and keep the Root Directory as the repository root.

The repository includes `vercel.json`, so Vercel should use these settings automatically:

- Install Command: `corepack enable && pnpm install --frozen-lockfile`
- Build Command: `pnpm vercel-build`
- Output Directory: `webapp/dist`

## Database

Create or connect a PostgreSQL database before the first successful deployment.

Recommended options inside Vercel:

- Marketplace Storage: Neon Postgres
- Marketplace Storage: Supabase Postgres
- Marketplace Storage: AWS Aurora Postgres

The database must provide a PostgreSQL connection string in `DATABASE_URL`.

The build command runs:

```bash
prisma migrate deploy
```

That applies the migrations from `backend/src/prisma/migrations` during deployment.

## Required Environment Variables

Set these for Production, Preview, and Development unless you intentionally want different values per environment:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
JWT_SECRET=<long-random-secret>
PASSWORD_SALT=<long-random-secret>
INITIAL_ADMIN_PASSWORD=<temporary-admin-password>
CLOUDINARY_CLOUD_NAME=dcs8xpfpn
```

Set these if Cloudinary uploads should work:

```bash
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
```

Optional integrations:

```bash
BACKEND_SENTRY_DSN=<optional>
VITE_WEBAPP_SENTRY_DSN=<optional>
VITE_MIXPANEL_API_KEY=<optional>
```

Usually you do not need to set these on Vercel because the project now derives them automatically:

```bash
HOST_ENV=production
SOURCE_VERSION=<vercel-git-sha>
WEBAPP_URL=https://<deployment-domain>
VITE_WEBAPP_URL=https://<deployment-domain>
VITE_BACKEND_TRPC_URL=/api/trpc
VITE_CLOUDINARY_CLOUD_NAME=<CLOUDINARY_CLOUD_NAME>
```

## First Login

On backend cold start, the app upserts an admin user:

- Nick: `admin`
- Email: `admin@example.com`
- Password: the value of `INITIAL_ADMIN_PASSWORD`

Change the password after deployment.

## Useful Vercel Docs

- Storage Marketplace: https://vercel.com/docs/marketplace-storage
- Postgres on Vercel: https://vercel.com/docs/postgres
- Environment Variables: https://vercel.com/docs/environment-variables
- Build Configuration: https://vercel.com/docs/builds/configure-a-build
