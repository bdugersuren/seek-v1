FROM node:18-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/contracts build
WORKDIR /app/services/file
RUN /app/node_modules/.bin/prisma generate --schema=prisma/schema.prisma
WORKDIR /app
RUN pnpm --filter @seek/file build

FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
COPY scripts/service-entrypoint.sh /usr/local/bin/service-entrypoint.sh
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages/contracts /app/packages/contracts
COPY services/file/package.json /app/services/file/package.json
COPY services/file/prisma /app/services/file/prisma
COPY --from=builder /app/services/file/dist /app/services/file/dist
EXPOSE 3140
ENV SERVICE_DIR=/app/services/file
WORKDIR /app/services/file
ENTRYPOINT ["service-entrypoint.sh"]
