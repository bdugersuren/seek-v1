FROM node:18-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/contracts build
RUN pnpm --filter @seek/execution build

FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
COPY scripts/service-entrypoint.sh /usr/local/bin/service-entrypoint.sh
COPY services/execution/package.json /app/services/execution/package.json
COPY services/execution/prisma /app/services/execution/prisma
COPY --from=builder /app/packages/contracts/dist /app/packages/contracts/dist
COPY --from=builder /app/services/execution/dist /app/services/execution/dist
EXPOSE 3090
ENV SERVICE_DIR=/app/services/execution
WORKDIR /app/services/execution
ENTRYPOINT ["service-entrypoint.sh"]
