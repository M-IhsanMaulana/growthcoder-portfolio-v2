# ==========================================
# 1. Base Image with PNPM
# ==========================================
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@latest
RUN apk add --no-cache libc6-compat python3 make g++

# ==========================================
# 2. Dependencies Resolution Stage
# ==========================================
FROM base AS deps
WORKDIR /app

# Copy root workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package manifests across workspace
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/cms/package.json ./apps/cms/

# Install all monorepo dependencies
RUN pnpm install --no-frozen-lockfile

# ==========================================
# 3. Build Stage
# ==========================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps ./apps
COPY . .

# Build API application (creates compiled JS in apps/api/build)
RUN pnpm --filter @growthcoder/api build

# ==========================================
# 4. Production Runner Stage
# ==========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333
ENV HOST=0.0.0.0

# Copy compiled build output from AdonisJS build
COPY --from=builder /app/apps/api/build ./

# Copy entrypoint script
COPY apps/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Remove workspace:* dependencies from build package.json & install production dependencies
RUN sed -i '/@growthcoder/d' ./package.json && npm install --omit=dev --no-audit --no-fund

# Create storage upload directory with proper permissions and curl for health checks
RUN apk add --no-cache curl && mkdir -p ./storage/uploads

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3333/health || exit 1

ENTRYPOINT ["./entrypoint.sh"]
