FROM node:18-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
WORKDIR /app/services/auth
RUN npx prisma generate --schema=prisma/schema.prisma
WORKDIR /app
RUN pnpm --filter @seek/auth build

FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
WORKDIR /app/services/auth
RUN npx prisma generate --schema=prisma/schema.prisma
COPY --from=builder /app/services/auth/dist /app/services/auth/dist
EXPOSE 3020
WORKDIR /app/services/auth
CMD ["node", "dist/main.js"]
