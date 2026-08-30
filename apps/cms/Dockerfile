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

# Install dependencies
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

# Build CMS application (Next.js standalone)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MEDIA_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MEDIA_URL=$NEXT_PUBLIC_MEDIA_URL

RUN pnpm --filter @growthcoder/cms build

# ==========================================
# 4. Production Runner Stage (Standalone)
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Don't run production container as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public static files
COPY --from=builder /app/apps/cms/public ./apps/cms/public

# Set permissions for prerender cache
RUN mkdir -p ./apps/cms/.next
RUN chown nextjs:nodejs ./apps/cms/.next

# Copy standalone output from Next.js build
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/static ./apps/cms/.next/static

USER nextjs

EXPOSE 3001

CMD ["node", "apps/cms/server.js"]
