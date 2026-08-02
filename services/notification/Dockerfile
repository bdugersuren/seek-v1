FROM node:18-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/notification build

FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
COPY scripts/service-entrypoint.sh /usr/local/bin/service-entrypoint.sh
COPY services/notification/package.json /app/services/notification/package.json
COPY services/notification/prisma /app/services/notification/prisma
COPY --from=builder /app/services/notification/dist /app/services/notification/dist
EXPOSE 3170
ENV SERVICE_DIR=/app/services/notification
WORKDIR /app/services/notification
ENTRYPOINT ["service-entrypoint.sh"]
