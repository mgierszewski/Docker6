
# Multi-stage Dockerfile for Frontend
ARG NGINX_VERSION

# Builder stage
FROM alpine AS builder
WORKDIR /app
COPY . .

# Production stage
FROM nginx:alpine AS prod
ARG NGINX_VERSION
LABEL version=$NGINX_VERSION
COPY --from=builder /app/*.html /usr/share/nginx/html/
COPY --from=builder /app/*.js /usr/share/nginx/html/
COPY --from=builder /app/*.css /usr/share/nginx/html/
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
