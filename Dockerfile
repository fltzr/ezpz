# Build stage
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile
RUN pnpm run build

FROM base

RUN pnpm i -g serve
COPY --from=build /app/dist /app/dist

RUN addgroup -S ezgroup && adduser -S ezuser -G ezgroup
USER ezuser

EXPOSE 4000

CMD ["pnpm", "serve", "-s", "dist", "-p", "4000"]