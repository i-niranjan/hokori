# Hokori Turborepo Commands

## Setup

Install all workspace dependencies from the repo root:

```bash
npm install
```

## Development

Run every app in dev mode:

```bash
npm run dev
```

The server dev task builds `@hokori/types` and runs `prisma generate` before starting nodemon, so shared types and Prisma Client are refreshed whenever you start the full workspace dev command.

Run only the web app:

```bash
npm run dev:web
```

Run only the server app:

```bash
npm run dev:server
```

Regenerate Prisma Client manually from the server workspace:

```bash
npm run prisma:generate --workspace=@hokori/server
```

## Build And Checks

Build every app and package:

```bash
npm run build
```

Type-check every workspace:

```bash
npm run typecheck
```

Lint every workspace that has a lint script:

```bash
npm run lint
```

## Workspace Layout

- `apps/web` contains the Vite React frontend.
- `apps/server` contains the Express API and Prisma setup.
- `packages/types` contains shared TypeScript types used by both apps.

Keep dependency installs at the repo root so npm can manage workspace links and Turbo can cache work consistently.
