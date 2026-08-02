FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/integration build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/packages/contracts/dist /app/packages/contracts/dist
COPY --from=builder /app/services/integration/dist /app/services/integration/dist
EXPOSE 3130
WORKDIR /app/services/integration
CMD ["node", "dist/src/main.js"]
