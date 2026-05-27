FROM node:22-alpine AS build

WORKDIR /workspace

COPY package.json package-lock.json ./
COPY app/package.json app/package.json
COPY kernel/package.json kernel/package.json
COPY api/package.json api/package.json
COPY supabase/functions/package.json supabase/functions/package.json

RUN npm ci

COPY app ./app

RUN npm run build --workspace app

FROM nginx:1.27-alpine

COPY docker/nginx/app.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
