# syntax=docker/dockerfile:1

# Suika UI — design guide image.
#
# Targets:
#   runtime (default)  Production build of the design guide served by nginx on port 80.
#   dev                Angular dev server with hot reload on port 4200 (use with a bind mount).
#
# Node 24 LTS satisfies Angular 20+ (Angular 21/22 require Node ^20.19, ^22.12 or >=24).

ARG NODE_VERSION=24-alpine
ARG NGINX_VERSION=1.29-alpine

# ---------- Dependencies ----------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
ENV NG_CLI_ANALYTICS=false
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# ---------- Dev server ----------
FROM deps AS dev
COPY . .
EXPOSE 4200
# --poll makes file watching reliable on bind mounts (Windows / macOS hosts).
CMD ["npx", "ng", "serve", "design-guide", "--host", "0.0.0.0", "--port", "4200", "--poll", "1000"]

# ---------- Build ----------
FROM deps AS build
COPY . .
# Build the library first to validate the publishable package, then the design guide.
RUN npx ng build suika-ui \
 && npx ng build design-guide --configuration production

# ---------- Runtime ----------
FROM nginx:${NGINX_VERSION} AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/design-guide/browser /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
