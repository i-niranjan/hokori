# Build from the repo root so the workspace packages are in context:
#   docker build -f apps/web/Dockerfile -t hokori-web \
#     --build-arg VITE_API_URL=http://localhost:3003 .

FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/
COPY packages/types/package.json packages/types/
RUN npm ci

COPY packages/types packages/types
COPY apps/web apps/web

# Vite inlines these at build time; they must be passed as build args.
ARG VITE_API_URL
ARG VITE_IMAGEKIT_PUBLIC_KEY
ENV VITE_API_URL=$VITE_API_URL \
    VITE_IMAGEKIT_PUBLIC_KEY=$VITE_IMAGEKIT_PUBLIC_KEY
RUN npx turbo build --filter=@hokori/web

FROM nginx:1.27-alpine AS runner
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
