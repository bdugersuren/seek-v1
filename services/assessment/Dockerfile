FROM node:18-slim AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/assessment build

FROM node:18-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
COPY scripts/service-entrypoint.sh /usr/local/bin/service-entrypoint.sh
COPY services/assessment/package.json /app/services/assessment/package.json
COPY services/assessment/prisma /app/services/assessment/prisma
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages/contracts /app/packages/contracts
COPY --from=builder /app/services/assessment/dist /app/services/assessment/dist
EXPOSE 3070
ENV SERVICE_DIR=/app/services/assessment
WORKDIR /app/services/assessment
ENTRYPOINT ["service-entrypoint.sh"]
