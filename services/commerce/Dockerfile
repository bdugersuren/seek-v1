FROM node:18-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/commerce build

FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
COPY scripts/service-entrypoint.sh /usr/local/bin/service-entrypoint.sh
COPY services/commerce/package.json /app/services/commerce/package.json
COPY services/commerce/prisma /app/services/commerce/prisma
COPY --from=builder /app/services/commerce/dist /app/services/commerce/dist
EXPOSE 3080
ENV SERVICE_DIR=/app/services/commerce
WORKDIR /app/services/commerce
ENTRYPOINT ["service-entrypoint.sh"]
