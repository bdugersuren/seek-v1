FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @seek/verification build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/packages/contracts/dist /app/packages/contracts/dist
COPY --from=builder /app/services/verification/dist /app/services/verification/dist
EXPOSE 3050
WORKDIR /app/services/verification
CMD ["node", "dist/src/main.js"]
