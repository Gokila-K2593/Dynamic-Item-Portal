# Stage 1 — Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2 — Build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3 — Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./

# Copy the FULL node_modules so prisma CLI is already present — no npx download
COPY --from=builder /app/node_modules ./node_modules

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000
CMD ["./docker-entrypoint.sh"]