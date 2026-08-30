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
RUN pnpm install --frozen-lockfile

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

# Copy packages needed by build workspace if any
COPY --from=builder /app/packages ./packages

# Install production dependencies inside build directory
RUN npm install --omit=dev --no-audit --no-fund

# Copy entrypoint script
COPY apps/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Create storage upload directory with proper permissions
RUN mkdir -p ./storage/uploads

EXPOSE 3333

ENTRYPOINT ["./entrypoint.sh"]
