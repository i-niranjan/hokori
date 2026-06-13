# Build from the repo root so the workspace packages are in context:
#   docker build -f apps/server/Dockerfile -t hokori-server .

FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies first so this layer is cached across source changes.
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY apps/server/package.json apps/server/
COPY packages/types/package.json packages/types/
RUN --mount=type=cache,target=/root/.npm npm ci

COPY packages/types packages/types
COPY apps/server apps/server

# prisma.config.ts resolves DATABASE_URL when the CLI loads it, so the build
# needs a placeholder; the real URL is injected at runtime. Loose env mode
# lets the placeholder through turbo's strict env filtering.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN --mount=type=cache,target=/app/.turbo npx turbo build --filter=@hokori/server --env-mode=loose

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app /app

EXPOSE 3003
WORKDIR /app/apps/server
# Apply pending migrations, then start the API.
CMD ["sh", "-c", "npx prisma migrate deploy --config prisma.config.ts && node dist/index.js"]
