FROM oven/bun:1.0.4-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* bun.lockb* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f bun.lockb ]; then bun install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build


FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
CMD ["bun", "./dist/index.js"]

