FROM node:20-alpine AS frontbase
FROM oven/bun:1.0.7-alpine AS backbase


FROM frontbase AS frontdeps
RUN apk add --no-cache libc6-compat
WORKDIR /app/frontend
COPY ./frontend/package.json ./frontend/yarn.lock* ./frontend/package-lock.json* ./frontend/pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM backbase AS backdeps
WORKDIR /app/backend
COPY ./backend/package.json ./backend/bun.lockb* ./
RUN bun install --frozen-lockfile

FROM backbase AS backdir
WORKDIR /app/backend
COPY --from=backdeps /app/backend/node_modules ./node_modules
COPY ./backend .

FROM frontbase AS frontbuilder
WORKDIR /app/frontend
COPY --from=frontdeps /app/frontend/node_modules ./node_modules
COPY --from=backdir /app/backend /app/backend
COPY ./frontend .

ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_BACKEND_HOST
ARG NEXT_PUBLIC_BACKEND_PORT
ENV NEXT_PUBLIC_APP_ENV ${NEXT_PUBLIC_APP_ENV}
ENV NEXT_PUBLIC_BACKEND_HOST ${NEXT_PUBLIC_BACKEND_HOST}
ENV NEXT_PUBLIC_BACKEND_PORT ${NEXT_PUBLIC_BACKEND_PORT}

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build


FROM frontbase AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=frontbuilder /app/frontend/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=frontbuilder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=frontbuilder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static
USER nextjs
CMD ["node", "server.js"]

