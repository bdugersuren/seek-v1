FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile

ARG NEXT_PUBLIC_API_URL=http://quiz-api.seek.mn/api
ARG NEXT_PUBLIC_ASSESSMENT_WEB_URL=http://localhost:8082
ARG INTERNAL_API_URL=http://gateway:3010/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ASSESSMENT_WEB_URL=$NEXT_PUBLIC_ASSESSMENT_WEB_URL
ENV INTERNAL_API_URL=$INTERNAL_API_URL

RUN pnpm --filter @seek/contracts build
RUN pnpm --filter @seek/portal-web build
EXPOSE 8081
CMD ["pnpm", "--filter", "@seek/portal-web", "start"]
