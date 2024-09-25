# Build stage
FROM node:alpine AS base

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN npm ci -f --omit=dev

FROM base AS build
RUN npm ci -f
RUN npm run build

FROM base

RUN npm i -g serve
COPY --from=build /app/dist /app/dist

RUN addgroup -S ezgroup && adduser -S ezuser -G ezgroup
USER ezuser

EXPOSE 4000

CMD ["npm", "run", "serve"]
