FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@8 --activate
WORKDIR /app

# Dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Source
COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["node", "dist/main"]
