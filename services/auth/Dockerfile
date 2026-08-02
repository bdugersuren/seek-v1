FROM node:18-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
WORKDIR /app/services/auth
RUN /app/node_modules/.bin/prisma generate --schema=prisma/schema.prisma
WORKDIR /app
RUN pnpm --filter @seek/auth build

FROM node:18-slim
WORKDIR /app
RUN npm install -g pnpm
RUN apt-get update -y && apt-get install -y openssl
COPY scripts/service-entrypoint.sh /usr/local/bin/service-entrypoint.sh
COPY services/auth/package.json /app/services/auth/package.json
COPY services/auth/prisma /app/services/auth/prisma
COPY --from=builder /app/services/auth/dist /app/services/auth/dist
EXPOSE 3020
ENV SERVICE_DIR=/app/services/auth
WORKDIR /app/services/auth
ENTRYPOINT ["service-entrypoint.sh"]
